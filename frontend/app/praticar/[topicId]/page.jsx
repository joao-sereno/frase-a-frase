import { notFound } from "next/navigation";
import Link from "next/link";
import { mockTopics } from "@/data/mock";
import PracticeSession from "@/components/PracticeSession";
// Necessário para exportar o site como estático: define quais trilhas geram página.
export function generateStaticParams() {
  return mockTopics.filter((t) => t.exercises.length > 0).map((t) => ({ topicId: t.id }));
}
export default async function PracticePage({ params }) {
  const { topicId } = await params;
  const topic = mockTopics.find((t) => t.id === topicId);
  if (!topic) notFound();
  return (
    <div className="space-y-4">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        ← Voltar às trilhas
      </Link>
      <h1 className="text-2xl font-bold">{topic.title}</h1>
      <PracticeSession topic={topic} />
    </div>
  );
}
