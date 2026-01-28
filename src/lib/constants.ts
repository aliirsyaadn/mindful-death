import type { LifeStage } from "@/types";

// Days per year for calculations
export const DAYS_PER_YEAR = 365.25;

// Life stage age ranges (Indonesian labels)
export const LIFE_STAGES: Record<LifeStage, { min: number; max: number; label: string }> = {
  muda: { min: 18, max: 30, label: "Muda" },
  produktif: { min: 30, max: 45, label: "Produktif" },
  mapan: { min: 45, max: 55, label: "Mapan" },
  prapensiun: { min: 55, max: 60, label: "Pra-Pensiun" },
  pensiun: { min: 60, max: 100, label: "Pensiun" },
};

// Storage keys
export const STORAGE_KEYS = {
  USER_DATA: "mindfuldeath_user_data",
} as const;

// Crisis resources
export const CRISIS_RESOURCES = {
  id: {
    name: "Into The Light Indonesia",
    number: "119 ext 8",
    url: "https://www.intothelightid.org",
  },
  global: {
    name: "Find A Helpline",
    url: "https://findahelpline.com",
  },
} as const;

// Helper to get life stage from age
export function getLifeStage(age: number): LifeStage {
  if (age < 30) return "muda";
  if (age < 45) return "produktif";
  if (age < 55) return "mapan";
  if (age < 60) return "prapensiun";
  return "pensiun";
}
