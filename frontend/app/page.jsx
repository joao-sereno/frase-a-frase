"use client";
import { useApp } from "@/context/AppContext";
import TopicCard from "@/components/TopicCard";
import AttemptList from "@/components/AttemptList";
export default function HomePage() {
  const { topics, attempts, correctCount } = useApp();
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold">Olá! Vamos praticar inglês?</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Escolha uma trilha, escreva frases para situações do dia a dia e receba a correção da IA com explicação em
          português simples.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Trilhas de gramática</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((t) => (
            <TopicCard key={t.id} topic={t} done={correctCount(t.id)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Minhas últimas respostas</h2>
        <AttemptList attempts={attempts} />
      </section>
    </div>
  );
}
