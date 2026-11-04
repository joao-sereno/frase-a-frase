export default function AttemptList({ attempts }) {
  if (attempts.length === 0) {
    return <p className="text-sm text-slate-500">Nenhuma resposta ainda. Comece uma trilha!</p>;
  }
  return (
    <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {attempts.slice(0, 6).map((a) => (
        <li key={a.id} className="flex items-start justify-between gap-3 p-4">
          <div>
            <p className="text-sm text-slate-500">{a.situation}</p>
            <p className="mt-0.5 font-mono text-sm">{a.answer}</p>
          </div>
          <div className="shrink-0 text-right">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.correct ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}
            >
              {a.correct ? "Acertou" : "Errou"}
            </span>
            <p className="mt-1 text-xs text-slate-400">{a.date}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
