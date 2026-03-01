import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/src/context/UserContext";
import { AuthChecker } from "@/src/components/AuthChecker/AuthChecker";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Pomodoro - Gerenciamento de Tempo",
  description: "Sistema de gerenciamento de tempo usando a técnica Pomodoro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <UserProvider>
          <AuthChecker>
            {children}
          </AuthChecker>
        </UserProvider>
      </body>
    </html>
  );
}
