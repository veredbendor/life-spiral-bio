from app.models.story import ProcessResponse, StoryRequest
from app.services.transcription import transcribe_audio
from app.services.story_generator import generate_story


async def process_recording(
    audio_bytes: bytes,
    filename: str = "recording.webm",
    context: str | None = None,
) -> ProcessResponse:
    """
    Full pipeline: transcribe audio and generate biography story.

    Args:
        audio_bytes: Raw audio file bytes
        filename: Original filename
        context: Optional context about the memory period

    Returns:
        ProcessResponse with transcript, duration, title, story, word_count
    """
    # Step 1: Transcribe audio
    transcription = await transcribe_audio(audio_bytes, filename)

    # Step 2: Generate story from transcript
    story_request = StoryRequest(
        transcript=transcription.transcript,
        context=context,
    )
    story = await generate_story(story_request)

    # Combine results
    return ProcessResponse(
        transcript=transcription.transcript,
        duration_seconds=transcription.duration_seconds,
        title=story.title,
        story=story.story,
        word_count=story.word_count,
    )
