from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app import store
from app.schemas import (
    CorrectRequest,
    CorrectResponse,
    ExerciseOut,
    GenerateRequest,
    GenerateResponse,
)
from app.services import ai

router = APIRouter(prefix="/api", tags=["IA"])


@router.post("/correct", response_model=CorrectResponse, summary="Corrige uma frase com IA")
async def correct(body: CorrectRequest) -> CorrectResponse:
    stored = store.get_exercise(body.exercise_id)
    situation = body.situation or (stored.situation if stored else None)
    reference = body.suggestion or (stored.suggestion if stored else None)
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

    return CorrectResponse(
        correct=result["correct"],
        feedback=result["feedback"],
        suggestion=result.get("suggestion") or reference or "",
    )


@router.post("/generate", response_model=GenerateResponse, summary="Gera exercícios de um tópico com IA")
async def generate(body: GenerateRequest) -> GenerateResponse:
    try:
        generated = await ai.generate_exercises(body.topic, body.count)
    except ai.AINotConfiguredError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except ai.AIServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    batch_id = uuid4().hex[:8]
    exercises = []
    for i, g in enumerate(generated, start=1):
        exercise_id = f"gen-{batch_id}-{i}"
        store.save_exercise(exercise_id, g.situation, g.suggestion)
        exercises.append(
            ExerciseOut(id=exercise_id, level=g.level, situation=g.situation, hint=g.hint, suggestion=g.suggestion)
        )
    return GenerateResponse(exercises=exercises)