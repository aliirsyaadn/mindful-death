import type { UserData, Goal, AssessmentData, LifeEstimate, PlanType, GoalCategory } from "@/types";

const STORAGE_KEY = "mindfuldeath_user_data";

const DEFAULT_USER_DATA: UserData = {
  goals: [],
  planType: "death",
  createdAt: new Date().toISOString(),
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getUserData(): UserData {
  if (!isBrowser()) return DEFAULT_USER_DATA;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_USER_DATA;
    return JSON.parse(data) as UserData;
  } catch {
    return DEFAULT_USER_DATA;
  }
}

export function saveUserData(data: UserData): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
  }
}

export function updateUserData(data: UserData): void {
  saveUserData(data);
}

export function saveAssessment(
  assessment: AssessmentData,
  lifeEstimate: LifeEstimate
): void {
  const userData = getUserData();
  userData.assessment = assessment;
  userData.lifeEstimate = lifeEstimate;
  userData.completedAt = new Date().toISOString();
  saveUserData(userData);
}

export function saveQuickSetup(
  age: number,
  gender: "male" | "female",
  planType: PlanType,
  birthDate?: string
): void {
  const userData = getUserData();
  userData.assessment = { age, gender };
  userData.planType = planType;
  userData.birthDate = birthDate;
  if (!userData.createdAt) {
    userData.createdAt = new Date().toISOString();
  }
  saveUserData(userData);
}

export function setPlanType(planType: PlanType): void {
  const userData = getUserData();
  userData.planType = planType;
  saveUserData(userData);
}

export function getGoals(): Goal[] {
  return getUserData().goals;
}

export function addGoal(goal: Omit<Goal, "id" | "createdAt" | "completed">): Goal {
  const userData = getUserData();
  const newGoal: Goal = {
    ...goal,
    id: crypto.randomUUID(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  userData.goals.push(newGoal);
  saveUserData(userData);
  return newGoal;
}

export function saveGoal(goal: Goal): void {
  const userData = getUserData();
  const existingIndex = userData.goals.findIndex((g) => g.id === goal.id);
  if (existingIndex !== -1) {
    userData.goals[existingIndex] = goal;
  } else {
    userData.goals.push(goal);
  }
  saveUserData(userData);
}

export function updateGoal(id: string, updates: Partial<Goal>): void {
  const userData = getUserData();
  const goalIndex = userData.goals.findIndex((g) => g.id === id);
  if (goalIndex !== -1) {
    userData.goals[goalIndex] = { ...userData.goals[goalIndex], ...updates };
    saveUserData(userData);
  }
}

export function deleteGoal(id: string): void {
  const userData = getUserData();
  userData.goals = userData.goals.filter((g) => g.id !== id);
  saveUserData(userData);
}

export function toggleGoalComplete(id: string): void {
  const userData = getUserData();
  const goal = userData.goals.find((g) => g.id === id);
  if (goal) {
    goal.completed = !goal.completed;
    saveUserData(userData);
  }
}

export function clearAllData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasSetup(): boolean {
  const userData = getUserData();
  return !!userData.assessment?.age;
}

// Kategori goal dengan label Indonesia
export const GOAL_CATEGORIES: { value: GoalCategory; label: string; icon: string }[] = [
  { value: "karir", label: "Karir & Pekerjaan", icon: "💼" },
  { value: "keluarga", label: "Keluarga & Hubungan", icon: "👨‍👩‍👧‍👦" },
  { value: "kesehatan", label: "Kesehatan & Kebugaran", icon: "🏃" },
  { value: "keuangan", label: "Keuangan & Investasi", icon: "💰" },
  { value: "spiritual", label: "Spiritual & Keagamaan", icon: "🙏" },
  { value: "pendidikan", label: "Pendidikan & Skill", icon: "📚" },
  { value: "pengalaman", label: "Pengalaman & Bucket List", icon: "✈️" },
  { value: "warisan", label: "Warisan & Legacy", icon: "🌟" },
];
