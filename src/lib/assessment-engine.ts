import type {
  AssessmentQuestion,
  AssessmentSection,
  AssessmentAnswers,
  BranchCondition,
  AssessmentProgress,
  AnswerValue,
} from "@/types/assessment";
import {
  ASSESSMENT_FLOW,
  getSections,
  getQuestions,
  getQuestionsBySection,
  getSectionById,
} from "./assessment-config";

// ===== CONDITION EVALUATION =====

/**
 * Evaluate a single branch condition against the answers
 */
export function evaluateCondition(
  condition: BranchCondition,
  answers: AssessmentAnswers
): boolean {
  const answer = answers[condition.questionId];

  switch (condition.operator) {
    case "equals":
      return answer === condition.value;

    case "not_equals":
      return answer !== condition.value;

    case "greater_than":
      return typeof answer === "number" && answer > (condition.value as number);

    case "less_than":
      return typeof answer === "number" && answer < (condition.value as number);

    case "includes":
      if (Array.isArray(answer)) {
        return answer.includes(condition.value as string);
      }
      return false;

    case "not_includes":
      if (Array.isArray(answer)) {
        return !answer.includes(condition.value as string);
      }
      return true;

    case "exists":
      return answer !== undefined && answer !== null && answer !== "";

    case "not_exists":
      return answer === undefined || answer === null || answer === "";

    default:
      return false;
  }
}

/**
 * Check if an item (section or question) should be shown based on conditions
 */
export function shouldShowItem(
  item: { showIf?: BranchCondition[]; showIfAny?: BranchCondition[] },
  answers: AssessmentAnswers
): boolean {
  // No conditions = always show
  if (!item.showIf && !item.showIfAny) {
    return true;
  }

  // AND conditions - all must be true
  if (item.showIf && item.showIf.length > 0) {
    const allAndTrue = item.showIf.every((cond) =>
      evaluateCondition(cond, answers)
    );
    if (!allAndTrue) return false;
  }

  // OR conditions - at least one must be true
  if (item.showIfAny && item.showIfAny.length > 0) {
    const anyOrTrue = item.showIfAny.some((cond) =>
      evaluateCondition(cond, answers)
    );
    if (!anyOrTrue) return false;
  }

  return true;
}

// ===== VISIBILITY =====

/**
 * Get all visible sections based on current answers
 */
export function getVisibleSections(
  answers: AssessmentAnswers
): AssessmentSection[] {
  return getSections().filter((section) => shouldShowItem(section, answers));
}

/**
 * Get visible questions for a specific section
 */
export function getVisibleQuestionsForSection(
  sectionId: string,
  answers: AssessmentAnswers
): AssessmentQuestion[] {
  return getQuestionsBySection(sectionId).filter((question) =>
    shouldShowItem(question, answers)
  );
}

/**
 * Get all visible questions as a flat list with their sections
 */
export function getAllVisibleQuestions(
  answers: AssessmentAnswers
): { section: AssessmentSection; question: AssessmentQuestion }[] {
  const result: { section: AssessmentSection; question: AssessmentQuestion }[] =
    [];
  const visibleSections = getVisibleSections(answers);

  for (const section of visibleSections) {
    const questions = getVisibleQuestionsForSection(section.id, answers);
    for (const question of questions) {
      result.push({ section, question });
    }
  }

  return result;
}

// ===== NAVIGATION =====

/**
 * Get the first visible question
 */
export function getFirstQuestion(
  answers: AssessmentAnswers
): { section: AssessmentSection; question: AssessmentQuestion } | null {
  const allVisible = getAllVisibleQuestions(answers);
  return allVisible.length > 0 ? allVisible[0] : null;
}

/**
 * Get the next question after the current one
 */
export function getNextQuestion(
  currentQuestionId: string,
  answers: AssessmentAnswers
): { section: AssessmentSection; question: AssessmentQuestion } | null {
  const allVisible = getAllVisibleQuestions(answers);
  const currentIndex = allVisible.findIndex(
    (item) => item.question.id === currentQuestionId
  );

  if (currentIndex === -1 || currentIndex >= allVisible.length - 1) {
    return null;
  }

  return allVisible[currentIndex + 1];
}

/**
 * Get the previous question before the current one
 */
export function getPreviousQuestion(
  currentQuestionId: string,
  answers: AssessmentAnswers
): { section: AssessmentSection; question: AssessmentQuestion } | null {
  const allVisible = getAllVisibleQuestions(answers);
  const currentIndex = allVisible.findIndex(
    (item) => item.question.id === currentQuestionId
  );

  if (currentIndex <= 0) {
    return null;
  }

  return allVisible[currentIndex - 1];
}

/**
 * Get the first unanswered question (for resuming)
 */
export function getFirstUnansweredQuestion(
  answers: AssessmentAnswers
): { section: AssessmentSection; question: AssessmentQuestion } | null {
  const allVisible = getAllVisibleQuestions(answers);

  const firstUnanswered = allVisible.find(
    ({ question }) =>
      question.required && answers[question.id] === undefined
  );

  return firstUnanswered || null;
}

/**
 * Check if there's a next question
 */
