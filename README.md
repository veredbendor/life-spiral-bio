# Life Spiral Bio

A biography journey application that helps users capture and preserve their life stories through a guided, step-by-step process.

## Current Stage: Concept MVP

**Voice-to-Story**: Record a memory, get a written biography snippet.

Users record a short audio/video clip sharing a life moment. The app transcribes the recording and uses AI to transform it into polished narrative prose - preserving the storyteller's voice while crafting it into a biography snippet.

See [docs/CONCEPT.md](docs/CONCEPT.md) for full details and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for software design.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Python 3.12, FastAPI
- **Infrastructure**: Docker, Docker Compose

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/veredbendor/life-spiral-bio.git
   cd life-spiral-bio
   ```

2. Copy environment files:
   ```bash
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env
   ```

3. Start the services:
   ```bash
   docker compose up --build
   ```

4. Open the application:
   - **Frontend**: http://localhost:3001
   - **Backend API**: http://localhost:8002
   - **API Documentation**: http://localhost:8002/docs

### Development

#### Frontend (Next.js)

```bash
cd frontend
pnpm install
pnpm dev
```

#### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Project Structure

```
life-spiral-bio/
├── docker-compose.yml
├── frontend/              # Next.js application
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── public/            # Static assets
│   └── Dockerfile
└── backend/               # FastAPI application
    ├── app/
    │   └── main.py        # API endpoints
    ├── requirements.txt
    └── Dockerfile
```

## License

Private - All rights reserved
