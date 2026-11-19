
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function CadastroPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const user = await register(name, email, password, role);

      if (user.role === "teacher") {
        router.replace("/professor");
      } else {
        router.replace("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-2">
          Criar conta
        </h1>

        <p className="mb-6 text-gray-500">
          Cadastre-se no Frase a Frase.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Nome
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Mínimo de 6 caracteres"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Repita sua senha"
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-1">
              Tipo de usuário
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              <option value="student">Aluno</option>
              <option value="teacher">Professor</option>
            </select>
          </div>

          {error && (
            <p role="alert" className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
