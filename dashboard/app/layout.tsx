import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Commandes | FEVYORA",
  description: "Tableau des commandes FEVYORA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
