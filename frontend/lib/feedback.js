
export function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9' ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Correção simulada utilizada na Sprint 1.
// Mantida para testes e possível fallback de desenvolvimento.
// A Sprint 2 utiliza a API FastAPI em PracticeSession.jsx.
export function evaluate(exercise, answer) {
  const norm = normalize(answer);

  if (!norm) {
    return {
      status: "empty",
      message: "Escreva uma frase em inglês antes de enviar.",
    };
  }

  if (
    exercise.accepted.some(
      (acceptedAnswer) =>
        normalize(acceptedAnswer) === norm
    )
  ) {
    return {
      status: "correct",
      message: "Muito bem! Sua frase está correta.",
      suggestion: exercise.suggestion,
    };
  }

  const found = exercise.mistakes.find(
    (mistake) =>
      new RegExp(mistake.pattern, "i").test(norm)
  );

  return {
    status: "wrong",
    message: found
      ? found.explanation
      : exercise.tip,
    suggestion: exercise.suggestion,
  };
}
