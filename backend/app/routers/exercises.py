from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException

from app import store
from app.auth.dependencies import get_current_user, require_teacher
from app.schemas import (
    CorrectRequest,
    CorrectResponse,
    ExerciseOut,
    GenerateRequest,
    GenerateResponse,
)
from app.services import ai
from app.store import UserRecord

router = APIRouter(prefix="/api", tags=["IA"])


@router.post("/correct", response_model=CorrectResponse, summary="Corrige uma frase com IA (usuário logado)")
async def correct(
    body: CorrectRequest,
    current_user: UserRecord = Depends(get_current_user),
) -> CorrectResponse:
    stored = store.get_exercise(body.exercise_id)
    situation = body.situation or (stored.situation if stored else None)
    reference = body.suggestion or (stored.suggestion if stored else None)
    topic_id = stored.topic_id if stored else "custom"

    if not situation:
        raise HTTPException(
            status_code=404,
            detail="Exercício não encontrado. Gere os exercícios novamente ou envie 'situation' na requisição.",
        )

    try:
        result = await ai.correct_answer(situation, reference, body.answer)
    except ai.AINotConfiguredError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except ai.AIServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    final_suggestion = result.get("suggestion") or reference or ""

    store.save_attempt(
        user_id=current_user.id,
        user_name=current_user.name,
        exercise_id=body.exercise_id,
        topic_id=topic_id,
        situation=situation,
        answer=body.answer,
        correct=bool(result["correct"]),
        feedback=result["feedback"],
        suggestion=final_suggestion,
    )

    return CorrectResponse(
        correct=bool(result["correct"]),
        feedback=result["feedback"],
        suggestion=final_suggestion,
    )


@router.post("/generate", response_model=GenerateResponse, summary="Gera exercícios de um tópico com IA (somente professor)")
async def generate(
    body: GenerateRequest,
    teacher: UserRecord = Depends(require_teacher),
) -> GenerateResponse:
    try:
        generated = await ai.generate_exercises(body.topic, body.count)
    except ai.AINotConfiguredError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except ai.AIServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    batch_id = uuid4().hex[:8]
    topic_id = f"topic-{batch_id}"
    store.save_topic(
        topic_id=topic_id,
        title=body.topic,
        description=f"Trilha gerada por {teacher.name} com {len(generated)} exercícios.",
        level=1,
    )

    exercises = []
    for i, g in enumerate(generated, start=1):
        exercise_id = f"gen-{batch_id}-{i}"
        store.save_exercise(
            exercise_id=exercise_id,
            situation=g.situation,
            suggestion=g.suggestion,
            topic_id=topic_id,
            level=g.level,
            hint=g.hint,
        )
        exercises.append(
            ExerciseOut(
                id=exercise_id,
                level=g.level,
                situation=g.situation,
                hint=g.hint,
                suggestion=g.suggestion,
            )
        )
    return GenerateResponse(topic_id=topic_id, exercises=exercises)