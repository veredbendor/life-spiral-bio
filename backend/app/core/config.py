from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    app_name: str = "Life Spiral Bio API"
    app_env: str = "development"
    debug: bool = True

    # CORS
    cors_origins: list[str] = ["http://localhost:3001"]

    # OpenAI
    openai_api_key: str = ""

    # Recording limits
    max_recording_duration_seconds: int = 180  # 3 minutes
    max_file_size_mb: int = 25

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance."""
    return Settings()
