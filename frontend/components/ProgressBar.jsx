export default function ProgressBar({ value, max }) {
  const total = Number.isFinite(max) ? Math.max(0, max) : 0;
  const completed = Number.isFinite(value) ? Math.min(total, Math.max(0, value)) : 0;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div>
      <div
        role="progressbar"
        aria-label="Progresso da trilha"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {completed} de {total} frases concluídas ({pct}%)
      </p>
    </div>
  );
}