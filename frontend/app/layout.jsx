
import "./globals.css";

import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";

export const metadata = {
  title: "Frase a Frase",
  description: "Aprenda inglês com exercícios e IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <AppProvider>
            <Header />
            <main className="mx-auto max-w-4xl px-4 py-8">
              {children}
            </main>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
