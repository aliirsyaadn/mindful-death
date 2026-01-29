"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Settings,
  Target,
  Calendar,
  ChevronRight,
  Info,
} from "lucide-react";
import { LiveCountdown } from "@/components/countdown/LiveCountdown";
import { calculateAverageLifeExpectancy, formatNumber } from "@/lib/calculator";
import { getUserData, hasSetup } from "@/lib/storage";
import { INDONESIA_LIFE_EXPECTANCY, LIFE_MILESTONES_ID } from "@/lib/research-data";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { BottomNavbar, LanguageSwitcher } from "@/components/navigation";
import { MotionList, MotionItem, MotionScaleIn, MotionFadeUp } from "@/components/motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { UserData } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const tm = useTranslations("milestones");

  const [userData, setUserData] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasSetup()) {
      router.push("/");
      return;
    }
    setUserData(getUserData());
  }, [router]);

  const estimate = useMemo(() => {
    if (!userData?.assessment) return null;
    return calculateAverageLifeExpectancy(
      userData.assessment.age,
      userData.assessment.gender,
      userData.planType
    );
  }, [userData]);

  const targetDate = useMemo(() => {
    if (!userData?.assessment || !estimate) return null;

    // If birth date is set, use it for precise calculation
    if (userData.birthDate) {
      const birth = new Date(userData.birthDate);
      const targetYears = userData.planType === "retirement" ? 58 : estimate.lifeExpectancy;
      birth.setFullYear(birth.getFullYear() + targetYears);
      return birth;
    }

    // Otherwise estimate based on age
    const now = new Date();
    const daysToAdd = userData.planType === "retirement"
      ? estimate.daysToRetirement
      : estimate.daysRemaining;
    now.setDate(now.getDate() + daysToAdd);
    return now;
  }, [userData, estimate]);

  // Calculate days remaining from targetDate (same source as countdown)
  const daysRemaining = useMemo(() => {
    if (!targetDate) return 0;
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, [targetDate]);

  // Calculate progress milestones
  const passedMilestones = useMemo(() => {
    if (!userData?.assessment) return [];
    return LIFE_MILESTONES_ID.filter((m) => m.age <= userData.assessment!.age);
  }, [userData]);

  const upcomingMilestones = useMemo(() => {
    if (!userData?.assessment || !estimate) return [];
    const maxAge = userData.planType === "retirement" ? 58 : estimate.lifeExpectancy;
    return LIFE_MILESTONES_ID.filter(
      (m) => m.age > userData.assessment!.age && m.age <= maxAge
    );
  }, [userData, estimate]);

  if (!mounted || !userData || !estimate || !targetDate) {
    return <DashboardSkeleton />;
  }

  const lifePercentage = Math.round(
    (userData.assessment!.age /
      (userData.planType === "retirement" ? 58 : estimate.lifeExpectancy)) *
      100
  );

  const completedGoals = userData.goals.filter((g) => g.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-zinc-900">
              {tc("appName")}
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher variant="light" />
              <button
                onClick={() => setShowInfo(true)}
                className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <Info className="w-5 h-5 text-zinc-600" />
              </button>
              <Link
                href="/settings"
                className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <Settings className="w-5 h-5 text-zinc-600" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Plan Type Badge */}
        <MotionFadeUp className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium">
            {userData.planType === "death" ? (
              <>
                <Target className="w-4 h-4" />
                {t("deathPlan")}
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                {t("retirementPlan")}
              </>
            )}
          </span>
        </MotionFadeUp>

        {/* Main Countdown */}
        <MotionScaleIn delay={0.1}>
          <section className="mb-12">
            <div className="glass-card rounded-3xl p-8 md:p-12 bg-white shadow-xl border border-zinc-200">
              <p className="text-center text-zinc-500 mb-2 text-sm uppercase tracking-wider font-medium">
                {userData.planType === "death"
                  ? t("remainingTime")
                  : t("timeToRetirement")}
              </p>
              <LiveCountdown
                targetDate={targetDate}
                size="xl"
                showSeconds={true}
              />

              {/* Progress Bar */}
              <div className="mt-8 max-w-md mx-auto">
                <div className="flex justify-between text-sm text-zinc-500 mb-2">
                  <span>{t("born")}</span>
                  <span>{lifePercentage}% {t("used")}</span>
                  <span>
                    {userData.planType === "retirement" ? t("retirement58") : `${estimate.lifeExpectancy} ${t("yearsOld")}`}
                  </span>
                </div>
                <Progress
                  value={lifePercentage}
                  className="h-3"
                  indicatorClassName="bg-gradient-to-r from-zinc-900 to-zinc-700"
                />
              </div>
            </div>
          </section>
        </MotionScaleIn>

        {/* Stats Grid */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: t("currentAge"), value: userData.assessment!.age, unit: t("yearsOld") },
            { label: t("remainingDays"), value: formatNumber(daysRemaining), unit: tc("days") },
            { label: t("totalGoals"), value: userData.goals.length, unit: t("created") },
            { label: t("achieved"), value: completedGoals, unit: t("goals"), highlight: true },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="glass-card rounded-2xl p-5 bg-white border border-zinc-200"
            >
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.highlight ? "text-green-600" : "text-zinc-900"}`}>
                {stat.value}
              </p>
              <p className="text-sm text-zinc-500">{stat.unit}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Goals Section */}
        <MotionFadeUp delay={0.3}>
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-zinc-900">{t("goalsTitle")}</h2>
              <Button asChild size="sm">
                <Link href="/goals" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {t("addGoal")}
                </Link>
              </Button>
            </div>

            {userData.goals.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 bg-white border border-zinc-200 text-center">
                <Target className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  {t("noGoalsTitle")}
                </h3>
                <p className="text-zinc-600 mb-4">
                  {t("noGoalsDesc")}
                </p>
                <Button asChild>
                  <Link href="/goals" className="inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {t("createFirstGoal")}
                  </Link>
                </Button>
              </div>
            ) : (
              <MotionList className="space-y-3">
                {userData.goals.slice(0, 5).map((goal) => (
                  <MotionItem key={goal.id}>
                    <Link
                      href="/goals"
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          goal.completed ? "bg-green-100" : "bg-zinc-100"
                        }`}
                      >
                        {goal.completed ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <Target className="w-5 h-5 text-zinc-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium truncate ${
                            goal.completed ? "text-zinc-500 line-through" : "text-zinc-900"
                          }`}
                        >
                          {goal.title}
                        </h3>
                        <p className="text-sm text-zinc-500">{goal.category}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-400" />
                    </Link>
                  </MotionItem>
                ))}
                {userData.goals.length > 5 && (
                  <Link
                    href="/goals"
                    className="block text-center py-3 text-zinc-600 hover:text-zinc-900 text-sm font-medium"
                  >
                    {t("viewAllGoals", { count: userData.goals.length })}
                  </Link>
                )}
              </MotionList>
            )}
          </section>
        </MotionFadeUp>

        {/* Milestones Timeline */}
        <MotionFadeUp delay={0.4}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">{t("milestonesTitle")}</h2>
            <div className="glass-card rounded-2xl p-6 bg-white border border-zinc-200">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-200" />

                <div className="space-y-4">
                  {/* Passed milestones */}
                  {passedMilestones.slice(-3).map((milestone) => (
                    <motion.div
                      key={milestone.age}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 pl-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-sm z-10" />
                      <div className="flex-1">
                        <p className="font-medium text-zinc-900">{tm(milestone.labelKey)}</p>
                        <p className="text-sm text-zinc-500">{t("age")} {milestone.age} {t("yearsOld")} ✓</p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Current */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 pl-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10 animate-pulse" />
                    <div className="flex-1 bg-amber-50 rounded-lg p-3 -ml-2">
                      <p className="font-semibold text-amber-900">{t("now")}</p>
                      <p className="text-sm text-amber-700">{t("age")} {userData.assessment!.age} {t("yearsOld")}</p>
                    </div>
                  </motion.div>

                  {/* Upcoming milestones */}
                  {upcomingMilestones.slice(0, 3).map((milestone, index) => (
                    <motion.div
                      key={milestone.age}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 0.6, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 pl-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-zinc-300 border-2 border-white shadow-sm z-10" />
                      <div className="flex-1">
                        <p className="font-medium text-zinc-700">{tm(milestone.labelKey)}</p>
                        <p className="text-sm text-zinc-500">{t("age")} {milestone.age} {t("yearsOld")}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </MotionFadeUp>

        {/* Info Dialog */}
        <Dialog open={showInfo} onOpenChange={setShowInfo}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("infoTitle")}</DialogTitle>
              <DialogDescription>
                {t("infoDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-zinc-600">
              <p>
                <strong>{t("lifeExpectancy")}</strong>
                <br />
                {tc("male")}: {INDONESIA_LIFE_EXPECTANCY.male} {t("yearsOld")}
                <br />
                {tc("female")}: {INDONESIA_LIFE_EXPECTANCY.female} {t("yearsOld")}
              </p>
              <p>
                <strong>{t("source")}:</strong>
                <br />
                {t("sourceBPS")}
                <br />
                {t("sourceWHO")}
              </p>
              <p className="text-xs text-zinc-500">
                {t("disclaimer")}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
}
