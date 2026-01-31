"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssessmentNavigationProps {
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  isComplete: boolean;
}

export function AssessmentNavigation({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  isLastQuestion,
  isComplete,
}: AssessmentNavigationProps) {
  const t = useTranslations();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-4 safe-area-bottom">
      <div className="container mx-auto max-w-lg flex gap-3">
        {/* Back button */}
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={!canGoBack}
          className="h-14 px-6 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t("assessment.back")}
        </Button>

        {/* Next/Finish button */}
        <Button
          type="button"
          onClick={onNext}
          disabled={!canGoNext && !isComplete}
          className={`flex-1 h-14 rounded-xl ${
            isLastQuestion || isComplete
              ? "bg-green-600 hover:bg-green-700"
              : ""
          }`}
        >
          {isLastQuestion || isComplete ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              {t("assessment.viewResults")}
            </>
          ) : (
            <>
              {t("assessment.next")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
