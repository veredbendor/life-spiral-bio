# Life Spiral Bio - Software Architecture

## Design Principles

1. **Modularity** - Features are self-contained and loosely coupled
2. **Scalability** - Start simple, design for growth
3. **Testability** - Business logic separated from infrastructure
4. **API-First** - Backend serves any client, not just our frontend

---

## Architecture Overview

### Modular Monolith

For an early-stage app that may grow, we use a modular monolith approach - a single deployable backend organized into distinct modules with clear boundaries. This gives us the simplicity of a monolith for fast iteration while maintaining separation that allows extracting services later if needed.

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Recording  │  │    Story     │  │   Timeline   │  ...      │
│  │   Feature    │  │   Feature    │  │   Feature    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│         │                 │                 │                    │
│         └─────────────────┴─────────────────┘                    │
│                           │                                      │
│                    API Client Layer                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND (FastAPI)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    API Layer (/api/v1/)                  │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │    │
│  │  │  recording  │ │    story    │ │    user     │  ...   │    │
│  │  │   routes    │ │   routes    │ │   routes    │        │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Service Layer                         │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │    │
│  │  │ transcription│ │   story     │ │    user     │  ...   │    │
│  │  │   service   │ │  service    │ │   service   │        │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  External Integrations                   │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │    │
│  │  │   OpenAI    │ │  Database   │ │   Storage   │  ...   │    │
│  │  │  (Whisper)  │ │ (PostgreSQL)│ │    (S3)     │        │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Processing Pipeline

The core voice-to-story flow is designed as a pipeline where each step is a discrete operation. This makes it easy to swap implementations, add steps, or parallelize work.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   RECORD    │     │ TRANSCRIBE  │     │  GENERATE   │     │   OUTPUT    │
│             │────►│             │────►│             │────►│             │
│  Audio Blob │     │   Whisper   │     │   GPT-4     │     │   Story     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │                   │
      ▼                   ▼                   ▼                   ▼
   Browser           OpenAI API          OpenAI API           Frontend
   MediaRecorder     audio → text        text → narrative     Display
```

### Pipeline Benefits

- **Swappable**: Replace Whisper with Deepgram without changing other steps
- **Extensible**: Add sentiment analysis, keyword extraction between steps
- **Scalable**: Move to async job queue (Redis/Celery) when needed
- **Reusable**: Future features (photo descriptions, document scanning) follow same pattern

---

## Frontend Structure

Feature-based organization where each capability is self-contained:

```
frontend/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Home/Welcome
│   ├── record/
│   │   └── page.tsx          # Recording flow
│   ├── story/
│   │   └── [id]/page.tsx     # Story display
│   └── layout.tsx
│
├── features/                 # Feature modules
│   ├── recording/
│   │   ├── components/       # RecordButton, AudioPreview, etc.
│   │   ├── hooks/            # useRecorder, useAudioUpload
│   │   └── api.ts            # API calls for this feature
│   │
│   ├── story/
│   │   ├── components/       # StoryCard, CopyButton, etc.
│   │   ├── hooks/            # useStory
│   │   └── api.ts
│   │
│   └── shared/               # Cross-feature components
│       ├── components/       # Button, Card, Loading, etc.
│       └── hooks/            # useApi, useToast
│
└── lib/                      # Utilities, API client, config
```

---

## Backend Structure

Layered architecture separating concerns:

```
backend/
├── app/
│   ├── main.py               # FastAPI app, middleware, startup
│   │
│   ├── api/                  # API Layer (routes only)
│   │   ├── v1/
│   │   │   ├── router.py     # Aggregates all v1 routes
│   │   │   ├── recording.py  # POST /api/v1/record
│   │   │   ├── story.py      # POST /api/v1/generate-story
│   │   │   └── health.py     # GET /api/v1/health
│   │   └── deps.py           # Dependency injection
│   │
│   ├── services/             # Business Logic Layer
│   │   ├── transcription.py  # Whisper integration
│   │   ├── story_generator.py# GPT-4 integration
│   │   └── pipeline.py       # Orchestrates the flow
│   │
│   ├── models/               # Pydantic schemas
│   │   ├── recording.py      # RecordingRequest, RecordingResponse
│   │   └── story.py          # StoryRequest, StoryResponse
│   │
│   ├── core/                 # App configuration
│   │   ├── config.py         # Settings from env vars
│   │   └── exceptions.py     # Custom exceptions
│   │
│   └── integrations/         # External service clients
│       ├── openai_client.py  # OpenAI API wrapper
│       └── storage.py        # File storage (local/S3)
│
├── tests/
│   ├── unit/
│   └── integration/
│
└── requirements.txt
```

---

## API Design

### Versioned Endpoints

All endpoints under `/api/v1/` for future compatibility:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/record` | Upload audio, returns transcript |
| POST | `/api/v1/generate-story` | Transform transcript to narrative |
| POST | `/api/v1/process` | Combined: upload → transcribe → generate |

### Request/Response Contracts

```python
# Recording
POST /api/v1/record
Request: multipart/form-data { audio: File }
Response: { transcript: string, duration: float }

# Story Generation
POST /api/v1/generate-story
Request: { transcript: string, context?: string }
Response: { story: string, title: string }

# Full Pipeline (convenience endpoint)
POST /api/v1/process
Request: multipart/form-data { audio: File, context?: string }
Response: { transcript: string, story: string, title: string }
```

---

## Future Considerations

### Database (when needed)
- PostgreSQL for structured data (users, stories, metadata)
- Consider: story versioning, user preferences, analytics

### Authentication (when needed)
- JWT tokens with refresh flow
- OAuth providers (Google, Apple) for easy signup

### Storage (when needed)
- S3-compatible storage for audio files
- CDN for serving generated content

### Background Jobs (when needed)
- Redis + Celery for async processing
- Useful for: long recordings, batch processing, notifications
