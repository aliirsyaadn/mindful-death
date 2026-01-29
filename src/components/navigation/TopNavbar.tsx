"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function TopNavbar() {
  const t = useTranslations("common");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="font-bold text-xl text-white hover:opacity-80 transition-opacity"
          >
            {t("appName")}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
