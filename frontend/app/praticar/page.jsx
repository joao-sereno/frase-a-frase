
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { useApp } from "@/context/AppContext";
import PracticeSession from "@/components/PracticeSession";

function PracticeContent() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");

  const { loadTopic } = useApp();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchTopic() {
      setTopic(null);
      setError("");

      if (!topicId) {
        setError("Nenhum tópico foi selecionado.");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await loadTopic(topicId);

        if (active) {
          setTopic(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Não foi possível carregar o tópico."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchTopic();

    return () => {
      active = false;
    };
  }, [topicId, loadTopic]);

  if (loading) {
    return (
      <p className="text-slate-500">
        Carregando exercícios... Aguarde enquanto
        consultamos o servidor.
      </p>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">
          Não foi possível abrir a trilha
        </h1>

        <p className="text-red-600">{error}</p>

        <Link href="/" className="text-indigo-600">
          Voltar às trilhas
        </Link>
      </div>
    );
  }

  if (!topic?.exercises?.length) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">
          {topic?.title || "Tópico"}
        </h1>

        <p>
          Este tópico ainda não possui exercícios disponíveis.
        </p>

        <Link href="/" className="text-indigo-600">
          Voltar às trilhas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Voltar às trilhas
      </Link>

      <h1 className="text-2xl font-bold">
        {topic.title}
      </h1>

      <PracticeSession
        key={topic.id}
        topic={topic}
      />
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<p>Carregando exercícios...</p>}>
      <PracticeContent />
    </Suspense>
  );
}
