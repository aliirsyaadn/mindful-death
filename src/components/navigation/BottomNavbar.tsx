"use client";

import { usePathname, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { TrendingUp, Target, BookOpen } from "lucide-react";

export function BottomNavbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 pb-safe z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[64px] px-3 py-2 rounded-lg transition-colors ${
              isActive("/dashboard") ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">{t("dashboard")}</span>
          </Link>
          <Link
            href="/goals"
            className={`flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[64px] px-3 py-2 rounded-lg transition-colors ${
              isActive("/goals") ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <Target className="w-6 h-6" />
            <span className="text-xs font-medium">{t("goals")}</span>
          </Link>
          <Link
            href="/research"
            className={`flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[64px] px-3 py-2 rounded-lg transition-colors ${
              isActive("/research") ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">{t("research")}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
