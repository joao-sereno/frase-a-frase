const styles = {
  1: "bg-emerald-100 text-emerald-800",
  2: "bg-amber-100 text-amber-800",
  3: "bg-rose-100 text-rose-800",
};
export default function LevelBadge({ level }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[level]}`}>Nível {level}</span>;
}
