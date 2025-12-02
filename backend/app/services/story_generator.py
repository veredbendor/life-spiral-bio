from app.core.exceptions import StoryGenerationError
from app.integrations.openai_client import get_openai_client
from app.models.story import StoryRequest, StoryResponse

SYSTEM_PROMPT = """You are a skilled biographer who transforms spoken memories into beautifully written narrative prose.

Your task:
1. Take the raw transcript of someone sharing a memory
2. Transform it into a polished, engaging biography snippet
3. Preserve the storyteller's authentic voice and emotions
4. Write in third person, past tense
5. Create a short, evocative title for this memory

Guidelines:
- Keep the essence and details of the original story
- Smooth out verbal fillers (um, uh, like, you know) naturally
- Add sensory details where appropriate to bring the scene to life
- Maintain the emotional truth of the memory
- Keep the snippet concise (1-3 paragraphs)
- The title should be 3-7 words, capturing the heart of the memory"""

USER_PROMPT_TEMPLATE = """Transform this spoken memory into a biography snippet:

TRANSCRIPT:
{transcript}

{context_section}
Please provide:
1. A short title (3-7 words)
2. The biography snippet (1-3 paragraphs, third person, past tense)

Format your response as:
TITLE: [your title]

STORY:
[your biography snippet]"""


async def generate_story(request: StoryRequest) -> StoryResponse:
    """
    Generate a biography snippet from a transcript using GPT-4.

    Args:
        request: StoryRequest with transcript and optional context

    Returns:
        StoryResponse with title, story, and word count
    """
    client = get_openai_client()

    # Build context section if provided
    context_section = ""
    if request.context:
        context_section = f"CONTEXT: This memory is from their {request.context}.\n"

    user_prompt = USER_PROMPT_TEMPLATE.format(
        transcript=request.transcript,
        context_section=context_section,
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        content = response.choices[0].message.content or ""

        # Parse response
        title, story = _parse_response(content)

        return StoryResponse(
            title=title,
            story=story,
            word_count=len(story.split()),
        )

    except Exception as e:
        raise StoryGenerationError(
            message="Failed to generate story",
            details=str(e),
        )


def _parse_response(content: str) -> tuple[str, str]:
    """Parse GPT response into title and story."""
    title = "A Memory"
    story = content

    # Try to extract title
    if "TITLE:" in content:
        parts = content.split("TITLE:", 1)
        if len(parts) > 1:
            remaining = parts[1].strip()
            if "STORY:" in remaining:
                title_part, story_part = remaining.split("STORY:", 1)
                title = title_part.strip()
                story = story_part.strip()
            else:
                # Title on first line, rest is story
                lines = remaining.split("\n", 1)
                title = lines[0].strip()
                story = lines[1].strip() if len(lines) > 1 else ""

    return title, story
