from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import router as api_router
from app.core.config import get_settings

settings = get_settings()

# Build CORS origins list
cors_origins = list(settings.cors_origins)
# Allow all Railway app domains for demo
cors_origins.append("https://*.railway.app")
cors_origins.append("https://*.up.railway.app")

app = FastAPI(
    title="Life Spiral Bio API",
    description="Backend API for the Life Spiral Bio application - transform voice recordings into biography snippets",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for demo - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.app_name,
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/api/v1/health",
    }
