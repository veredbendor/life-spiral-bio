import io
import tempfile
from pathlib import Path

from app.core.exceptions import TranscriptionError
from app.integrations.openai_client import get_openai_client
from app.models.recording import TranscriptionResponse


async def transcribe_audio(
    audio_bytes: bytes,
    filename: str = "recording.webm",
) -> TranscriptionResponse:
    """
    Transcribe audio using OpenAI Whisper API.

    Args:
        audio_bytes: Raw audio file bytes
        filename: Original filename (used for format detection)

    Returns:
        TranscriptionResponse with transcript and duration
    """
    client = get_openai_client()

    # Determine file extension
    suffix = Path(filename).suffix or ".webm"

    try:
        # Write to temp file (OpenAI SDK requires file-like object)
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=True) as tmp:
            tmp.write(audio_bytes)
            tmp.flush()
            tmp.seek(0)

            # Call Whisper API
            with open(tmp.name, "rb") as audio_file:
                response = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="verbose_json",
                )

        return TranscriptionResponse(
            transcript=response.text,
            duration_seconds=response.duration or 0.0,
        )

    except Exception as e:
        raise TranscriptionError(
            message="Failed to transcribe audio",
            details=str(e),
        )
