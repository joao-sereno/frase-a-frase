from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


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
    exercises: list[ExerciseOut]
