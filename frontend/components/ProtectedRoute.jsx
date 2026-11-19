
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  role,
}) {
  const router = useRouter();

  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  const unauthorized =
    !loading &&
    isAuthenticated &&
    role &&
    user?.role !== role;

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (unauthorized) {
      router.replace("/");
    }
  }, [
    loading,
    isAuthenticated,
    unauthorized,
    router,
  ]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Verificando sua sessão...</p>
      </main>
    );
  }

  if (!isAuthenticated || unauthorized) {
    return null;
  }

  return children;
}
