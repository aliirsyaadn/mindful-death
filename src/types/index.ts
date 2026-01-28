export type Gender = "male" | "female";

export type SmokingStatus = "never" | "former" | "light" | "heavy";

export type ExerciseLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive";

export type BMICategory = "underweight" | "normal" | "overweight" | "obese";

export type SleepQuality = "poor" | "fair" | "good" | "excessive";

export type StressLevel = "low" | "moderate" | "high" | "chronic";

export type DietQuality = "poor" | "average" | "healthy" | "optimal";

export type AlcoholConsumption = "never" | "moderate" | "heavy";

export type SocialConnection = "isolated" | "limited" | "moderate" | "strong";

export type PlanType = "death" | "retirement";

export type LifeStage =
  | "muda"        // 18-30
  | "produktif"   // 30-45
  | "mapan"       // 45-55
  | "prapensiun"  // 55-60
  | "pensiun";    // 60+

export interface AssessmentData {
  age: number;
  gender: Gender;
  province?: string;
  smoking?: SmokingStatus;
  exercise?: ExerciseLevel;
  bmi?: BMICategory;
  sleep?: SleepQuality;
  stress?: StressLevel;
  diet?: DietQuality;
  alcohol?: AlcoholConsumption;
  socialConnection?: SocialConnection;
}

export interface LifeEstimate {
  lifeExpectancy: number;
  yearsRemaining: number;
  daysRemaining: number;
  daysLived: number;
  totalDays: number;
  yearsToRetirement: number;
  daysToRetirement: number;
  adjustmentApplied: number;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetAge?: number;
  targetDate?: string;
  category: GoalCategory;
  priority?: "low" | "medium" | "high";
  completed: boolean;
  createdAt: string;
}

export type GoalCategory =
  | "karir"
  | "keluarga"
  | "kesehatan"
  | "keuangan"
  | "spiritual"
  | "pendidikan"
  | "pengalaman"
  | "warisan";

export interface UserData {
  assessment?: AssessmentData;
  lifeEstimate?: LifeEstimate;
  goals: Goal[];
  planType: PlanType;
  birthDate?: string;
  completedAt?: string;
  createdAt: string;
}
