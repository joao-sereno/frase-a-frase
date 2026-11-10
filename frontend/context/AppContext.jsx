
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { mockAttempts, mockTopics } from "@/data/mock";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [topics, setTopics] = useState(mockTopics);
  const [attempts, setAttempts] = useState(mockAttempts);

  // Registra as tentativas realizadas pelos alunos.
  const addAttempt = useCallback((attempt) => {
    const entry = {
      ...attempt,
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString("pt-BR"),
    };

    setAttempts((prev) => [entry, ...prev]);
  }, []);

  // Cria um tópico com ou sem exercícios gerados pela IA.
  const addTopic = useCallback(
    (title, description, exercises = []) => {
      const slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const id = `${slug || "topico"}-${crypto.randomUUID().slice(0, 8)}`;

      const newTopic = {
        id,
        title,
        description,
        exercises: exercises.map((exercise, index) => ({
          ...exercise,
          id: exercise.id || `${id}-ex-${index + 1}`,
          level: exercise.level || 1,
        })),
      };

      setTopics((prev) => [...prev, newTopic]);

      return newTopic;
    },
    []
  );

  // Permite adicionar exercícios a um tópico existente.
  const updateTopicExercises = useCallback(
    (topicId, exercises) => {
      setTopics((prev) =>
        prev.map((topic) =>
          topic.id === topicId
            ? {
                ...topic,
                exercises: exercises.map((exercise, index) => ({
                  ...exercise,
                  id:
                    exercise.id ||
                    `${topicId}-ex-${index + 1}`,
                  level: exercise.level || 1,
                })),
              }
            : topic
        )
      );
    },
    []
  );

  // Calcula a quantidade de exercícios acertados.
  const correctCount = useCallback(
    (topicId) => {
      const done = new Set(
        attempts
          .filter(
            (attempt) =>
              attempt.topicId === topicId && attempt.correct
          )
          .map((attempt) => attempt.exerciseId)
      );

      return done.size;
    },
    [attempts]
  );

  const value = useMemo(
    () => ({
      topics,
      attempts,
      addAttempt,
      addTopic,
      updateTopicExercises,
      correctCount,
    }),
    [
      topics,
      attempts,
      addAttempt,
      addTopic,
      updateTopicExercises,
      correctCount,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error(
      "useApp deve ser usado dentro de AppProvider"
    );
  }

  return ctx;
}
