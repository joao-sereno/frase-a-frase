import Link from "next/link";
import { Topic } from "@/lib/types";
import ProgressBar from "@/components/ProgressBar";

type Props = { topic: Topic; done: number };

export default function TopicCard({ topic, done }: Props) {
  const ready = topic.exercises.length > 0;
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold">{topic.title}</h3>
        <p className="mt-1 text-sm text-slate-600">{topic.description}</p>
      </div>
      <div className="mt-4 space-y-3">
        {ready ? (
          <>
            <ProgressBar value={done} max={topic.exercises.length} />
            <Link
              href={`/praticar/${topic.id}/`}
              className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {done > 0 ? "Continuar" : "Começar"}
            </Link>
          </>
        ) : (
          <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500">Em preparação: a IA vai gerar os exercícios (Sprint 2).</p>
        )}
      </div>
    </div>
  );
}
