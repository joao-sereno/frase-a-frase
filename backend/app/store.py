"""Armazenamento em memória (permitido na Sprint 2; na Sprint 4 vira banco de dados com SQLModel)."""
from collections import Counter,OrderedDict
from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import uuid4

from app.auth.security import hash_password
from app.seed import DEMO_USERS,SEED_EXERCISES,SEED_TOPICS

MAX_GENERATED = 1000


@dataclass(frozen=True)
class UserRecord:
    id: str
    name: str
    email: str
    hashed_password: str
    role: str

@dataclass(frozen=True)
class TopicRecord:
    id: str
    title: str
    description: str
    level: int

@dataclass(frozen=True)
class StoredExercise:
    id: str
    topic_id: str
    level: str
    hint:str
    situation: str
    suggestion: str

@dataclass(frozen=True)
class AttemptRecord:
    id: str
    user_id: str
    user_name: str
    exercise_id: str
    topic_id: str
    situation: str
    answer: str
    correct: bool
    feedback: str
    suggestion: str
    created_at: str

_users_by_id: dict[str, UserRecord] = {}
_users_by_email: dict[str, UserRecord] = {}
_topics: dict[str, TopicRecord] = {}
_seed_exercises: dict[str, StoredExercise] = {}
_generated_exercises: "OrderedDict[str, StoredExercise]" = OrderedDict()
_attempts: list[AttemptRecord] = []

def init_demo_data() -> None:
    """Inicializa tópicos, exercícios base e usuários de demonstração."""
    for t in SEED_TOPICS:
        _topics[t["id"]] = TopicRecord(
            id=t["id"],
            title=t["title"],
            description=t["description"],
            level=t["level"],
        )

    for ex_id, data in SEED_EXERCISES.items():
        _seed_exercises[ex_id] = StoredExercise(
            id=ex_id,
            topic_id=data["topic_id"],
            level=data["level"],
            situation=data["situation"],
            hint=data["hint"],
            suggestion=data["suggestion"],
        )
    for u in DEMO_USERS:
        email_norm = u["email"].strip().lower()
        if email_norm not in _users_by_email:
            record = UserRecord(
                id=u["id"],
                name=u["name"],
                email=email_norm,
                hashed_password=hash_password(u["password"]),
                role=u["role"],
            )
            _users_by_id[record.id] = record
            _users_by_email[record.email] = record

#Parte usuário

def create_user(name: str, email: str, password: str, role: str = "student") -> UserRecord:
    email_norm = email.strip().lower()
    if email_norm in _users_by_email:
        raise ValueError("E-mail já cadastrado!!")
    record = UserRecord(
        id=f"user-{uuid4().hex[:8]}",
        name=name.strip(),
        email=email_norm,
        hashed_password=hash_password(password),
        role=role,
    )
    _users_by_id[record.id] = record
    _users_by_email[record.email] = record
    return record

def get_user_by_email(email: str) -> UserRecord | None:
    return _users_by_email.get(email.strip().lower())

def get_user_by_id(user_id: str) -> UserRecord | None:
    return _users_by_id.get(user_id)

#Parte dos tópicos e exercícios

def save_topic(topic_id: str, title: str, description: str, level: int = 1) -> TopicRecord:
    record = TopicRecord(id=topic_id, title=title, description=description, level=level)
    _topics[topic_id] = record
    return record

def list_topics() -> list[TopicRecord]:
    return list(_topics.values())

def get_topic(topic_id: str) -> TopicRecord | None:
    return _topics.get(topic_id)

def save_exercise(
    exercise_id: str,
    situation: str,
    suggestion: str,
    topic_id: str = "custom",
    level: int = 1,
    hint: str = "",
) -> None:
    _generated_exercises[exercise_id] = StoredExercise(
        id=exercise_id,
        topic_id=topic_id,
        level=level,
        situation=situation,
        hint=hint,
        suggestion=suggestion,
    )
    while len(_generated_exercises) > MAX_GENERATED:
        _generated_exercises.popitem(last=False)

def get_exercise(exercise_id: str) -> StoredExercise | None:
    return _generated_exercises.get(exercise_id) or _seed_exercises.get(exercise_id)

def list_exercises_by_topic(topic_id: str) -> list[StoredExercise]:
    all_exercises = list(_seed_exercises.values()) + list(_generated_exercises.values())
    return [ex for ex in all_exercises if ex.topic_id == topic_id]

#Tentativas e estatísitcas

def save_attempt(
    user_id: str,
    user_name: str,
    exercise_id: str,
    topic_id: str,
    situation: str,
    answer: str,
    correct: bool,
    feedback: str,
    suggestion: str,
) -> AttemptRecord:
    record = AttemptRecord(
        id=f"att-{uuid4().hex[:8]}",
        user_id=user_id,
        user_name=user_name,
        exercise_id=exercise_id,
        topic_id=topic_id,
        situation=situation,
        answer=answer,
        correct=correct,
        feedback=feedback,
        suggestion=suggestion,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    _attempts.append(record)
    return record

def list_attempts(user_id: str | None = None) -> list[AttemptRecord]:
    items = _attempts if user_id is None else [a for a in _attempts if a.user_id == user_id]
    return list(reversed(items))

def get_stats(user_id: str | None = None) -> dict:
    items = _attempts if user_id is None else [a for a in _attempts if a.user_id == user_id]
    total = len(items)
    correct_count = sum(1 for a in items if a.correct)
    incorrect_count = total - correct_count
    accuracy = round((correct_count/total) * 100, 1) if total > 0 else 0.0

    errors_by_topic_counter: Counter[str] = Counter(
        a.topic_id for a in items if not a.correct
    )
    errors_by_topic = []
    for t_id, err_count in errors_by_topic_counter.most_common():
        topic = get_topic(t_id)
        errors_by_topic.append(
            {
                "topic_id": t_id,
                "topic_title": topic.title if topic else t_id,
                "errors": err_count,
            }
        )
    return {
        "total_attempts": total,
        "correct_count": correct_count,
        "incorrect_count": incorrect_count,
        "accuracy_rate": accuracy,
        "errors_by_topic": errors_by_topic,
    }
init_demo_data()
    
#def save_exercise(exercise_id: str, situation: str, suggestion: str) -> None:
#    _generated[exercise_id] = StoredExercise(situation, suggestion)
#    while len(_generated) > MAX_GENERATED:
#        _generated.popitem(last=False)  # descarta o mais antigo


#def get_exercise(exercise_id: str) -> StoredExercise | None:
#    return _generated.get(exercise_id) or _seed.get(exercise_id)
