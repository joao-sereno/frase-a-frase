
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_KEY = "frase_a_frase_token";

// Gerenciamento do token JWT.
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearToken() {
  setToken(null);
}

// Função central para comunicação com o backend.
async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const headers = new Headers(options.headers || {});

  if (options.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
    );
  }

  if (response.status === 401 && !endpoint.startsWith("/api/auth/login")) {
    clearToken();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:expired"));

      if (
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/cadastro")
      ) {
        window.location.assign("/login");
      }
    }

    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (!response.ok) {
    let detail = "";

    try {
      const errorData = await response.json();

      if (typeof errorData.detail === "string") {
        detail = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        detail = errorData.detail
          .map((item) => item.msg || "Dado inválido")
          .join("; ");
      }
    } catch {
      // Mantém a mensagem padrão quando não há JSON válido.
    }

    const messages = {
      400: "Dados inválidos.",
      401: "E-mail ou senha incorretos.",
      403: "Você não tem permissão para realizar esta ação.",
      404: "Recurso não encontrado.",
      422: "Verifique os dados informados.",
      429: "Muitas requisições. Tente novamente mais tarde.",
      500: "Erro interno do servidor.",
      502: "O serviço de inteligência artificial apresentou uma falha.",
      503: "O serviço está temporariamente indisponível.",
    };

    const message =
      detail || messages[response.status] ||
      `Erro na requisição: HTTP ${response.status}`;

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;

  try {
    return await response.json();
  } catch {
    throw new Error("O servidor retornou uma resposta inválida.");
  }
}

// --------------------------------------------------
// AUTENTICAÇÃO
// --------------------------------------------------

// Realiza login e recebe token JWT e dados do usuário.
export async function login(email, password) {
  const data = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  if (!data.access_token || !data.user) {
    throw new Error("Resposta de autenticação inválida.");
  }

  setToken(data.access_token);
  return data;
}

// Cadastra um novo usuário.
export async function register(name, email, password, role = "student") {
  const data = await apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    }),
  });

  if (!data.access_token || !data.user) {
    throw new Error("Resposta de cadastro inválida.");
  }

  setToken(data.access_token);
  return data;
}

// Consulta o usuário autenticado.
export async function getCurrentUser() {
  return apiRequest("/api/auth/me");
}

// Encerra a sessão local.
export function logout() {
  clearToken();
}

// --------------------------------------------------
// TÓPICOS E EXERCÍCIOS
// --------------------------------------------------

// Lista todos os tópicos disponíveis.
export async function getTopics() {
  return apiRequest("/api/topics");
}

// Busca um tópico específico e seus exercícios.
export async function getTopicById(topicId) {
  return apiRequest(
    `/api/topics/${encodeURIComponent(topicId)}`
  );
}

// Gera exercícios utilizando Gemini.
// Apenas professores autenticados podem executar.
export async function generateExercises(topic, count = 5) {
  const data = await apiRequest("/api/generate", {
    method: "POST",
    body: JSON.stringify({
      topic: topic.trim(),
      count,
    }),
  });

  if (
    typeof data.topic_id !== "string" ||
    !Array.isArray(data.exercises) ||
    data.exercises.length === 0
  ) {
    throw new Error(
      "A API não retornou uma lista válida de exercícios."
    );
  }

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
        Number.isInteger(exercise.level) && exercise.level > 0
          ? exercise.level
          : 1,
      situation: exercise.situation.trim(),
      hint: exercise.hint.trim(),
      suggestion: exercise.suggestion.trim(),
    };
  });

  return {
    topic_id: data.topic_id,
    exercises,
  };
}

// Corrige uma frase utilizando Gemini.
// A API também registra a tentativa do aluno.
export async function correctSentence(exercise, answer) {
  const data = await apiRequest("/api/correct", {
    method: "POST",
    body: JSON.stringify({
      exercise_id: exercise.id,
      situation: exercise.situation,
      suggestion: exercise.suggestion,
      answer: answer.trim(),
    }),
  });

  if (
    typeof data.correct !== "boolean" ||
    typeof data.feedback !== "string" ||
    typeof data.suggestion !== "string"
  ) {
    throw new Error("Resposta inválida da API de correção.");
  }

  return data;
}

// --------------------------------------------------
// TENTATIVAS E ESTATÍSTICAS
// --------------------------------------------------

// Busca as tentativas registradas.
// Professor: toda a turma.
// Aluno: apenas suas próprias tentativas.
export async function getAttempts() {
  return apiRequest("/api/attempts");
}

// Busca as estatísticas de desempenho.
export async function getStats() {
  return apiRequest("/api/stats");
}
