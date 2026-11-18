
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser,
  getToken,
  logout as apiLogout,
} from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          apiLogout();
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    function handleExpiredSession() {
      setUser(null);
    }

    window.addEventListener(
      "auth:expired",
      handleExpiredSession
    );

    restoreSession();

    return () => {
      active = false;
      window.removeEventListener(
        "auth:expired",
        handleExpiredSession
      );
    };
  }, []);

  async function login(email, password) {
    const data = await apiLogin(email, password);
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password, role) {
    const data = await apiRegister(
      name,
      email,
      password,
      role
    );

    setUser(data.user);
    return data.user;
  }

  function logout() {
    apiLogout();
    setUser(null);
  }

  const isAuthenticated = !!user;
  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isTeacher,
        isStudent,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de AuthProvider."
    );
  }

  return context;
}
