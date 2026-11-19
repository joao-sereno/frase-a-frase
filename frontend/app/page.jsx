
"use client";

import { useApp } from "@/context/AppContext";
import TopicCard from "@/components/TopicCard";
import AttemptList from "@/components/AttemptList";

export default function HomePage() {
  const {
    topics,
    attempts,
    correctCount,
    loading,
    error,
    refreshData,
  } = useApp();

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold">
          Olá! Vamos praticar inglês?
        </h1>

        <p className="mt-2 max-w-2xl text-slate-600">
          Escolha uma trilha, escreva frases para situações
          do dia a dia e receba a correção da IA com
          explicação em português simples.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Trilhas de gramática
        </h2>

        {loading ? (
          <p className="text-slate-500">
            Carregando trilhas... O servidor pode levar
            alguns segundos para iniciar.
          </p>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={refreshData}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
            >
              Tentar novamente
            </button>
          </div>
        ) : topics.length === 0 ? (
          <p className="rounded-xl bg-slate-100 p-4 text-slate-600">
            Nenhuma trilha disponível no momento.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                done={correctCount(topic.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Minhas últimas respostas
        </h2>

        {loading ? (
          <p className="text-slate-500">
            Carregando histórico...
          </p>
        ) : error ? (
          <p className="text-slate-500">
            Não foi possível carregar o histórico.
          </p>
        ) : (
          <AttemptList attempts={attempts} />
        )}
      </section>
    </div>
  );
}
