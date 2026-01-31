"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Target, BarChart3, Heart, Clock } from "lucide-react";
import { INDONESIA_LIFE_EXPECTANCY, LIFE_FACTS, TOP_CAUSES_OF_DEATH_INDONESIA } from "@/lib/research-data";
import { calculateAverageLifeExpectancy, formatNumber, DAYS_PER_YEAR } from "@/lib/calculator";
import { saveQuickSetup, hasSetup } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TopNavbar } from "@/components/navigation";
import { MotionList, MotionItem, MotionFadeUp, MotionSection } from "@/components/motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

// Calculate age from birth date
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations("home");
  const tc = useTranslations("common");

  const [gender, setGender] = useState<"male" | "female">("male");
  const [birthDate, setBirthDate] = useState("");
  const [currentFact, setCurrentFact] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Calculate age from birth date
  const age = birthDate ? calculateAge(birthDate) : 30;

  useEffect(() => {
    setMounted(true);

    // Redirect if already setup
    if (hasSetup()) {
      router.push("/dashboard");
    }

    // Rotate facts
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % LIFE_FACTS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const estimate = calculateAverageLifeExpectancy(age, gender);
  const avgDays = Math.round(INDONESIA_LIFE_EXPECTANCY.overall * DAYS_PER_YEAR);

  const handleUseAverage = () => {
    if (!birthDate) return;
    saveQuickSetup(age, gender, birthDate);
    router.push("/dashboard");
  };

  const handleTakeAssessment = () => {
    if (!birthDate) return;
    saveQuickSetup(age, gender, birthDate);
    router.push("/assessment");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative container mx-auto px-4 py-16 md:py-24 pt-24 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">
                {t("badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
            >
              {t("heroTitle")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {formatNumber(avgDays)}
              </span>{" "}
              {t("heroDays")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-zinc-400 mb-4"
            >
              {t("heroSubtitle", { years: INDONESIA_LIFE_EXPECTANCY.overall })}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-zinc-500 mb-12 max-w-2xl mx-auto"
            >
              {t("heroQuestion1")}
              <br />
              <span className="text-white/70">{t("heroQuestion2")}</span>
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-3 gap-4 mb-12"
            >
              {[
                { value: INDONESIA_LIFE_EXPECTANCY.male, label: t("statYearsMale") },
                { value: INDONESIA_LIFE_EXPECTANCY.female, label: t("statYearsFemale") },
                { value: formatNumber(avgDays), label: t("statAvgDays"), highlight: true },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="glass-card rounded-xl p-4 bg-white/5 border border-white/10"
                >
                  <p className={`text-3xl font-bold ${stat.highlight ? "text-amber-400" : "text-white"}`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-6 h-6 text-zinc-500 mx-auto rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Setup Section */}
      <MotionSection className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <MotionFadeUp className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                {t("setupTitle")}
              </h2>
              <p className="text-zinc-600">
                {t("setupSubtitle")}
              </p>
            </MotionFadeUp>

            <MotionFadeUp delay={0.2} className="glass-card rounded-2xl p-8 shadow-xl border border-zinc-200">
              {/* Gender Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  {t("selectGender")}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["male", "female"].map((g) => (
                    <motion.button
                      key={g}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setGender(g as "male" | "female")}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        gender === g
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      {g === "male" ? tc("male") : tc("female")}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Birth Date */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  {t("birthDate")}
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 rounded-xl border-2 border-zinc-200 focus:border-zinc-900 focus:outline-none transition-colors"
                />
                <AnimatePresence mode="wait">
                  {birthDate && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-zinc-500 mt-2"
                    >
                      {t("currentAge", { age })}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Preview */}
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-6 mb-6 text-white"
              >
                <p className="text-sm text-zinc-400 mb-2">
                  {t("remainingDays")}
                </p>
                <p className="text-4xl md:text-5xl font-extrabold countdown-number">
                  {formatNumber(estimate.daysRemaining)}
                  <span className="text-xl text-zinc-400 ml-2">{tc("days")}</span>
                </p>
                <p className="text-sm text-zinc-500 mt-2">
                  {t("approxYears", { years: Math.round(estimate.yearsRemaining) })}
                </p>
              </motion.div>

              {/* CTA Buttons - Assessment Choice */}
              <div className="space-y-3">
                <Button
                  onClick={handleUseAverage}
                  disabled={!birthDate}
                  size="lg"
                  className="w-full"
                >
                  {birthDate ? t("useAverage") : t("enterBirthDate")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleTakeAssessment}
                  disabled={!birthDate}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  {t("takeAssessment")}
                  <Target className="w-5 h-5" />
                </Button>
              </div>
              {birthDate && (
                <p className="text-xs text-zinc-500 text-center mt-3">
                  {t("assessmentHint")}
                </p>
              )}
            </MotionFadeUp>
          </div>
        </div>
      </MotionSection>

      {/* Research Data Section */}
      <MotionSection className="py-16 md:py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <MotionFadeUp className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              {t("researchTitle")}
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              {t("researchSubtitle")}
            </p>
          </MotionFadeUp>

          {/* Rotating Facts */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="glass-card rounded-2xl p-8 text-center border border-zinc-200 min-h-[140px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFact}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-xl md:text-2xl font-medium text-zinc-800 mb-3">
                    &ldquo;{LIFE_FACTS[currentFact].fact}&rdquo;
                  </p>
                  <p className="text-sm text-zinc-500">
                    {t("source")}: {LIFE_FACTS[currentFact].source}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Causes of Death */}
          <MotionFadeUp delay={0.2} className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 text-center">
              {t("topCausesTitle")}
            </h3>
            <MotionList delay={0.3} className="grid gap-3">
              {TOP_CAUSES_OF_DEATH_INDONESIA.slice(0, 5).map((item, index) => (
                <MotionItem
                  key={item.cause}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-zinc-200"
                >
                  <span className="text-2xl font-bold text-zinc-300 w-8">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-zinc-900">{item.cause}</span>
                      <span className="text-sm font-semibold text-zinc-600">
                        {item.percentage}%
                      </span>
                    </div>
                    <Progress
                      value={item.percentage * 3}
                      max={100}
                      className="h-2"
                      indicatorClassName="bg-gradient-to-r from-red-400 to-red-500"
                    />
                  </div>
                </MotionItem>
              ))}
            </MotionList>
            <p className="text-center text-sm text-zinc-500 mt-4">
              {t("topCausesSource")}
            </p>
          </MotionFadeUp>
        </div>
      </MotionSection>

      {/* Features Section */}
      <MotionSection className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <MotionList className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Clock,
                color: "bg-amber-100 text-amber-600",
                title: t("featureCountdown"),
                desc: t("featureCountdownDesc"),
              },
              {
                icon: Target,
                color: "bg-green-100 text-green-600",
                title: t("featureGoals"),
                desc: t("featureGoalsDesc"),
              },
              {
                icon: BarChart3,
                color: "bg-blue-100 text-blue-600",
                title: t("featureResearch"),
                desc: t("featureResearchDesc"),
              },
            ].map((feature, index) => (
              <MotionItem key={index} className="text-center p-6">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${feature.color} flex items-center justify-center`}
                >
                  <feature.icon className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-600">{feature.desc}</p>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </MotionSection>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-zinc-400 text-sm">
                {t("footerHelpline")} <strong className="text-white">119 ext 8</strong> (Into The Light Indonesia)
              </span>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              {t("footerDisclaimer")}
            </p>
            <p className="text-xs text-zinc-600">
              {t("footerSource")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
