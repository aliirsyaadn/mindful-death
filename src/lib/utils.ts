import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LifeStage } from "@/types";
import { LIFE_STAGES } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLifeStageForAge(age: number): LifeStage {
  for (const [stage, range] of Object.entries(LIFE_STAGES)) {
    if (age >= range.min && age < range.max) {
      return stage as LifeStage;
    }
  }
  return "pensiun";
}

export function generateId(): string {
  return crypto.randomUUID();
}
