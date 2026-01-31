"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Heart,
  ExternalLink,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssessment } from "./AssessmentProvider";
import { getFactorsSummary, calculateAge } from "@/lib/assessment-calculator";

export function ResultsSummary() {
  const t = useTranslations();
  const router = useRouter();
  const { state, reset } = useAssessment();
  const { result } = state;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full" />
      </div>
    );
  }

  const birthDate = state.session.answers.birth_date as string;
  const age = calculateAge(birthDate);
  const yearsRemaining = result.adjustedLifeExpectancy - age;
  const summary = getFactorsSummary(result);

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleRetake = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white pb-32">
      {/* Header */}
      <div className="bg-zinc-900 text-white px-4 py-8">
        <div className="container mx-auto max-w-lg text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-zinc-400 mb-2">{t("assessment.results.estimatedLifeExpectancy")}</p>
            <p className="text-6xl font-bold mb-2">
              {result.adjustedLifeExpectancy.toFixed(1)}
              <span className="text-2xl font-normal text-zinc-400 ml-2">
                {t("assessment.results.yearsUnit")}
              </span>
            </p>
            <p className="text-zinc-400">
              {t("assessment.results.remainingTime", { years: yearsRemaining.toFixed(0) })}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Base info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100"
        >
          <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t("assessment.results.summary")}
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">{t("assessment.results.currentAge")}</span>
              <span className="font-medium">{age} {t("assessment.results.yearsUnit")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">{t("assessment.results.baseLifeExpectancy")}</span>
              <span className="font-medium">
                {result.baseLifeExpectancy.toFixed(1)} {t("assessment.results.yearsUnit")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">{t("assessment.results.totalAdjustment")}</span>
              <span
                className={`font-medium ${
                  result.totalAdjustment >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {result.totalAdjustment >= 0 ? "+" : ""}
                {result.totalAdjustment.toFixed(1)} {t("assessment.results.yearsUnit")}
              </span>
            </div>
            <div className="flex justify-between border-t border-zinc-100 pt-3">
              <span className="text-zinc-900 font-medium">{t("assessment.results.finalResult")}</span>
              <span className="font-bold text-zinc-900">
                {result.adjustedLifeExpectancy.toFixed(1)} {t("assessment.results.yearsUnit")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Positive factors */}
        {result.positiveFactors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-green-50 rounded-2xl p-6 border border-green-100"
          >
            <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t("assessment.results.positiveFactors")} (+{summary.totalPositive.toFixed(1)} {t("assessment.results.yearsUnit")})
            </h3>
            <ul className="space-y-2">
              {result.positiveFactors.map((factor) => (
                <li
                  key={factor.factorId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-green-700">
                    {t(factor.questionLabel)}
                  </span>
                  <span className="font-medium text-green-800">
                    +{factor.finalAdjustment.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Negative factors */}
        {result.negativeFactors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-50 rounded-2xl p-6 border border-red-100"
          >
            <h3 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              {t("assessment.results.riskFactors")} ({summary.totalNegative.toFixed(1)} {t("assessment.results.yearsUnit")})
            </h3>
            <ul className="space-y-2">
              {result.negativeFactors.map((factor) => (
                <li
                  key={factor.factorId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-red-700">
                    {t(factor.questionLabel)}
                  </span>
                  <span className="font-medium text-red-800">
                    {factor.finalAdjustment.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Confidence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100"
        >
          <h3 className="font-semibold text-zinc-900 mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {t("assessment.results.confidenceLevel")}
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  result.confidence === "high"
                    ? "bg-green-500 w-full"
                    : result.confidence === "medium"
                    ? "bg-yellow-500 w-2/3"
                    : "bg-red-500 w-1/3"
                }`}
              />
            </div>
            <span
              className={`text-sm font-medium capitalize ${
                result.confidence === "high"
                  ? "text-green-600"
                  : result.confidence === "medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {result.confidence === "high"
                ? t("assessment.results.confidenceHigh")
                : result.confidence === "medium"
                ? t("assessment.results.confidenceMedium")
                : t("assessment.results.confidenceLow")}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            {t("assessment.results.confidenceNote")}
          </p>
        </motion.div>

        {/* Research citations */}
        {result.appliedFactors.some((f) => f.citations.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-zinc-500"
          >
            <p className="font-medium mb-2">{t("assessment.results.researchReferences")}</p>
            <ul className="space-y-1">
              {Array.from(
                new Set(
                  result.appliedFactors.flatMap((f) =>
                    f.citations.map((c) => c.id)
                  )
                )
              )
                .slice(0, 5)
                .map((citationId) => {
                  const citation = result.appliedFactors
                    .flatMap((f) => f.citations)
                    .find((c) => c.id === citationId);
                  if (!citation) return null;
                  return (
                    <li key={citation.id} className="flex items-start gap-2">
                      <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0" />
                      <span>
                        {citation.title} ({citation.journal}, {citation.year})
                      </span>
                    </li>
                  );
                })}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-4 safe-area-bottom">
        <div className="container mx-auto max-w-lg flex gap-3">
          <Button
            variant="outline"
            onClick={handleRetake}
            className="h-14 px-6 rounded-xl"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            {t("assessment.results.retake")}
          </Button>
          <Button
            onClick={handleGoToDashboard}
            className="flex-1 h-14 rounded-xl"
          >
            {t("assessment.results.goToDashboard")}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
