"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useAssessment } from "./AssessmentProvider";
import { getVisibleSections } from "@/lib/assessment-engine";

export function AssessmentProgress() {
  const t = useTranslations();
  const { state, answers } = useAssessment();
  const { progress } = state;

  const visibleSections = getVisibleSections(answers);

  return (
    <div className="bg-white border-b border-zinc-200 px-4 py-3">
      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-zinc-500 mb-1">
          <span>
            {progress.answeredQuestions} / {progress.totalQuestions} {t("assessment.questionsLabel")}
          </span>
          <span>{progress.percentage}%</span>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-zinc-900 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Section indicators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {visibleSections.map((section, index) => {
          const isCurrentSection =
            state.currentSection?.id === section.id;
          const isPastSection = index < progress.currentSectionIndex;

          return (
            <div
              key={section.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                isCurrentSection
                  ? "bg-zinc-900 text-white"
                  : isPastSection
                  ? "bg-zinc-200 text-zinc-700"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {isPastSection && (
                <Check className="w-3.5 h-3.5" />
              )}
              <span className="font-medium">
                {t(section.titleKey)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
