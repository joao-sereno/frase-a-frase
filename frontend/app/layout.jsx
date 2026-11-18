import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
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
        <AuthProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
