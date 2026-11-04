export function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9' ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
// MOCK da correção por IA. Na Sprint 2 esta função será substituída por uma chamada à API (FastAPI + IA).
export function evaluate(exercise, answer) {
  const norm = normalize(answer);
  if (!norm) {
    return { status: "empty", message: "Escreva uma frase em inglês antes de enviar." };
  }
  if (exercise.accepted.some((a) => normalize(a) === norm)) {
    return { status: "correct", message: "Muito bem! Sua frase está correta.", suggestion: exercise.suggestion };
  }
  const found = exercise.mistakes.find((m) => new RegExp(m.pattern, "i").test(norm));
  return {
    status: "wrong",
    message: found ? found.explanation : exercise.tip,
    suggestion: exercise.suggestion,
  };
}
