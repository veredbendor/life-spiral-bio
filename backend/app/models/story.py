from pydantic import BaseModel


class StoryRequest(BaseModel):
    """Request to generate a story from transcript."""

    transcript: str
    context: str | None = None  # Optional: "childhood", "career", etc.


class StoryResponse(BaseModel):
    """Generated biography story."""

    title: str
    story: str
    word_count: int


class ProcessResponse(BaseModel):
    """Full pipeline response: transcription + story."""

    transcript: str
    duration_seconds: float
    title: str
    story: str
    word_count: int
