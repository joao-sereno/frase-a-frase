"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function NewTopicForm() {
  const { addTopic } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    if (title.trim().length < 3) {
      setError("Informe um título com pelo menos 3 caracteres.");
      return;
    }
    setError("");
    addTopic(title.trim(), description.trim() || "Tópico criado pelo professor.");
    setSuccess(`Tópico "${title.trim()}" criado! Os exercícios serão gerados pela IA na Sprint 2.`);
    setTitle("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Tópico de gramática
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex.: Present Continuous"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div>
        <label htmlFor="desc" className="block text-sm font-medium">
          Descrição (opcional)
        </label>
        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Onde a turma está com mais dificuldade?"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      {success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}
      <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
        Criar tópico
      </button>
    </form>
  );
}
