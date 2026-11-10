
"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { correctSentence } from "@/lib/api";
import FeedbackBox from "@/components/FeedbackBox";
import LevelBadge from "@/components/LevelBadge";
import ProgressBar from "@/components/ProgressBar";

export default function PracticeSession({ topic }) {
  const { addAttempt } = useApp();

  const exercises = [...topic.exercises].sort(
    (a, b) => a.level - b.level
  );

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [correctIds, setCorrectIds] = useState([]);
  const [apiError, setApiError] = useState("");

  const finished = index >= exercises.length;
  const current = exercises[index];

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading || finished || feedback?.status === "correct") {
      return;
    }

    if (!answer.trim()) {
      setApiError("");
      setFeedback({
        status: "empty",
        message: "Escreva uma frase em inglês antes de enviar.",
      });
      return;
    }

    setLoading(true);
    setFeedback(null);
    setApiError("");

    try {
      // Envia o exercício completo e a resposta para o FastAPI.
      const data = await correctSentence(current, answer);

      const result = {
        status: data.correct ? "correct" : "wrong",
        message: data.feedback,
        suggestion: data.suggestion || current.suggestion || "",
      };

      setFeedback(result);

      // Registra a tentativa no estado global.
      addAttempt({
        topicId: topic.id,
        exerciseId: current.id,
        situation: current.situation,
        answer,
        correct: result.status === "correct",
      });

      // Atualiza a barra de progresso.
      if (result.status === "correct") {
        setCorrectIds((prev) =>
          prev.includes(current.id)
            ? prev
            : [...prev, current.id]
        );
      }
    } catch (error) {
      console.error("Erro na API de correção:", error);

      setApiError(
        "Não foi possível corrigir a frase. " +
        "Verifique se o servidor está funcionando e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  function next() {
    setIndex((i) => i + 1);
    setAnswer("");
    setFeedback(null);
    setApiError("");
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold">
          Trilha concluída!
        </h2>

        <p className="mt-2 text-slate-600">
          Você acertou {correctIds.length} de {exercises.length} frases em{" "}
          {topic.title}.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Voltar às trilhas
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <ProgressBar
          value={correctIds.length}
          max={exercises.length}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Frase {index + 1} de {exercises.length}
        </p>

        <LevelBadge level={current.level} />
      </div>

      <h2 className="mt-3 text-xl font-semibold">
        {current.situation}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Dica: {current.hint}
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-3"
      >
        <label
          htmlFor="answer"
          className="block text-sm font-medium"
        >
          Sua frase em inglês
        </label>

        <input
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={
            loading || feedback?.status === "correct"
          }
          placeholder="Digite aqui..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus-indigo-200 disabled:bg-slate-100"
        />

        {feedback?.status !== "correct" && (
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading
              ? "A IA está analisando..."
              : feedback
                ? "Tentar de novo"
                : "Verificar"}
          </button>
        )}
      </form>

      {apiError && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {apiError}
        </div>
      )}

      {feedback && (
        <div className="mt-4 space-y-3">
          <FeedbackBox feedback={feedback} />

          {feedback.status === "correct" && (
            <button
              onClick={next}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {index + 1 < exercises.length
                ? "Próxima frase (o nível pode subir)"
                : "Finalizar"}
            </button>
          )}

          {feedback.status === "wrong" && (
            <button
              onClick={next}
              className="text-sm text-slate-500 underline hover:text-slate-700"
            >
              Pular para a próxima
            </button>
          )}
        </div>
      )}
    </div>
  );
}
