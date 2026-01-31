import type { UserData, Goal, AssessmentData, LifeEstimate, GoalCategory } from "@/types";
import type {
  AssessmentSession,
  AssessmentAnswers,
  AssessmentResult,
  ExtendedAssessmentData,
} from "@/types/assessment";

const STORAGE_KEY = "mindfuldeath_user_data";
const ASSESSMENT_SESSION_KEY = "mindfuldeath_assessment_session";

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
  birthDate?: string
): void {
  const userData = getUserData();
  userData.assessment = { age, gender };
  userData.planType = "death";
  userData.birthDate = birthDate;
  if (!userData.createdAt) {
    userData.createdAt = new Date().toISOString();
  }
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

// ===== ASSESSMENT SESSION STORAGE =====

/**
 * Get current assessment session
 */
export function getAssessmentSession(): AssessmentSession | null {
  if (!isBrowser()) return null;

  try {
    const data = localStorage.getItem(ASSESSMENT_SESSION_KEY);
    if (!data) return null;
    return JSON.parse(data) as AssessmentSession;
  } catch {
    return null;
  }
}

/**
 * Save assessment session
 */
export function saveAssessmentSession(session: AssessmentSession): void {
  if (!isBrowser()) return;

  try {
    const updated: AssessmentSession = {
      ...session,
      lastUpdatedAt: new Date().toISOString(),
    };
    localStorage.setItem(ASSESSMENT_SESSION_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save assessment session:", error);
  }
}

/**
 * Start a new assessment session
 */
export function startNewAssessmentSession(
  flowId: string,
  flowVersion: string,
  initialQuestionId: string | null = null,
  initialAnswers: AssessmentAnswers = {}
): AssessmentSession {
  // Pre-fill from existing user data if available
  const userData = getUserData();
  const prefillAnswers: AssessmentAnswers = { ...initialAnswers };

  if (userData.birthDate && !prefillAnswers.birth_date) {
    prefillAnswers.birth_date = userData.birthDate;
  }
  if (userData.assessment?.gender && !prefillAnswers.gender) {
    prefillAnswers.gender = userData.assessment.gender;
  }

  const session: AssessmentSession = {
    flowId,
    flowVersion,
    currentQuestionId: initialQuestionId,
    answers: prefillAnswers,
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  };

  saveAssessmentSession(session);
  return session;
}

/**
 * Update a single answer in the session
 */
export function updateAssessmentAnswer(
  questionId: string,
  answer: AssessmentAnswers[string]
): void {
  const session = getAssessmentSession();
  if (!session) return;

  session.answers[questionId] = answer;
  saveAssessmentSession(session);
}

/**
 * Update current question in session
 */
export function updateCurrentQuestion(questionId: string | null): void {
  const session = getAssessmentSession();
  if (!session) return;

  session.currentQuestionId = questionId;
  saveAssessmentSession(session);
}

/**
 * Mark assessment session as completed
 */
export function completeAssessmentSession(): void {
  const session = getAssessmentSession();
  if (!session) return;

  session.completedAt = new Date().toISOString();
  saveAssessmentSession(session);
}

/**
 * Clear assessment session
 */
export function clearAssessmentSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ASSESSMENT_SESSION_KEY);
}

/**
 * Check if there's an in-progress assessment
 */
export function hasInProgressAssessment(): boolean {
  const session = getAssessmentSession();
  return session !== null && !session.completedAt;
}

/**
 * Save completed assessment to user data
 */
export function saveCompletedAssessment(
  answers: AssessmentAnswers,
  result: AssessmentResult,
  lifeEstimate: LifeEstimate
): void {
  const userData = getUserData();

  // Store extended assessment data
  const extendedData: ExtendedAssessmentData = {
    answers,
    result,
    completedAt: new Date().toISOString(),
  };

  // Convert to legacy AssessmentData format for backward compatibility
  const legacyAssessment: AssessmentData = {
    age: result.adjustedLifeExpectancy - lifeEstimate.yearsRemaining,
    gender: answers.gender as "male" | "female",
    province: answers.province as string | undefined,
    smoking: answers.smoking as AssessmentData["smoking"],
    exercise: answers.exercise as AssessmentData["exercise"],
    bmi: answers.bmi_category as AssessmentData["bmi"],
    sleep: answers.sleep as AssessmentData["sleep"],
    stress: answers.stress as AssessmentData["stress"],
    diet: answers.diet as AssessmentData["diet"],
    alcohol: answers.alcohol as AssessmentData["alcohol"],
    socialConnection: answers.social_connection as AssessmentData["socialConnection"],
  };

  // Update user data
  userData.assessment = legacyAssessment;
  userData.extendedAssessment = extendedData;
  userData.lifeEstimate = lifeEstimate;
  userData.birthDate = answers.birth_date as string;
  userData.completedAt = new Date().toISOString();

  saveUserData(userData);

  // Clear the session
  clearAssessmentSession();
}

/**
 * Check if user has completed the extended assessment
 */
export function hasCompletedExtendedAssessment(): boolean {
  const userData = getUserData();
  return !!userData.extendedAssessment?.completedAt;
}
