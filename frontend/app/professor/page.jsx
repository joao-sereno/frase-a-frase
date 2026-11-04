"use client";
import { useApp } from "@/context/AppContext";
import { mockCommonErrors } from "@/data/mock";
import NewTopicForm from "@/components/NewTopicForm";
export default function TeacherPage() {
  const { topics } = useApp();
  const max = Math.max(...mockCommonErrors.map((e) => e.count));
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold">Área do professor</h1>
        <p className="mt-2 text-slate-600">Escolha o tópico que a turma precisa reforçar. A IA gera os exercícios.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl font-semibold">Novo tópico</h2>
          <NewTopicForm />
        </div>
        <div>
          <h2 className="mb-3 text-xl font-semibold">Tópicos da turma ({topics.length})</h2>
          <ul className="space-y-2">
            {topics.map((t) => (
              <li key={t.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <p className="font-medium">{t.title}</p>
                <p className="text-slate-500">
                  {t.exercises.length > 0 ? `${t.exercises.length} exercícios` : "Aguardando exercícios da IA"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Erros mais comuns da turma</h2>
        <ul className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          {mockCommonErrors.map((e) => (
            <li key={e.label}>
              <div className="flex justify-between text-sm">
                <span>{e.label}</span>
                <span className="text-slate-500">{e.count}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-rose-400" style={{ width: `${(e.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
