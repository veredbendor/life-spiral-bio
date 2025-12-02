from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import get_settings
from app.core.exceptions import TranscriptionError
from app.models.recording import TranscriptionResponse
from app.services.transcription import transcribe_audio

router = APIRouter(tags=["recording"])


@router.post("/record", response_model=TranscriptionResponse)
async def upload_and_transcribe(
    audio: UploadFile = File(..., description="Audio file to transcribe"),
):
    """
    Upload an audio recording and get the transcript.

    Accepts audio files (webm, mp3, wav, m4a, etc.)
    Returns the transcribed text and duration.
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

    # Validate content type
    allowed_types = [
        "audio/webm",
        "audio/mp3",
        "audio/mpeg",
        "audio/wav",
        "audio/x-wav",
        "audio/mp4",
        "audio/m4a",
        "audio/ogg",
        "video/webm",  # Browser may send video/webm for audio
    ]

    if audio.content_type not in allowed_types:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {audio.content_type}",
        )

    try:
        result = await transcribe_audio(contents, audio.filename or "recording.webm")
        return result

    except TranscriptionError as e:
        raise HTTPException(status_code=500, detail=e.message)
