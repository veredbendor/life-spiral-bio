from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Biography Journey API",
    description="Backend API for the Biography Journey application",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to Biography Journey API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/v1/biography/start")
async def start_journey():
    return {
        "message": "Your biography journey begins here",
        "next_step": "Tell us about your earliest memories"
    }
