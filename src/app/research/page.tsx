"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Target,
  BookOpen,
  ChevronDown,
  ChevronUp,
  MapPin,
  Activity,
  AlertTriangle,
  Heart,
} from "lucide-react";
import {
  INDONESIA_LIFE_EXPECTANCY,
  RETIREMENT_AGE,
  TOP_CAUSES_OF_DEATH_INDONESIA,
  TOP_CAUSES_SOURCE,
  LIFE_EXPECTANCY_BY_PROVINCE,
  LIFESTYLE_ADJUSTMENT_FACTORS,
  LIFE_FACTS,
  ASIA_COMPARISON,
  ASIA_COMPARISON_SOURCE,
} from "@/lib/research-data";

export default function ResearchPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="font-bold text-xl text-zinc-900">
              MindfulDeath
            </Link>
            <span className="text-sm text-zinc-500">Data & Riset</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Angka Harapan Hidup Indonesia
          </h1>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Semua data berdasarkan riset dan statistik resmi dari Badan Pusat Statistik
            (BPS) Indonesia dan WHO Global Health Observatory.
          </p>
        </section>

        {/* Key Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-card rounded-2xl p-5 bg-white border border-zinc-200 text-center">
            <p className="text-4xl font-bold text-zinc-900">
              {INDONESIA_LIFE_EXPECTANCY.overall}
            </p>
            <p className="text-sm text-zinc-500">Rata-rata (tahun)</p>
          </div>
          <div className="glass-card rounded-2xl p-5 bg-white border border-zinc-200 text-center">
            <p className="text-4xl font-bold text-blue-600">
              {INDONESIA_LIFE_EXPECTANCY.male}
            </p>
            <p className="text-sm text-zinc-500">Pria (tahun)</p>
          </div>
          <div className="glass-card rounded-2xl p-5 bg-white border border-zinc-200 text-center">
            <p className="text-4xl font-bold text-pink-600">
              {INDONESIA_LIFE_EXPECTANCY.female}
            </p>
            <p className="text-sm text-zinc-500">Wanita (tahun)</p>
          </div>
          <div className="glass-card rounded-2xl p-5 bg-white border border-zinc-200 text-center">
            <p className="text-4xl font-bold text-amber-600">{RETIREMENT_AGE.normal}</p>
            <p className="text-sm text-zinc-500">Usia Pensiun</p>
          </div>
        </section>

        {/* Accordion Sections */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {/* Overview */}
          <div className="glass-card rounded-2xl bg-white border border-zinc-200 overflow-hidden">
            <button
              onClick={() => toggleSection("overview")}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-zinc-600" />
                <h2 className="text-lg font-semibold text-zinc-900">
                  Gambaran Umum
                </h2>
              </div>
              {expandedSection === "overview" ? (
                <ChevronUp className="w-5 h-5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              )}
            </button>
            {expandedSection === "overview" && (
              <div className="px-5 pb-5 pt-0">
                <div className="space-y-4 text-zinc-600">
                  <p>
                    <strong>Angka Harapan Hidup (AHH)</strong> adalah rata-rata perkiraan
                    banyak tahun yang dapat ditempuh seseorang selama hidup. AHH Indonesia
                    terus meningkat dari tahun ke tahun.
                  </p>
                  <div className="bg-zinc-50 rounded-xl p-4">
                    <p className="font-medium text-zinc-900 mb-2">Fakta Penting:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>
                        Wanita hidup rata-rata {Math.round(INDONESIA_LIFE_EXPECTANCY.female - INDONESIA_LIFE_EXPECTANCY.male)} tahun lebih lama dari pria
                      </li>
                      <li>
                        AHH Indonesia masih di bawah rata-rata global (73.4 tahun)
                      </li>
                      <li>
                        Penyakit tidak menular (PTM) menjadi penyebab utama kematian
                      </li>
                    </ul>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Sumber: {INDONESIA_LIFE_EXPECTANCY.source}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Causes of Death */}
          <div className="glass-card rounded-2xl bg-white border border-zinc-200 overflow-hidden">
            <button
              onClick={() => toggleSection("causes")}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold text-zinc-900">
                  Penyebab Kematian Utama
                </h2>
              </div>
              {expandedSection === "causes" ? (
                <ChevronUp className="w-5 h-5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              )}
            </button>
            {expandedSection === "causes" && (
              <div className="px-5 pb-5 pt-0">
                <div className="space-y-3">
                  {TOP_CAUSES_OF_DEATH_INDONESIA.map((item, index) => (
                    <div
                      key={item.cause}
                      className="flex items-center gap-4 p-3 bg-zinc-50 rounded-xl"
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
                        <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                            style={{ width: `${item.percentage * 3}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-4">
                  Sumber:{" "}
                  <a
                    href={TOP_CAUSES_SOURCE.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {TOP_CAUSES_SOURCE.name}
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* By Province */}
          <div className="glass-card rounded-2xl bg-white border border-zinc-200 overflow-hidden">
            <button
              onClick={() => toggleSection("province")}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-zinc-900">
                  Berdasarkan Provinsi
                </h2>
              </div>
              {expandedSection === "province" ? (
                <ChevronUp className="w-5 h-5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              )}
            </button>
            {expandedSection === "province" && (
              <div className="px-5 pb-5 pt-0">
                <div className="space-y-2">
                  {LIFE_EXPECTANCY_BY_PROVINCE.map((item, index) => (
                    <div
                      key={item.province}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index < 3
                              ? "bg-green-100 text-green-700"
                              : index >= LIFE_EXPECTANCY_BY_PROVINCE.length - 3
                              ? "bg-red-100 text-red-700"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="text-zinc-900">{item.province}</span>
                      </div>
                      <span className="font-semibold text-zinc-700">
                        {item.lifeExpectancy} tahun
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-4">
                  Sumber:{" "}
                  <a
                    href={INDONESIA_LIFE_EXPECTANCY.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    BPS Indonesia 2023
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Asia Comparison */}
          <div className="glass-card rounded-2xl bg-white border border-zinc-200 overflow-hidden">
            <button
              onClick={() => toggleSection("asia")}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-zinc-900">
                  Perbandingan Asia
                </h2>
              </div>
              {expandedSection === "asia" ? (
                <ChevronUp className="w-5 h-5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              )}
            </button>
            {expandedSection === "asia" && (
              <div className="px-5 pb-5 pt-0">
                <div className="space-y-2">
                  {ASIA_COMPARISON.map((item) => (
                    <div
                      key={item.country}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        item.country === "Indonesia" ? "bg-amber-50" : "hover:bg-zinc-50"
                      }`}
                    >
                      <span
                        className={`${
                          item.country === "Indonesia"
                            ? "font-bold text-amber-900"
                            : "text-zinc-900"
                        }`}
                      >
                        {item.country}
                      </span>
                      <span
                        className={`font-semibold ${
                          item.country === "Indonesia"
                            ? "text-amber-700"
                            : "text-zinc-700"
                        }`}
                      >
                        {item.lifeExpectancy} tahun
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-4">
                  Sumber:{" "}
                  <a
                    href={ASIA_COMPARISON_SOURCE.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {ASIA_COMPARISON_SOURCE.name}
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Lifestyle Factors */}
          <div className="glass-card rounded-2xl bg-white border border-zinc-200 overflow-hidden">
            <button
              onClick={() => toggleSection("lifestyle")}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-pink-500" />
                <h2 className="text-lg font-semibold text-zinc-900">
                  Faktor Gaya Hidup
                </h2>
              </div>
              {expandedSection === "lifestyle" ? (
                <ChevronUp className="w-5 h-5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              )}
            </button>
            {expandedSection === "lifestyle" && (
              <div className="px-5 pb-5 pt-0">
                <p className="text-zinc-600 mb-4">
                  Faktor-faktor berikut dapat mempengaruhi harapan hidup berdasarkan
                  berbagai penelitian:
                </p>
                <div className="space-y-3">
                  {LIFESTYLE_ADJUSTMENT_FACTORS.map((factor) => (
                    <div
                      key={factor.factor}
                      className="p-4 bg-zinc-50 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-zinc-900">{factor.factor}</span>
                        <span
                          className={`text-sm font-semibold px-2 py-1 rounded-full ${
                            factor.impact > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {factor.impact > 0 ? "+" : ""}
                          {factor.impact} tahun
                        </span>
                      </div>
                      <a
                        href={factor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {factor.source} ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Facts */}
          <div className="glass-card rounded-2xl bg-white border border-zinc-200 overflow-hidden">
            <button
              onClick={() => toggleSection("facts")}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-semibold text-zinc-900">Fakta Menarik</h2>
              </div>
              {expandedSection === "facts" ? (
                <ChevronUp className="w-5 h-5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              )}
            </button>
            {expandedSection === "facts" && (
              <div className="px-5 pb-5 pt-0">
                <div className="space-y-4">
                  {LIFE_FACTS.map((item, index) => (
                    <div key={index} className="p-4 bg-zinc-50 rounded-xl">
                      <p className="text-zinc-800 mb-2">&quot;{item.fact}&quot;</p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Sumber: {item.source} ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <section className="mt-12 max-w-3xl mx-auto">
          <div className="glass-card rounded-2xl p-6 bg-amber-50 border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">Disclaimer</h3>
            <p className="text-sm text-amber-800">
              Semua data dan perhitungan di MindfulDeath adalah estimasi berdasarkan
              rata-rata statistik dan penelitian ilmiah. Ini bukan prediksi medis
              individual. Harapan hidup aktual dapat berbeda berdasarkan banyak faktor
              termasuk genetik, gaya hidup, akses kesehatan, dan kondisi lingkungan.
            </p>
          </div>
        </section>

        {/* Crisis Resources */}
        <section className="mt-8 max-w-3xl mx-auto">
          <div className="glass-card rounded-2xl p-6 bg-zinc-900 text-white">
            <h3 className="font-semibold mb-3">Butuh Bantuan?</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Jika kamu mengalami pikiran yang sulit, jangan ragu untuk menghubungi:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:119"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
              >
                🇮🇩 119 ext 8
              </a>
              <a
                href="https://www.intothelightid.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
              >
                Into The Light Indonesia
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 pb-safe">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-900"
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
              className="flex flex-col items-center gap-1 text-zinc-900"
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
