"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Target, BarChart3, Heart } from "lucide-react";
import { INDONESIA_LIFE_EXPECTANCY, LIFE_FACTS, TOP_CAUSES_OF_DEATH_INDONESIA } from "@/lib/research-data";
import { calculateAverageLifeExpectancy, formatNumber, DAYS_PER_YEAR } from "@/lib/calculator";
import { saveQuickSetup, hasSetup } from "@/lib/storage";
import type { PlanType } from "@/types";

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
  const [gender, setGender] = useState<"male" | "female">("male");
  const [planType, setPlanType] = useState<PlanType>("death");
  const [birthDate, setBirthDate] = useState("");
  const [currentFact, setCurrentFact] = useState(0);

  // Calculate age from birth date
  const age = birthDate ? calculateAge(birthDate) : 30;

  useEffect(() => {
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

  const estimate = calculateAverageLifeExpectancy(age, gender, planType);
  const avgDays = Math.round(INDONESIA_LIFE_EXPECTANCY.overall * DAYS_PER_YEAR);

  const handleStart = () => {
    if (!birthDate) return;
    saveQuickSetup(age, gender, planType, birthDate);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">
                Berdasarkan data BPS Indonesia 2023
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Kamu punya{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                {formatNumber(avgDays)}
              </span>{" "}
              hari
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 mb-4">
              Rata-rata orang Indonesia hidup selama {INDONESIA_LIFE_EXPECTANCY.overall} tahun.
            </p>

            <p className="text-lg text-zinc-500 mb-12 max-w-2xl mx-auto">
              Berapa hari yang sudah kamu habiskan? Berapa yang tersisa?
              <br />
              <span className="text-white/70">Apa yang akan kamu lakukan dengan sisa waktumu?</span>
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="glass-card rounded-xl p-4 bg-white/5 border border-white/10">
                <p className="text-3xl font-bold text-white">{INDONESIA_LIFE_EXPECTANCY.male}</p>
                <p className="text-sm text-zinc-400">Tahun (Pria)</p>
              </div>
              <div className="glass-card rounded-xl p-4 bg-white/5 border border-white/10">
                <p className="text-3xl font-bold text-white">{INDONESIA_LIFE_EXPECTANCY.female}</p>
                <p className="text-sm text-zinc-400">Tahun (Wanita)</p>
              </div>
              <div className="glass-card rounded-xl p-4 bg-white/5 border border-white/10">
                <p className="text-3xl font-bold text-white">58</p>
                <p className="text-sm text-zinc-400">Usia Pensiun</p>
              </div>
              <div className="glass-card rounded-xl p-4 bg-white/5 border border-white/10">
                <p className="text-3xl font-bold text-amber-400">{formatNumber(avgDays)}</p>
                <p className="text-sm text-zinc-400">Hari Rata-rata</p>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="animate-bounce">
              <ArrowRight className="w-6 h-6 text-zinc-500 mx-auto rotate-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Setup Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Mulai Sekarang
              </h2>
              <p className="text-zinc-600">
                Tidak perlu assessment panjang. Masukkan data dasar dan langsung lihat countdown-mu.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 shadow-xl border border-zinc-200">
              {/* Plan Type Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-zinc-700 mb-3">
                  Pilih Rencana
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPlanType("death")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      planType === "death"
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <Clock className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-semibold">Death Plan</p>
                    <p className="text-xs opacity-70">Hitung mundur ke akhir hayat</p>
                  </button>
                  <button
                    onClick={() => setPlanType("retirement")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      planType === "retirement"
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <Target className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-semibold">Retirement Plan</p>
                    <p className="text-xs opacity-70">Hitung mundur ke pensiun</p>
                  </button>
                </div>
              </div>

              {/* Gender Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Jenis Kelamin
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGender("male")}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      gender === "male"
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    Pria
                  </button>
                  <button
                    onClick={() => setGender("female")}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      gender === "female"
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    Wanita
                  </button>
                </div>
              </div>

              {/* Birth Date */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 rounded-xl border-2 border-zinc-200 focus:border-zinc-900 focus:outline-none transition-colors"
                />
                {birthDate && (
                  <p className="text-sm text-zinc-500 mt-2">
                    Usia kamu saat ini: <span className="font-semibold text-zinc-900">{age} tahun</span>
                  </p>
                )}
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-6 mb-6 text-white">
                <p className="text-sm text-zinc-400 mb-2">
                  {planType === "death" ? "Sisa hari hidupmu:" : "Hari menuju pensiun:"}
                </p>
                <p className="text-4xl md:text-5xl font-extrabold countdown-number">
                  {formatNumber(planType === "death" ? estimate.daysRemaining : estimate.daysToRetirement)}
                  <span className="text-xl text-zinc-400 ml-2">hari</span>
                </p>
                <p className="text-sm text-zinc-500 mt-2">
                  ≈ {Math.round(planType === "death" ? estimate.yearsRemaining : estimate.yearsToRetirement)} tahun lagi
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleStart}
                disabled={!birthDate}
                className="w-full py-4 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {birthDate ? "Lihat Dashboard" : "Masukkan Tanggal Lahir"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Research Data Section */}
      <section className="py-16 md:py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Data & Riset
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Angka-angka ini berdasarkan data resmi dari Badan Pusat Statistik (BPS)
              dan penelitian kesehatan global.
            </p>
          </div>

          {/* Rotating Facts */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="glass-card rounded-2xl p-8 text-center border border-zinc-200">
              <p className="text-xl md:text-2xl font-medium text-zinc-800 mb-3">
                &ldquo;{LIFE_FACTS[currentFact].fact}&rdquo;
              </p>
              <p className="text-sm text-zinc-500">
                Sumber: {LIFE_FACTS[currentFact].source}
              </p>
            </div>
          </div>

          {/* Causes of Death */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 text-center">
              Penyebab Kematian Utama di Indonesia
            </h3>
            <div className="grid gap-3">
              {TOP_CAUSES_OF_DEATH_INDONESIA.slice(0, 5).map((item, index) => (
                <div
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
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                        style={{ width: `${item.percentage * 3}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-zinc-500 mt-4">
              Sumber: BPS Indonesia 2022
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">
                Countdown Real-Time
              </h3>
              <p className="text-zinc-600">
                Lihat sisa waktu hidupmu dalam hari, jam, menit, dan detik secara real-time.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">
                Goal Setting
              </h3>
              <p className="text-zinc-600">
                Buat dan kelola goal hidupmu berdasarkan kategori: karir, keluarga, kesehatan, dll.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">
                Data Riset
              </h3>
              <p className="text-zinc-600">
                Semua perhitungan berdasarkan data BPS dan riset kesehatan global.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-zinc-400 text-sm">
                Butuh bantuan? Hubungi: <strong className="text-white">119 ext 8</strong> (Into The Light Indonesia)
              </span>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              MindfulDeath adalah alat kesadaran untuk membantu merencanakan hidup dengan lebih bermakna.
              Perhitungan berdasarkan data rata-rata dan bukan prediksi medis individual.
            </p>
            <p className="text-xs text-zinc-600">
              Sumber data: BPS Indonesia 2023, WHO Global Health Observatory
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
