
"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { generateExercises } from "@/lib/api";

export default function NewTopicForm() {
  const { addTopic } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const normalizedTitle = title.trim().replace(/\s+/g, " ");
    const normalizedDescription = description.trim();

    if (normalizedTitle.length < 3) {
      setError("Informe um título com pelo menos 3 caracteres.");
      return null;
    }

    if (normalizedTitle.length > 80) {
      setError("O título deve ter no máximo 80 caracteres.");
      return null;
    }

    if (normalizedDescription.length > 300) {
      setError("A descrição deve ter no máximo 300 caracteres.");
      return null;
    }

    setError("");

    return {
      title: normalizedTitle,
      description:
        normalizedDescription || "Tópico criado pelo professor.",
    };
  }

  function resetForm() {
    setTitle("");
    setDescription("");
  }

  // Cadastro tradicional, sem depender do backend.
  function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setSuccess("");

    const data = validate();
    if (!data) return;

    addTopic(data.title, data.description);

    setSuccess(
      `Tópico "${data.title}" criado com sucesso! ` +
      "Os exercícios poderão ser gerados pela IA posteriormente."
    );

    resetForm();
  }

  // Novo recurso da Sprint 2.
  async function handleGenerate() {
    if (loading) return;

    setSuccess("");

    const data = validate();
    if (!data) return;

    setLoading(true);

    try {
      // Solicita exercícios ao FastAPI.
      const response = await generateExercises(data.title);

      // Contrato proposto: { exercises: [...] }
      const exercises = response.exercises;

      if (!Array.isArray(exercises) || exercises.length === 0) {
        throw new Error(
          "A API não retornou uma lista válida de exercícios."
        );
      }

      // O cadastro só será concluído quando o contexto
      // permitir armazenar os exercícios gerados.
      addTopic(data.title, data.description, exercises);

      setSuccess(
        `Tópico "${data.title}" criado com ${exercises.length} exercícios gerados pela IA!`
      );

resetForm();

    } catch (err) {
      console.error("Erro ao gerar exercícios:", err);

      setError(
        "Não foi possível gerar os exercícios com IA. " +
        "Verifique se o servidor FastAPI está funcionando."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
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
          maxLength={81}
          aria-invalid={Boolean(error)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label
          htmlFor="desc"
          className="block text-sm font-medium"
        >
          Descrição (opcional)
        </label>

        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={2}
          maxLength={301}
          placeholder="Onde a turma está com mais dificuldade?"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus-indigo-200 disabled:bg-slate-100"
        />
      </div>

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

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          Criar tópico
        </button>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading
            ? "Gerando exercícios..."
            : "Gerar exercícios com IA"}
        </button>
      </div>
    </form>
  );
}
