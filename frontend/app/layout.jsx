import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
export const metadata = {
  title: "Frase a Frase",
  description: "Pratique a construção de frases em inglês com apoio de IA.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProvider>
          <Header />
          <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
