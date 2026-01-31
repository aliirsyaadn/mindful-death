"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { InputProps } from "@/types/assessment";

export function DateInput({ question, value, onChange, disabled }: InputProps) {
  const t = useTranslations();
  const config = question.config;
  const minYear = config.minYear ?? 1920;
  const maxYear = config.maxYear ?? new Date().getFullYear() - 10;

  // Parse existing value
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  useEffect(() => {
    if (typeof value === "string" && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setDay(String(date.getDate()).padStart(2, "0"));
        setMonth(String(date.getMonth() + 1).padStart(2, "0"));
        setYear(String(date.getFullYear()));
      }
    }
  }, [value]);

  // Calculate age
  const age = useMemo(() => {
    if (!day || !month || !year) return null;
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  }, [day, month, year]);

  const handleChange = (newDay: string, newMonth: string, newYear: string) => {
    setDay(newDay);
    setMonth(newMonth);
    setYear(newYear);

    // Only emit if all fields are filled
    if (newDay && newMonth && newYear && newYear.length === 4) {
      const dateStr = `${newYear}-${newMonth.padStart(2, "0")}-${newDay.padStart(2, "0")}`;
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        onChange(dateStr);
      }
    }
  };

  const months = [
    { value: "01", labelKey: "assessment.months.january" },
    { value: "02", labelKey: "assessment.months.february" },
    { value: "03", labelKey: "assessment.months.march" },
    { value: "04", labelKey: "assessment.months.april" },
    { value: "05", labelKey: "assessment.months.may" },
    { value: "06", labelKey: "assessment.months.june" },
    { value: "07", labelKey: "assessment.months.july" },
    { value: "08", labelKey: "assessment.months.august" },
    { value: "09", labelKey: "assessment.months.september" },
    { value: "10", labelKey: "assessment.months.october" },
    { value: "11", labelKey: "assessment.months.november" },
    { value: "12", labelKey: "assessment.months.december" },
  ];

  return (
    <div className="space-y-6">
      {/* Date inputs */}
      <div className="grid grid-cols-3 gap-3">
        {/* Day */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            {t("assessment.day")}
          </label>
          <select
            value={day}
            onChange={(e) => handleChange(e.target.value, month, year)}
            disabled={disabled}
            className="w-full h-12 px-3 rounded-xl border-2 border-zinc-200 bg-white focus:border-zinc-900 focus:outline-none transition-colors"
          >
            <option value="">--</option>
            {Array.from({ length: 31 }, (_, i) => {
              const d = String(i + 1).padStart(2, "0");
              return (
                <option key={d} value={d}>
                  {i + 1}
                </option>
              );
            })}
          </select>
        </div>

        {/* Month */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            {t("assessment.month")}
          </label>
          <select
            value={month}
            onChange={(e) => handleChange(day, e.target.value, year)}
            disabled={disabled}
            className="w-full h-12 px-3 rounded-xl border-2 border-zinc-200 bg-white focus:border-zinc-900 focus:outline-none transition-colors"
          >
            <option value="">--</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {t(m.labelKey)}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            {t("assessment.year")}
          </label>
          <select
            value={year}
            onChange={(e) => handleChange(day, month, e.target.value)}
            disabled={disabled}
            className="w-full h-12 px-3 rounded-xl border-2 border-zinc-200 bg-white focus:border-zinc-900 focus:outline-none transition-colors"
          >
            <option value="">--</option>
            {Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
              const y = maxYear - i;
              return (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Age display */}
      {age !== null && config.showAge !== false && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-zinc-100 rounded-xl"
        >
          <p className="text-sm text-zinc-500 mb-1">{t("assessment.yourAge")}</p>
          <p className="text-3xl font-bold text-zinc-900">
            {age} <span className="text-lg font-normal text-zinc-500">{t("assessment.years")}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
