
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Envia uma frase para correção pela IA.
export async function correctSentence(exercise, answer) {
  const response = await fetch(`${API_URL}/api/correct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      exercise_id: exercise.id,
      situation: exercise.situation,
      hint: exercise.hint,
      suggestion: exercise.suggestion,
      answer: answer.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao corrigir frase: HTTP ${response.status}`
    );
  }

  const data = await response.json();

  // Verifica se o backend retornou os campos necessários.
  if (
    typeof data.correct !== "boolean" ||
    typeof data.feedback !== "string"
  ) {
    throw new Error("Resposta inválida da API de correção.");
  }

  return data;
}

// Solicita a geração de exercícios para um tópico.
export async function generateExercises(topic) {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: topic,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Erro ao gerar exercícios: HTTP ${response.status}`
    );
  }

  const data = await response.json();

  if (
    !Array.isArray(data.exercises) ||
    data.exercises.length === 0
  ) {
    throw new Error(
      "A API não retornou uma lista válida de exercícios."
    );
  }

  // Valida e normaliza os exercícios recebidos.
  const exercises = data.exercises.map((exercise, index) => {
    if (
      typeof exercise.situation !== "string" ||
      !exercise.situation.trim() ||
      typeof exercise.hint !== "string" ||
      typeof exercise.suggestion !== "string" ||
      !exercise.suggestion.trim()
    ) {
      throw new Error(
        `Exercício ${index + 1} retornado com dados incompletos.`
      );
    }

    return {
      id: exercise.id || `generated-${index + 1}`,
      level:
        Number.isInteger(exercise.level) &&
        exercise.level > 0
          ? exercise.level
          : 1,
      situation: exercise.situation.trim(),
      hint: exercise.hint.trim(),
      suggestion: exercise.suggestion.trim(),
    };
  });

  return { exercises };
}
