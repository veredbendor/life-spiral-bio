import logging
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.core.config import get_settings

logger = logging.getLogger(__name__)
from app.core.exceptions import StoryGenerationError, TranscriptionError
from app.models.story import ProcessResponse, StoryRequest, StoryResponse
from app.services.story_generator import generate_story
from app.services.pipeline import process_recording

router = APIRouter(tags=["story"])


@router.post("/generate-story", response_model=StoryResponse)
async def generate_story_from_transcript(request: StoryRequest):
    """
    Generate a biography snippet from a transcript.

    Takes the transcribed text and transforms it into
    a polished narrative with a title.
    """
    if not request.transcript.strip():
        raise HTTPException(
            status_code=400,
            detail="Transcript cannot be empty",
        )

    try:
        result = await generate_story(request)
        return result

    except StoryGenerationError as e:
        raise HTTPException(status_code=500, detail=e.message)


@router.post("/process", response_model=ProcessResponse)
async def process_audio_to_story(
    audio: UploadFile = File(..., description="Audio file to process"),
    context: str | None = Form(None, description="Optional context (e.g., 'childhood', 'career')"),
):
    """
    Full pipeline: upload audio, transcribe, and generate story.

    Convenience endpoint that combines recording and story generation
    into a single request.
    """
    settings = get_settings()

    # Validate file size
    contents = await audio.read()
    size_mb = len(contents) / (1024 * 1024)

    if size_mb > settings.max_file_size_mb:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.max_file_size_mb}MB",
        )

    try:
        result = await process_recording(
            audio_bytes=contents,
            filename=audio.filename or "recording.webm",
            context=context,
        )
        return result

    except TranscriptionError as e:
        logger.exception("Transcription error")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e.message}")

    except StoryGenerationError as e:
        logger.exception("Story generation error")
        raise HTTPException(status_code=500, detail=f"Story generation failed: {e.message}")

    except Exception as e:
        logger.exception("Unexpected error in process endpoint")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
