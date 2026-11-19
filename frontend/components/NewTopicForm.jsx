
"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { generateExercises } from "@/lib/api";

export default function NewTopicForm() {
  const { refreshData } = useApp();

  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const normalizedTitle = title.trim().replace(/\s+/g, " ");

    if (normalizedTitle.length < 3) {
      setError("Informe um tópico com pelo menos 3 caracteres.");
      return;
    }

    if (normalizedTitle.length > 80) {
      setError("O tópico deve ter no máximo 80 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // O backend gera os exercícios e cria o tópico.
      const response = await generateExercises(normalizedTitle);

      // Recarrega a lista diretamente do backend.
      await refreshData();

      setSuccess(
        `Tópico "${normalizedTitle}" criado com ` +
          `${response.exercises.length} exercícios!`
      );

      setTitle("");
    } catch (err) {
      console.error("Erro ao gerar exercícios:", err);

      setError(
        err.message ||
          "Não foi possível gerar os exercícios."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleGenerate}
      className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium"
        >
          Tópico de gramática
        </label>

        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          placeholder="Ex.: Present Continuous"
          maxLength={80}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
        />
      </div>

      <p className="text-sm text-slate-500">
        A inteligência artificial irá gerar exercícios
        para o tópico escolhido e disponibilizá-los
        para os alunos.
      </p>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading
          ? "Gerando exercícios com IA..."
          : "Gerar exercícios com IA"}
      </button>
    </form>
  );
}
