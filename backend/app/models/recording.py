from pydantic import BaseModel


class TranscriptionResponse(BaseModel):
    """Response from audio transcription."""

    transcript: str
    duration_seconds: float


class RecordingMetadata(BaseModel):
    """Metadata about a recording."""

    filename: str
    content_type: str
    size_bytes: int
    duration_seconds: float | None = None
