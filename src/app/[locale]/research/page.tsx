"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  TrendingUp,
  MapPin,
  Activity,
  AlertTriangle,
  Heart,
  BookOpen,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BottomNavbar, LanguageSwitcher } from "@/components/navigation";
import { MotionList, MotionItem, MotionFadeUp } from "@/components/motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function ResearchPage() {
  const t = useTranslations("research");
  const tc = useTranslations("common");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="font-bold text-xl text-zinc-900">
              {tc("appName")}
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500">{t("dataResearch")}</span>
              <LanguageSwitcher variant="light" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <MotionFadeUp>
          <section className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              {t("title")}
            </h1>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </section>
        </MotionFadeUp>

        {/* Key Stats */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { value: INDONESIA_LIFE_EXPECTANCY.overall, label: t("average") },
            { value: INDONESIA_LIFE_EXPECTANCY.male, label: t("maleYears"), color: "text-blue-600" },
            { value: INDONESIA_LIFE_EXPECTANCY.female, label: t("femaleYears"), color: "text-pink-600" },
            { value: RETIREMENT_AGE.normal, label: t("retirementAge"), color: "text-amber-600" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="glass-card rounded-2xl p-5 bg-white border border-zinc-200 text-center"
            >
              <p className={`text-4xl font-bold ${stat.color || "text-zinc-900"}`}>
                {stat.value}
              </p>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Accordion Sections */}
        <MotionFadeUp delay={0.2}>
          <Accordion type="single" collapsible defaultValue="overview" className="max-w-3xl mx-auto">
            {/* Overview */}
            <AccordionItem value="overview">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-zinc-600" />
                  <span className="text-lg font-semibold text-zinc-900">{t("overview")}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-zinc-600">
                  <p>
                    <strong>{t("overviewDesc")}</strong>
                  </p>
                  <div className="bg-zinc-50 rounded-xl p-4">
                    <p className="font-medium text-zinc-900 mb-2">{t("importantFacts")}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>
                        {t("factWomenLonger", { years: Math.round(INDONESIA_LIFE_EXPECTANCY.female - INDONESIA_LIFE_EXPECTANCY.male) })}
                      </li>
                      <li>
                        {t("factBelowGlobal")}
                      </li>
                      <li>
                        {t("factNCD")}
                      </li>
                    </ul>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Source: {INDONESIA_LIFE_EXPECTANCY.source}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Causes of Death */}
            <AccordionItem value="causes">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-lg font-semibold text-zinc-900">{t("causesOfDeath")}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <MotionList delay={0.1} className="space-y-3">
                  {TOP_CAUSES_OF_DEATH_INDONESIA.map((item, index) => (
                    <MotionItem
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
                <p className="text-xs text-zinc-500 mt-4">
                  Source:{" "}
                  <a
                    href={TOP_CAUSES_SOURCE.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {TOP_CAUSES_SOURCE.name}
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* By Province */}
            <AccordionItem value="province">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-semibold text-zinc-900">{t("byProvince")}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {LIFE_EXPECTANCY_BY_PROVINCE.map((item, index) => (
                    <motion.div
                      key={item.province}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
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
                        {item.lifeExpectancy} {tc("years")}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-4">
                  Source:{" "}
                  <a
                    href={INDONESIA_LIFE_EXPECTANCY.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    BPS Indonesia 2023
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Asia Comparison */}
            <AccordionItem value="asia">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-semibold text-zinc-900">{t("asiaComparison")}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {ASIA_COMPARISON.map((item, index) => (
                    <motion.div
                      key={item.country}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
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
                        {item.lifeExpectancy} {tc("years")}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-4">
                  Source:{" "}
                  <a
                    href={ASIA_COMPARISON_SOURCE.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {ASIA_COMPARISON_SOURCE.name}
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Lifestyle Factors */}
            <AccordionItem value="lifestyle">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="text-lg font-semibold text-zinc-900">{t("lifestyleFactors")}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-zinc-600 mb-4">
                  {t("lifestyleFactorsDesc")}
                </p>
                <MotionList delay={0.1} className="space-y-3">
                  {LIFESTYLE_ADJUSTMENT_FACTORS.map((factor, index) => (
                    <MotionItem
                      key={factor.factor}
                      className="p-4 bg-zinc-50 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-zinc-900">{factor.factor}</span>
                        <Badge variant={factor.impact > 0 ? "success" : "destructive"}>
                          {factor.impact > 0 ? "+" : ""}{factor.impact} {tc("years")}
                        </Badge>
                      </div>
                      <a
                        href={factor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {factor.source} ↗
                      </a>
                    </MotionItem>
                  ))}
                </MotionList>
              </AccordionContent>
            </AccordionItem>

            {/* Facts */}
            <AccordionItem value="facts">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span className="text-lg font-semibold text-zinc-900">{t("interestingFacts")}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <MotionList delay={0.1} className="space-y-4">
                  {LIFE_FACTS.map((item, index) => (
                    <MotionItem key={index} className="p-4 bg-zinc-50 rounded-xl">
                      <p className="text-zinc-800 mb-2">&quot;{item.fact}&quot;</p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Source: {item.source} ↗
                      </a>
                    </MotionItem>
                  ))}
                </MotionList>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </MotionFadeUp>

        {/* Disclaimer */}
        <MotionFadeUp delay={0.3}>
          <section className="mt-12 max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl p-6 bg-amber-50 border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-2">{t("disclaimer")}</h3>
              <p className="text-sm text-amber-800">
                {t("disclaimerText")}
              </p>
            </div>
          </section>
        </MotionFadeUp>

        {/* Crisis Resources */}
        <MotionFadeUp delay={0.4}>
          <section className="mt-8 max-w-3xl mx-auto">
            <div className="glass-card rounded-2xl p-6 bg-zinc-900 text-white">
              <h3 className="font-semibold mb-3">{t("needHelp")}</h3>
              <p className="text-sm text-zinc-400 mb-4">
                {t("needHelpDesc")}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:119"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
                >
                  119 ext 8
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
        </MotionFadeUp>
      </main>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
}
