from fastapi import APIRouter

from app.api.v1 import health, recording, story, questionnaire

router = APIRouter(prefix="/api/v1")

router.include_router(health.router)
router.include_router(recording.router)
router.include_router(story.router)
router.include_router(questionnaire.router)
