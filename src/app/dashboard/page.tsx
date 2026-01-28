"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Settings,
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
  ChevronRight,
  Info,
} from "lucide-react";
import { LiveCountdown, DaysCountdown } from "@/components/countdown/LiveCountdown";
import { calculateAverageLifeExpectancy, formatNumber, DAYS_PER_YEAR } from "@/lib/calculator";
import { getUserData, hasSetup } from "@/lib/storage";
import { INDONESIA_LIFE_EXPECTANCY, LIFE_FACTS, LIFE_MILESTONES_ID } from "@/lib/research-data";
import type { UserData } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full" />
      </div>
    );
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
              MindfulDeath
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowInfo(!showInfo)}
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

      <main className="container mx-auto px-4 py-8">
        {/* Plan Type Badge */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium">
            {userData.planType === "death" ? (
              <>
                <Target className="w-4 h-4" />
                Death Plan
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                Retirement Plan
              </>
            )}
          </span>
        </div>

        {/* Main Countdown */}
        <section className="mb-12">
          <div className="glass-card rounded-3xl p-8 md:p-12 bg-white shadow-xl border border-zinc-200">
            <p className="text-center text-zinc-500 mb-2 text-sm uppercase tracking-wider font-medium">
              {userData.planType === "death"
                ? "Sisa waktu hidupmu"
                : "Waktu menuju pensiun"}
            </p>
            <LiveCountdown
              targetDate={targetDate}
              size="xl"
              showSeconds={true}
            />

            {/* Progress Bar */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-zinc-500 mb-2">
                <span>Lahir</span>
                <span>{lifePercentage}% terpakai</span>
                <span>
                  {userData.planType === "retirement" ? "Pensiun (58)" : `${estimate.lifeExpectancy} tahun`}
                </span>
              </div>
              <div className="h-3 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-full transition-all duration-1000"
                  style={{ width: `${lifePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-card rounded-2xl p-5 bg-white border border-zinc-200">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Usia Sekarang</p>
            <p className="text-3xl font-bold text-zinc-900">{userData.assessment!.age}</p>
            <p className="text-sm text-zinc-500">tahun</p>
          </div>
          <div className="glass-card rounded-2xl p-5 bg-white border border-zinc-200">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Sisa Hari</p>
            <p className="text-3xl font-bold text-zinc-900">
              {formatNumber(daysRemaining)}
            </p>
            <p className="text-sm text-zinc-500">hari</p>
          </div>
          <div className="glass-card rounded-2xl p-5 bg-white border border-zinc-200">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Goals</p>
            <p className="text-3xl font-bold text-zinc-900">{userData.goals.length}</p>
            <p className="text-sm text-zinc-500">dibuat</p>
          </div>
          <div className="glass-card rounded-2xl p-5 bg-white border border-zinc-200">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Tercapai</p>
            <p className="text-3xl font-bold text-green-600">{completedGoals}</p>
            <p className="text-sm text-zinc-500">goals</p>
          </div>
        </section>

        {/* Goals Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900">Goals</h2>
            <Link
              href="/goals"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Goal
            </Link>
          </div>

          {userData.goals.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 bg-white border border-zinc-200 text-center">
              <Target className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Belum ada goals
              </h3>
              <p className="text-zinc-600 mb-4">
                Mulai dengan menambahkan apa yang ingin kamu capai sebelum waktu habis.
              </p>
              <Link
                href="/goals"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Buat Goal Pertama
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userData.goals.slice(0, 5).map((goal) => (
                <Link
                  key={goal.id}
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
              ))}
              {userData.goals.length > 5 && (
                <Link
                  href="/goals"
                  className="block text-center py-3 text-zinc-600 hover:text-zinc-900 text-sm font-medium"
                >
                  Lihat semua {userData.goals.length} goals →
                </Link>
              )}
            </div>
          )}
        </section>

        {/* Milestones Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Milestone Hidup</h2>
          <div className="glass-card rounded-2xl p-6 bg-white border border-zinc-200">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-zinc-200" />

              <div className="space-y-4">
                {/* Passed milestones */}
                {passedMilestones.slice(-3).map((milestone) => (
                  <div key={milestone.age} className="flex items-center gap-4 pl-2">
                    <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-sm z-10" />
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900">{milestone.label}</p>
                      <p className="text-sm text-zinc-500">Usia {milestone.age} tahun ✓</p>
                    </div>
                  </div>
                ))}

                {/* Current */}
                <div className="flex items-center gap-4 pl-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10 animate-pulse" />
                  <div className="flex-1 bg-amber-50 rounded-lg p-3 -ml-2">
                    <p className="font-semibold text-amber-900">Sekarang</p>
                    <p className="text-sm text-amber-700">Usia {userData.assessment!.age} tahun</p>
                  </div>
                </div>

                {/* Upcoming milestones */}
                {upcomingMilestones.slice(0, 3).map((milestone) => (
                  <div key={milestone.age} className="flex items-center gap-4 pl-2 opacity-60">
                    <div className="w-5 h-5 rounded-full bg-zinc-300 border-2 border-white shadow-sm z-10" />
                    <div className="flex-1">
                      <p className="font-medium text-zinc-700">{milestone.label}</p>
                      <p className="text-sm text-zinc-500">Usia {milestone.age} tahun</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Tentang Data</h3>
              <div className="space-y-4 text-sm text-zinc-600">
                <p>
                  <strong>Angka Harapan Hidup (AHH) Indonesia 2023:</strong>
                  <br />
                  Pria: {INDONESIA_LIFE_EXPECTANCY.male} tahun
                  <br />
                  Wanita: {INDONESIA_LIFE_EXPECTANCY.female} tahun
                </p>
                <p>
                  <strong>Sumber:</strong>
                  <br />
                  Badan Pusat Statistik (BPS) Indonesia 2023
                  <br />
                  WHO Global Health Observatory
                </p>
                <p className="text-xs text-zinc-500">
                  Perhitungan ini adalah estimasi berdasarkan rata-rata statistik
                  dan bukan prediksi medis individual. Harapan hidup aktual dapat
                  berbeda berdasarkan banyak faktor.
                </p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="w-full mt-6 py-3 bg-zinc-900 text-white rounded-xl font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 pb-safe">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 text-zinc-900"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Dashboard</span>
            </Link>
            <Link
              href="/goals"
              className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-900"
            >
              <Target className="w-6 h-6" />
              <span className="text-xs font-medium">Goals</span>
            </Link>
            <Link
              href="/research"
              className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-900"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs font-medium">Riset</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
