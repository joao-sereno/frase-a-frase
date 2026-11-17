from fastapi import APIRouter, Depends, HTTPException

from app import store
from app.auth.dependencies import get_current_user
from app.schemas import AttemptOut, ExerciseOut, StatsResponse, TopicDetailOut, TopicOut
from app.store import UserRecord

router = APIRouter(prefix="/api", tags=["Trilhas e Desempenho"])


@router.get("/topics", response_model=list[TopicOut], summary="Lista os tópicos/trilhas disponíveis")
def list_topics(current_user: UserRecord = Depends(get_current_user)) -> list[TopicOut]:
    topics = store.list_topics()
    return [
        TopicOut(
            id=t.id,
            title=t.title,
            description=t.description,
            level=t.level,
            exercise_count=len(store.list_exercises_by_topic(t.id)),
        )
        for t in topics
    ]


@router.get("/topics/{topic_id}", response_model=TopicDetailOut, summary="Retorna um tópico e seus exercícios")
def get_topic_detail(
    topic_id: str,
    current_user: UserRecord = Depends(get_current_user),
) -> TopicDetailOut:
    topic = store.get_topic(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Tópico não encontrado.")

    exercises = store.list_exercises_by_topic(topic_id)
    return TopicDetailOut(
        id=topic.id,
        title=topic.title,
        description=topic.description,
        level=topic.level,
        exercises=[
            ExerciseOut(
                id=ex.id,
                level=ex.level,
                situation=ex.situation,
                hint=ex.hint,
                suggestion=ex.suggestion,
            )
            for ex in exercises
        ],
    )


@router.get("/attempts", response_model=list[AttemptOut], summary="Lista tentativas (do aluno ou de toda a turma para professor)")
def list_attempts(current_user: UserRecord = Depends(get_current_user)) -> list[AttemptOut]:
    filter_user = None if current_user.role == "teacher" else current_user.id
    attempts = store.list_attempts(user_id=filter_user)
    return [
        AttemptOut(
            id=a.id,
            user_id=a.user_id,
            user_name=a.user_name,
            exercise_id=a.exercise_id,
            topic_id=a.topic_id,
            situation=a.situation,
            answer=a.answer,
            correct=a.correct,
            feedback=a.feedback,
            suggestion=a.suggestion,
            created_at=a.created_at,
        )
        for a in attempts
    ]


@router.get("/stats", response_model=StatsResponse, summary="Estatísticas de acertos e erros por tópico")
def get_stats(current_user: UserRecord = Depends(get_current_user)) -> StatsResponse:
    filter_user = None if current_user.role == "teacher" else current_user.id
    data = store.get_stats(user_id=filter_user)
    return StatsResponse(**data)