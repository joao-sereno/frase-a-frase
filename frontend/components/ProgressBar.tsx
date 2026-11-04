export default function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {value} de {max} frases concluídas
      </p>
    </div>
  );
}
