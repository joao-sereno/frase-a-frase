"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import PracticeSession from "@/components/PracticeSession";

function PracticeContent() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");

  const { topics } = useApp();

  const topic = topics.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">
          Tópico não encontrado
        </h1>

        <Link href="/" className="text-indigo-600">
          Voltar às trilhas
        </Link>
      </div>
    );
  }

  if (!topic.exercises?.length) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">{topic.title}</h1>

        <p>Este tópico ainda não possui exercícios.</p>

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

      <PracticeSession key={topic.id} topic={topic} />
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
