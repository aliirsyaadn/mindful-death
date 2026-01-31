"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  User,
  Activity,
  Heart,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { AssessmentSection } from "@/types/assessment";

// Icon mapping
const ICONS: Record<string, LucideIcon> = {
  User,
  Activity,
  Heart,
  Stethoscope,
  Users,
};

interface SectionHeaderProps {
  section: AssessmentSection;
  showDescription?: boolean;
}

export function SectionHeader({
  section,
  showDescription = true,
}: SectionHeaderProps) {
  const t = useTranslations();
  const Icon = section.icon ? ICONS[section.icon] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-zinc-600" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
            {t("assessment.section")}
          </p>
          <h3 className="text-lg font-bold text-zinc-900">
            {t(section.titleKey)}
          </h3>
        </div>
      </div>
      {showDescription && section.descriptionKey && (
        <p className="text-zinc-600 ml-13">
          {t(section.descriptionKey)}
        </p>
      )}
    </motion.div>
  );
}
