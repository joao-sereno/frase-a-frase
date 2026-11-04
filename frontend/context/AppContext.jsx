"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { mockAttempts, mockTopics } from "@/data/mock";
const AppContext = createContext(null);
// Gerenciamento de estado global (dados mockados, em memória).
export function AppProvider({ children }) {
  const [topics, setTopics] = useState(mockTopics);
  const [attempts, setAttempts] = useState(mockAttempts);
  const addAttempt = useCallback((a) => {
    const entry = {
      ...a,
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString("pt-BR"),
    };
    setAttempts((prev) => [entry, ...prev]);
  }, []);
  const addTopic = useCallback((title, description) => {
    const id =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || crypto.randomUUID();
    setTopics((prev) => [...prev, { id, title, description, exercises: [] }]);
  }, []);
  const correctCount = useCallback(
    (topicId) => {
      const done = new Set(attempts.filter((a) => a.topicId === topicId && a.correct).map((a) => a.exerciseId));
      return done.size;
    },
    [attempts],
  );
  const value = useMemo(
    () => ({ topics, attempts, addAttempt, addTopic, correctCount }),
    [topics, attempts, addAttempt, addTopic, correctCount],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de AppProvider");
  return ctx;
}
