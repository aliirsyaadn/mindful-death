import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindfulDeath - Hitung Mundur Hidupmu",
  description:
    "Aplikasi untuk merencanakan hidupmu berdasarkan data harapan hidup Indonesia. Buat goal, hitung mundur, dan jalani hidup dengan lebih bermakna.",
  keywords: ["harapan hidup", "life expectancy", "Indonesia", "goals", "bucket list", "countdown"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#18181b" />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
