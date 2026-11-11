"""Armazenamento em memória (permitido na Sprint 2; na Sprint 4 vira banco de dados com SQLModel)."""
from collections import OrderedDict
from dataclasses import dataclass

from app.seed import SEED_EXERCISES

MAX_GENERATED = 1000


@dataclass(frozen=True)
class StoredExercise:
    situation: str
    suggestion: str


_seed = {k: StoredExercise(*v) for k, v in SEED_EXERCISES.items()}
_generated: "OrderedDict[str, StoredExercise]" = OrderedDict()


def save_exercise(exercise_id: str, situation: str, suggestion: str) -> None:
    _generated[exercise_id] = StoredExercise(situation, suggestion)
    while len(_generated) > MAX_GENERATED:
        _generated.popitem(last=False)  # descarta o mais antigo


def get_exercise(exercise_id: str) -> StoredExercise | None:
    return _generated.get(exercise_id) or _seed.get(exercise_id)
