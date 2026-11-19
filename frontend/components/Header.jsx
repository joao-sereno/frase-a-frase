
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    user,
    loading,
    isAuthenticated,
    isTeacher,
    logout,
  } = useAuth();

  const links = [
    { href: "/", label: "Aluno" },
    ...(isTeacher
      ? [{ href: "/professor/", label: "Professor" }]
      : []),
  ];

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold text-indigo-700"
        >
          Frase a Frase
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(
                    link.href.replace(/\/$/, "")
                  );

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {!loading && (
          <div className="flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">
                    {user?.name || user?.email}
                  </p>

                  <p className="text-xs text-slate-500">
                    {isTeacher ? "Professor" : "Aluno"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                >
                  Entrar
                </Link>

                <Link
                  href="/cadastro"
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
