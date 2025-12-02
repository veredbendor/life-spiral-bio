class BiographyAppError(Exception):
    """Base exception for the application."""

    def __init__(self, message: str, details: str | None = None):
        self.message = message
        self.details = details
        super().__init__(self.message)


class TranscriptionError(BiographyAppError):
    """Raised when audio transcription fails."""
    pass


class StoryGenerationError(BiographyAppError):
    """Raised when story generation fails."""
    pass


class AudioProcessingError(BiographyAppError):
    """Raised when audio file processing fails."""
    pass


class FileTooLargeError(BiographyAppError):
    """Raised when uploaded file exceeds size limit."""
    pass
