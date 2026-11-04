import { Feedback } from "@/lib/types";

export default function FeedbackBox({ feedback }: { feedback: Feedback }) {
  const styles = {
    correct: "border-emerald-300 bg-emerald-50 text-emerald-900",
    wrong: "border-rose-300 bg-rose-50 text-rose-900",
    empty: "border-amber-300 bg-amber-50 text-amber-900",
  }[feedback.status];
  const title = { correct: "Correto!", wrong: "Quase lá", empty: "Atenção" }[feedback.status];

  return (
    <div role="status" className={`rounded-xl border p-4 ${styles}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm">{feedback.message}</p>
      {feedback.suggestion && feedback.status !== "empty" && (
        <p className="mt-2 text-sm">
          <span className="font-medium">Sugestão: </span>
          <span className="font-mono">{feedback.suggestion}</span>
        </p>
      )}
    </div>
  );
}
