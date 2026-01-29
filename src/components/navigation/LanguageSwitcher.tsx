"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { motion } from "framer-motion";

interface LanguageSwitcherProps {
  variant?: "dark" | "light";
}

export function LanguageSwitcher({ variant = "dark" }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: "id" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  const isDark = variant === "dark";

  return (
    <div className={`flex items-center gap-1 rounded-full p-1 ${
      isDark ? "bg-white/10 backdrop-blur-sm" : "bg-zinc-100"
    }`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => switchLocale("id")}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          locale === "id"
            ? isDark
              ? "bg-white text-zinc-900"
              : "bg-zinc-900 text-white"
            : isDark
              ? "text-white/70 hover:text-white"
              : "text-zinc-500 hover:text-zinc-900"
        }`}
      >
        ID
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => switchLocale("en")}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          locale === "en"
            ? isDark
              ? "bg-white text-zinc-900"
              : "bg-zinc-900 text-white"
            : isDark
              ? "text-white/70 hover:text-white"
              : "text-zinc-500 hover:text-zinc-900"
        }`}
      >
        EN
      </motion.button>
    </div>
  );
}
