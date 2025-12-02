# Life Spiral Bio - Concept MVP

## Overview

A proof-of-concept for capturing life stories through voice. Users record a short audio or video clip sharing a memory or life moment. The app transcribes the recording and uses AI to transform it into a polished, written biography snippet - preserving the storyteller's voice while crafting it into narrative prose.

## MVP Scope

- Single recording flow: **Record → Transcribe → Generate Story**
- One output format: a written paragraph/snippet
- No user accounts or storage (demo-only)

## User Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Welcome   │ ──► │   Record    │ ──► │  Processing │ ──► │   Story     │
│   Screen    │     │   Clip      │     │  (AI Magic) │     │   Output    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

1. **Welcome**: User lands on homepage, clicks "Start My Journey"
2. **Record**: User records a short audio/video clip (1-3 minutes)
3. **Processing**: App transcribes audio and generates written narrative
4. **Output**: User sees their memory transformed into a biography snippet

## Technical Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Next.js | Recording UI, playback, display story |
| Backend | FastAPI | API orchestration, business logic |
| Speech-to-Text | OpenAI Whisper API | Transcribe audio to text |
| AI Generation | OpenAI GPT-4 | Transform transcript to narrative |

### Technology Decisions

**Speech-to-Text: OpenAI Whisper API**

OpenAI Whisper is an open-source speech recognition model. We'll use the hosted API ($0.006/minute) for simplicity - send an audio file, get text back. Whisper excels at accuracy across 99 languages and handles accents, background noise, and natural speech well. This pairs naturally with OpenAI for story generation, keeping our stack simple.

*Alternative considered: Deepgram offers real-time streaming and speaker diarization (useful for future family interviews), but adds complexity. We can migrate later if needed.*

**Story Generation: OpenAI GPT-4**

GPT-4 will transform the raw transcript into polished narrative prose. We'll craft a prompt that preserves the storyteller's authentic voice while structuring it as a biography snippet.

## Implementation Plan

### Phase 1: Recording UI
- Add recording page to frontend (`/record`)
- Implement browser audio recording using MediaRecorder API
- Add recording controls (start, stop, playback preview)
- Send audio blob to backend API

### Phase 2: Backend API
- Create `/api/v1/transcribe` endpoint
- Integrate OpenAI Whisper API for transcription
- Create `/api/v1/generate-story` endpoint
- Integrate OpenAI GPT-4 for narrative generation
- Handle audio file upload and processing

### Phase 3: Story Output
- Display generated story on results page
- Add copy-to-clipboard functionality
- Add "Record Another" option
- Basic error handling and loading states

### Phase 4: Polish
- Add recording time limit (3 minutes)
- Improve UI/UX with animations
- Add prompt for memory context (optional: "What period of your life is this from?")
- Mobile responsiveness

## Future Vision

This recording feature is one of many planned "collection methods" for gathering biography material:

- **Voice Recording** ← *Current MVP*
- Guided prompts & questions
- Photo descriptions
- Timeline entries
- Family interviews
- Document scanning

## Success Criteria

- [ ] User can record a clip in the browser
- [ ] Audio is successfully transcribed
- [ ] AI generates a coherent biography snippet
- [ ] User can view/copy their generated story
