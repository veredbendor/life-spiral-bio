from fastapi import APIRouter, HTTPException

from app.models.questionnaire import AboutYouData, AboutYouResponse

router = APIRouter(prefix="/questionnaire", tags=["questionnaire"])

# In-memory storage for demo (will be replaced with database)
_current_about_data: AboutYouData | None = None


@router.post("/about", response_model=AboutYouResponse)
async def save_about_you(data: AboutYouData):
    """
    Save the About You questionnaire data.

    For now, stores in memory. Will be persisted to database later.
    """
    global _current_about_data

    if not data.full_name.strip():
        raise HTTPException(status_code=400, detail="Full name is required")

    _current_about_data = data

    return AboutYouResponse(
        success=True,
        message="About You data saved successfully",
        data=data,
    )


@router.get("/about", response_model=AboutYouResponse)
async def get_about_you():
    """
    Get the current About You questionnaire data.
    """
    if _current_about_data is None:
        raise HTTPException(status_code=404, detail="No data found")

    return AboutYouResponse(
        success=True,
        message="About You data retrieved successfully",
        data=_current_about_data,
    )
