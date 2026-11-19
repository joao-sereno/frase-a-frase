
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";

import {
  getTopics,
  getTopicById,
  getAttempts,
} from "@/lib/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [topics, setTopics] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [topicsData, attemptsData] = await Promise.all([
        getTopics(),
        getAttempts(),
      ]);

      if (!Array.isArray(topicsData)) {
        throw new Error("Formato inválido da lista de tópicos.");
      }

      if (!Array.isArray(attemptsData)) {
        throw new Error("Formato inválido das tentativas.");
      }

      const normalizedTopics = topicsData.map((topic) => ({
        ...topic,
        exercises: [],
        exerciseCount: topic.exercise_count ?? 0,
      }));

      setTopics(normalizedTopics);
      setAttempts(attemptsData);
    } catch (err) {
      setError(err.message || "Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setTopics([]);
      setAttempts([]);
      setError(null);
      setLoading(false);
      return;
    }

    refreshData();
  }, [authLoading, isAuthenticated, refreshData]);

  const loadTopic = useCallback(async (topicId) => {
    const topic = await getTopicById(topicId);

    setTopics((prev) => {
      const exists = prev.some((t) => t.id === topicId);

      if (exists) {
        return prev.map((t) =>
          t.id === topicId ? { ...t, ...topic } : t
        );
      }

      return [...prev, topic];
    });

    return topic;
  }, []);

  const addAttempt = useCallback((attempt) => {
    setAttempts((prev) => [attempt, ...prev]);
  }, []);

  const addTopic = useCallback((title, description, exercises = []) => {
    const id = crypto.randomUUID();

    const newTopic = {
      id,
      title,
      description,
      exercises,
    };

    setTopics((prev) => [...prev, newTopic]);

    return newTopic;
  }, []);

  const updateTopicExercises = useCallback((topicId, exercises) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? { ...topic, exercises }
          : topic
      )
    );
  }, []);

  const correctCount = useCallback(
    (topicId) => {
      const done = new Set(
        attempts
          .filter(
            (attempt) =>
              (attempt.topicId === topicId ||
                attempt.topic_id === topicId) &&
              attempt.correct
          )
          .map(
            (attempt) =>
              attempt.exerciseId || attempt.exercise_id
          )
      );

      return done.size;
    },
    [attempts]
  );

  const value = useMemo(
    () => ({
      topics,
      attempts,
      loading,
      error,
      refreshData,
      loadTopic,
      addAttempt,
      addTopic,
      updateTopicExercises,
      correctCount,
    }),
    [
      topics,
      attempts,
      loading,
      error,
      refreshData,
      loadTopic,
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
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp deve ser utilizado dentro de AppProvider."
    );
  }

  return context;
}
