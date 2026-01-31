import type { AssessmentData, LifeEstimate } from "@/types";
import {
  INDONESIA_LIFE_EXPECTANCY,
  LIFESTYLE_FACTORS,
  LIFE_EXPECTANCY_BY_PROVINCE,
} from "./research-data";

export const DAYS_PER_YEAR = 365.25;

// Hitung harapan hidup berdasarkan assessment lengkap
export function calculateLifeExpectancy(data: AssessmentData): LifeEstimate {
  // Base dari data Indonesia berdasarkan jenis kelamin
  let baseLE = data.gender === "female"
    ? INDONESIA_LIFE_EXPECTANCY.female
    : INDONESIA_LIFE_EXPECTANCY.male;

  // Sesuaikan berdasarkan provinsi jika tersedia
  if (data.province) {
    const provinceData = LIFE_EXPECTANCY_BY_PROVINCE.find(p => p.province === data.province);
    if (provinceData) {
      // Rata-rata antara base gender dan provinsi
      baseLE = (baseLE + provinceData.lifeExpectancy) / 2;
    }
  }

  // Terapkan faktor gaya hidup
  let adjustment = 0;

  if (data.smoking) {
    adjustment += LIFESTYLE_FACTORS.smoking[data.smoking] || 0;
  }
  if (data.exercise) {
    adjustment += LIFESTYLE_FACTORS.exercise[data.exercise] || 0;
  }
  if (data.bmi) {
    adjustment += LIFESTYLE_FACTORS.bmi[data.bmi] || 0;
  }
  if (data.sleep) {
    adjustment += LIFESTYLE_FACTORS.sleep[data.sleep] || 0;
  }
  if (data.stress) {
    adjustment += LIFESTYLE_FACTORS.stress[data.stress] || 0;
  }
  if (data.diet) {
    adjustment += LIFESTYLE_FACTORS.diet[data.diet] || 0;
  }
  if (data.alcohol) {
    adjustment += LIFESTYLE_FACTORS.alcohol[data.alcohol] || 0;
  }
  if (data.socialConnection) {
    adjustment += LIFESTYLE_FACTORS.socialConnection[data.socialConnection] || 0;
  }

  const adjustedLE = Math.max(data.age + 1, Math.round(baseLE + adjustment));
  const yearsRemaining = Math.max(0, adjustedLE - data.age);
  const daysRemaining = Math.round(yearsRemaining * DAYS_PER_YEAR);
  const daysLived = Math.round(data.age * DAYS_PER_YEAR);
  const totalDays = Math.round(adjustedLE * DAYS_PER_YEAR);

  return {
    lifeExpectancy: adjustedLE,
    yearsRemaining,
    daysRemaining,
    daysLived,
    totalDays,
    adjustmentApplied: adjustment,
  };
}

// Hitung untuk mode tanpa assessment (rata-rata Indonesia)
export function calculateAverageLifeExpectancy(
  age: number,
  gender: "male" | "female" = "male"
): LifeEstimate {
  const baseLE = gender === "female"
    ? INDONESIA_LIFE_EXPECTANCY.female
    : INDONESIA_LIFE_EXPECTANCY.male;

  const yearsRemaining = Math.max(0, baseLE - age);
  const daysRemaining = Math.round(yearsRemaining * DAYS_PER_YEAR);
  const daysLived = Math.round(age * DAYS_PER_YEAR);
  const totalDays = Math.round(baseLE * DAYS_PER_YEAR);

  return {
    lifeExpectancy: Math.round(baseLE),
    yearsRemaining,
    daysRemaining,
    daysLived,
    totalDays,
    adjustmentApplied: 0,
  };
}

// Format angka dengan separator ribuan Indonesia
export function formatNumber(num: number): string {
  return num.toLocaleString("id-ID");
}

// Konversi hari ke format yang mudah dibaca
export function formatDaysToReadable(days: number): {
  years: number;
  months: number;
  days: number;
} {
  const years = Math.floor(days / DAYS_PER_YEAR);
  const remainingDays = days - years * DAYS_PER_YEAR;
  const months = Math.floor(remainingDays / 30.44);
  const finalDays = Math.round(remainingDays - months * 30.44);

  return { years, months, days: finalDays };
}

// Hitung persentase hidup yang sudah dijalani
export function calculateLifePercentage(daysLived: number, totalDays: number): number {
  return Math.round((daysLived / totalDays) * 100);
}