export function hasNextQuestion(
  currentQuestionId: string,
  answers: AssessmentAnswers
): boolean {
  return getNextQuestion(currentQuestionId, answers) !== null;
}

/**
 * Check if there's a previous question
 */
export function hasPreviousQuestion(
  currentQuestionId: string,
  answers: AssessmentAnswers
): boolean {
  return getPreviousQuestion(currentQuestionId, answers) !== null;
}

// ===== VALIDATION =====

/**
 * Validate a single answer against its question
 */
export function validateAnswer(
  question: AssessmentQuestion,
  answer: AnswerValue | undefined
): { valid: boolean; error?: string } {
  // Required check
  if (question.required) {
    if (answer === undefined || answer === null || answer === "") {
      return { valid: false, error: "required" };
    }
    if (Array.isArray(answer) && answer.length === 0) {
      return { valid: false, error: "required" };
    }
  }

  // Skip further validation if no answer
  if (answer === undefined || answer === null) {
    return { valid: true };
  }

  // Type-specific validation
  const config = question.config;

  // Number/slider validation
  if (
    (question.inputType === "number" || question.inputType === "slider") &&
    typeof answer === "number"
  ) {
    if (config.min !== undefined && answer < config.min) {
      return { valid: false, error: "min_value" };
    }
    if (config.max !== undefined && answer > config.max) {
      return { valid: false, error: "max_value" };
    }
  }

  // Multi-select validation
  if (question.inputType === "multi-select" && Array.isArray(answer)) {
    if (
      config.minSelections !== undefined &&
      answer.length < config.minSelections
    ) {
      return { valid: false, error: "min_selections" };
    }
    if (
      config.maxSelections !== undefined &&
      config.maxSelections !== null &&
      answer.length > config.maxSelections
    ) {
      return { valid: false, error: "max_selections" };
    }
  }

  // Text validation
  if (question.inputType === "text" && typeof answer === "string") {
    if (config.maxLength !== undefined && answer.length > config.maxLength) {
      return { valid: false, error: "max_length" };
    }
  }

  return { valid: true };
}

/**
 * Check if can proceed from current question
 */
export function canProceedFromQuestion(
  questionId: string,
  answers: AssessmentAnswers
): boolean {
  const allQuestions = getQuestions();
  const question = allQuestions.find((q) => q.id === questionId);

  if (!question) return false;

  // Check if question is visible
  if (!shouldShowItem(question, answers)) {
    return true; // Can skip hidden questions
  }

  const validation = validateAnswer(question, answers[questionId]);
  return validation.valid;
}

// ===== PROGRESS =====

/**
 * Calculate assessment progress
 */
export function calculateProgress(
  answers: AssessmentAnswers,
  currentQuestionId: string | null
): AssessmentProgress {
  const allVisible = getAllVisibleQuestions(answers);
  const totalQuestions = allVisible.length;

  // Count answered required questions
  const answeredQuestions = allVisible.filter(
    ({ question }) => answers[question.id] !== undefined
  ).length;

  const percentage =
    totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;

  // Find current section
  const visibleSections = getVisibleSections(answers);
  let currentSectionIndex = 0;
  let currentSection: AssessmentSection | null = null;

  if (currentQuestionId) {
    const currentItem = allVisible.find(
      (item) => item.question.id === currentQuestionId
    );
    if (currentItem) {
      currentSection = currentItem.section;
      currentSectionIndex = visibleSections.findIndex(
        (s) => s.id === currentItem.section.id
      );
    }
  }

  return {
    totalQuestions,
    answeredQuestions,
    percentage,
    currentSectionIndex,
    totalSections: visibleSections.length,
    currentSection,
  };
}

// ===== COMPLETION =====

/**
 * Check if assessment is complete (all required questions answered)
 */
export function isAssessmentComplete(answers: AssessmentAnswers): boolean {
  const allVisible = getAllVisibleQuestions(answers);

  return allVisible
    .filter(({ question }) => question.required)
    .every(({ question }) => {
      const validation = validateAnswer(question, answers[question.id]);
      return validation.valid;
    });
}

/**
 * Get all unanswered required questions
 */
export function getUnansweredRequiredQuestions(
  answers: AssessmentAnswers
): AssessmentQuestion[] {
  const allVisible = getAllVisibleQuestions(answers);

  return allVisible
    .filter(({ question }) => question.required)
    .filter(({ question }) => {
      const validation = validateAnswer(question, answers[question.id]);
      return !validation.valid;
    })
    .map(({ question }) => question);
}

/**
 * Get question index in the visible list
 */
export function getQuestionIndex(
  questionId: string,
  answers: AssessmentAnswers
): number {
  const allVisible = getAllVisibleQuestions(answers);
  return allVisible.findIndex((item) => item.question.id === questionId);
}

/**
 * Check if question is the last one
 */
export function isLastQuestion(
  questionId: string,
  answers: AssessmentAnswers
): boolean {
  const allVisible = getAllVisibleQuestions(answers);
  const index = allVisible.findIndex((item) => item.question.id === questionId);
  return index === allVisible.length - 1;
}
