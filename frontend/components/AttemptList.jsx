
export default function AttemptList({ attempts = [] }) {
  if (!attempts.length) {
    return (
      <p className="text-sm text-slate-500">
        Nenhuma resposta ainda. Comece uma trilha!
      </p>
    );
  }

  function formatDate(value) {
    if (!value) return "";

    // Datas já formatadas no padrão brasileiro.
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return value;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("pt-BR");
  }

  return (
    <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {attempts.slice(0, 6).map((attempt, index) => {
        const situation =
          attempt.situation ??
          attempt.exercise_situation ??
          "Exercício de inglês";

        const answer =
          attempt.answer ??
          attempt.student_answer ??
          "";

        const correct = Boolean(attempt.correct);

        const date = formatDate(
          attempt.date ?? attempt.created_at
        );

        return (
          <li
            key={
              attempt.id ??
              `${attempt.exercise_id ?? "exercise"}-${index}`
            }
            className="flex items-start justify-between gap-3 p-4"
          >
            <div>
              <p className="text-sm text-slate-500">
                {situation}
              </p>

              <p className="mt-0.5 font-mono text-sm">
                {answer}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  correct
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {correct ? "Acertou" : "Errou"}
              </span>

              {date && (
                <p className="mt-1 text-xs text-slate-400">
                  {date}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
