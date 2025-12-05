from pydantic import BaseModel


class AboutYouData(BaseModel):
    """Basic biographical information."""

    full_name: str
    date_of_birth: str | None = None
    birth_place: str | None = None
    current_location: str | None = None


class AboutYouResponse(BaseModel):
    """Response after saving About You data."""

    success: bool
    message: str
    data: AboutYouData
