
"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { getStats } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import NewTopicForm from "@/components/NewTopicForm";

export default function TeacherPage() {
  const { topics, loading, error, refreshData } = useApp();
  const { isTeacher, loading: authLoading } = useAuth();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isTeacher) {
      setStatsLoading(false);
      return;
    }

    let active = true;

    async function loadStats() {
      setStatsLoading(true);
      setStatsError("");

      try {
        const data = await getStats();

        if (active) {
          setStats(data);
        }
      } catch (err) {
        if (active) {
          setStatsError(
            err.message || "Erro ao carregar estatísticas."
          );
        }
      } finally {
        if (active) {
          setStatsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, [authLoading, isTeacher]);

  const errorsByTopic = stats?.errors_by_topic ?? [];

  const maxErrors = Math.max(
    1,
    ...errorsByTopic.map((item) => item.errors)
  );

  return (
    <ProtectedRoute role="teacher">
      <div className="space-y-10">
        <section>
          <h1 className="text-3xl font-bold">
            Área do professor
          </h1>

          <p className="mt-2 text-slate-600">
            Escolha o tópico que a turma precisa reforçar.
            A IA gera os exercícios.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-xl font-semibold">
              Novo tópico
            </h2>

            <NewTopicForm />
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold">
              Tópicos da turma ({topics.length})
            </h2>

            {loading ? (
              <p className="text-sm text-slate-500">
                Carregando tópicos...
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
              <p className="text-sm text-slate-500">
                Nenhum tópico cadastrado.
              </p>
            ) : (
              <ul className="space-y-2">
                {topics.map((topic) => {
                  const total =
                    topic.exercise_count ??
                    topic.exerciseCount ??
                    topic.exercises?.length ??
                    0;

                  return (
                    <li
                      key={topic.id}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    >
                      <p className="font-medium">
                        {topic.title}
                      </p>

                      <p className="text-slate-500">
                        {total > 0
                          ? `${total} ${
                              total === 1
                                ? "exercício"
                                : "exercícios"
                            }`
                          : "Aguardando exercícios da IA"}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Desempenho da turma
          </h2>

          {statsLoading ? (
            <p className="text-slate-500">
              Carregando estatísticas...
            </p>
          ) : statsError ? (
            <p className="rounded-xl bg-red-50 p-4 text-red-700">
              {statsError}
            </p>
          ) : stats ? (
            <>
              <div className="mb-6 grid gap-4 sm:grid-cols-4">
                {[
                  {
                    label: "Tentativas",
                    value: stats.total_attempts,
                  },
                  {
                    label: "Acertos",
                    value: stats.correct_count,
                  },
                  {
                    label: "Erros",
                    value: stats.incorrect_count,
                  },
                  {
                    label: "Taxa de acerto",
                    value: `${Number(stats.accuracy_rate).toFixed(1)}%`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-sm text-slate-500">
                      {item.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="mb-3 text-lg font-semibold">
                Erros mais comuns por tópico
              </h3>

              {errorsByTopic.length === 0 ? (
                <p className="rounded-xl bg-slate-100 p-4 text-slate-600">
                  Nenhum erro registrado até o momento.
                </p>
              ) : (
                <ul className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                  {errorsByTopic.map((item) => (
                    <li key={item.topic_id}>
                      <div className="flex justify-between text-sm">
                        <span>{item.topic_title}</span>
                        <span className="text-slate-500">
                          {item.errors} erros
                        </span>
                      </div>

                      <div className="mt-1 h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-rose-400"
                          style={{
                            width: `${
                              (item.errors / maxErrors) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="text-slate-500">
              Estatísticas indisponíveis.
            </p>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
