from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


#Exercícios e IA

class CorrectRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    exercise_id: str = Field(min_length=1, max_length=100)
    answer: str = Field(min_length=1, max_length=300)
    situation: Optional[str] = Field(default=None, max_length=300)
    suggestion: Optional[str] = Field(default=None, max_length=300)


class CorrectResponse(BaseModel):
    correct: bool
    feedback: str
    suggestion: str


class GenerateRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    topic: str = Field(min_length=2, max_length=100)
    count: int = Field(default=5, ge=1, le=10)


class ExerciseOut(BaseModel):
    id: str
    level: int = Field(ge=1, le=3)
    situation: str
    hint: str
    suggestion: str


class GenerateResponse(BaseModel):
    topic_id: str
    exercises: list[ExerciseOut]


# --- Autenticação ---

class UserCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=100)
    email: str = Field(min_length=5, max_length=150)
    password: str = Field(min_length=4, max_length=100)
    role: Literal["student", "teacher"] = "student"


class UserLogin(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    email: str = Field(min_length=5, max_length=150)
    password: str = Field(min_length=1, max_length=100)


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: Literal["student", "teacher"]


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# --- Tópicos, Tentativas e Estatísticas ---

class TopicOut(BaseModel):
    id: str
    title: str
    description: str
    level: int
    exercise_count: int


class TopicDetailOut(BaseModel):
    id: str
    title: str
    description: str
    level: int
    exercises: list[ExerciseOut]


class AttemptOut(BaseModel):
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


class TopicErrorStat(BaseModel):
    topic_id: str
    topic_title: str
    errors: int


class StatsResponse(BaseModel):
    total_attempts: int
    correct_count: int
    incorrect_count: int
    accuracy_rate: float
    errors_by_topic: list[TopicErrorStat]