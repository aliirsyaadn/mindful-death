import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import "../globals.css";

export const metadata: Metadata = {
  title: "MindfulDeath - Hitung Mundur Hidupmu",
  description:
    "Aplikasi untuk merencanakan hidupmu berdasarkan data harapan hidup Indonesia. Buat goal, hitung mundur, dan jalani hidup dengan lebih bermakna.",
  keywords: ["harapan hidup", "life expectancy", "Indonesia", "goals", "bucket list", "countdown"],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#18181b" />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
