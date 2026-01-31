"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  AssessmentQuestion,
  AssessmentSection,
  AssessmentAnswers,
  AssessmentSession,
  AssessmentResult,
  AnswerValue,
  AssessmentProgress as ProgressType,
} from "@/types/assessment";
import { ASSESSMENT_FLOW } from "@/lib/assessment-config";
import {
  getFirstQuestion,
  getNextQuestion,
  getPreviousQuestion,
  canProceedFromQuestion,
  isAssessmentComplete,
  calculateProgress,
  getAllVisibleQuestions,
  hasPreviousQuestion,
  hasNextQuestion,
  isLastQuestion,
} from "@/lib/assessment-engine";
import {
  calculateAssessmentResult,
  toLifeEstimate,
} from "@/lib/assessment-calculator";
import {
  getAssessmentSession,
  saveAssessmentSession,
  startNewAssessmentSession,
  saveCompletedAssessment,
  clearAssessmentSession,
  getUserData,
} from "@/lib/storage";

// ===== STATE TYPE =====
interface AssessmentState {
  session: AssessmentSession;
  currentQuestion: AssessmentQuestion | null;
  currentSection: AssessmentSection | null;
  progress: ProgressType;
  canGoBack: boolean;
  canGoNext: boolean;
  isComplete: boolean;
  isLastQuestion: boolean;
  result: AssessmentResult | null;
}

// ===== ACTIONS =====
type AssessmentAction =
  | { type: "SET_ANSWER"; questionId: string; answer: AnswerValue }
  | { type: "GO_NEXT" }
  | { type: "GO_BACK" }
  | { type: "GO_TO_QUESTION"; questionId: string }
  | { type: "COMPLETE" }
  | { type: "RESET" };

// ===== CONTEXT TYPE =====
interface AssessmentContextType {
  state: AssessmentState;
  setAnswer: (questionId: string, answer: AnswerValue) => void;
  goNext: () => void;
  goBack: () => void;
  complete: () => void;
  reset: () => void;
  answers: AssessmentAnswers;
}

const AssessmentContext = createContext<AssessmentContextType | null>(null);

// ===== HELPER FUNCTIONS =====
function buildStateFromSession(session: AssessmentSession): AssessmentState {
  const { answers, currentQuestionId } = session;

  // Get all visible questions based on current answers
  const allVisible = getAllVisibleQuestions(answers);

  // Find current question/section
  let currentQuestion: AssessmentQuestion | null = null;
  let currentSection: AssessmentSection | null = null;

  if (currentQuestionId) {
    const current = allVisible.find(
      (item) => item.question.id === currentQuestionId
    );
    if (current) {
      currentQuestion = current.question;
      currentSection = current.section;
    }
  }

  // If no current question, get first one
  if (!currentQuestion && allVisible.length > 0) {
    const first = getFirstQuestion(answers);
    if (first) {
      currentQuestion = first.question;
      currentSection = first.section;
    }
  }

  const progress = calculateProgress(answers, currentQuestion?.id || null);
  const complete = isAssessmentComplete(answers);

  return {
    session,
    currentQuestion,
    currentSection,
    progress,
    canGoBack: currentQuestion
      ? hasPreviousQuestion(currentQuestion.id, answers)
      : false,
    canGoNext: currentQuestion
      ? canProceedFromQuestion(currentQuestion.id, answers)
      : false,
    isComplete: complete,
    isLastQuestion: currentQuestion
      ? isLastQuestion(currentQuestion.id, answers)
      : false,
    result: null,
  };
}

// ===== REDUCER =====
function assessmentReducer(
  state: AssessmentState,
  action: AssessmentAction
): AssessmentState {
  switch (action.type) {
    case "SET_ANSWER": {
      const newAnswers = {
        ...state.session.answers,
        [action.questionId]: action.answer,
      };
      const newSession: AssessmentSession = {
        ...state.session,
        answers: newAnswers,
        lastUpdatedAt: new Date().toISOString(),
      };
      saveAssessmentSession(newSession);

      // Rebuild state with new answers (visibility may change)
      const newState = buildStateFromSession(newSession);

      // Keep current question if it's still visible
      if (
        state.currentQuestion &&
        getAllVisibleQuestions(newAnswers).some(
          (item) => item.question.id === state.currentQuestion!.id
        )
      ) {
        newState.currentQuestion = state.currentQuestion;
        newState.currentSection = state.currentSection;
        newState.canGoNext = canProceedFromQuestion(
          state.currentQuestion.id,
          newAnswers
        );
        newState.canGoBack = hasPreviousQuestion(
          state.currentQuestion.id,
          newAnswers
        );
        newState.isLastQuestion = isLastQuestion(
          state.currentQuestion.id,
          newAnswers
        );
      }

      return newState;
    }

    case "GO_NEXT": {
      if (!state.currentQuestion) return state;

      const next = getNextQuestion(
        state.currentQuestion.id,
        state.session.answers
      );

      if (!next) return state;

      const newSession: AssessmentSession = {
        ...state.session,
        currentQuestionId: next.question.id,
        lastUpdatedAt: new Date().toISOString(),
      };
      saveAssessmentSession(newSession);

      return {
        ...state,
        session: newSession,
        currentQuestion: next.question,
        currentSection: next.section,
        progress: calculateProgress(
          state.session.answers,
          next.question.id
        ),
        canGoBack: true,
        canGoNext: canProceedFromQuestion(
          next.question.id,
          state.session.answers
        ),
        isLastQuestion: isLastQuestion(next.question.id, state.session.answers),
      };
    }

    case "GO_BACK": {
      if (!state.currentQuestion) return state;

      const prev = getPreviousQuestion(
        state.currentQuestion.id,
        state.session.answers
      );

      if (!prev) return state;

      const newSession: AssessmentSession = {
        ...state.session,
        currentQuestionId: prev.question.id,
        lastUpdatedAt: new Date().toISOString(),
      };
      saveAssessmentSession(newSession);

      return {
        ...state,
        session: newSession,
        currentQuestion: prev.question,
        currentSection: prev.section,
        progress: calculateProgress(
          state.session.answers,
          prev.question.id
        ),
        canGoBack: hasPreviousQuestion(prev.question.id, state.session.answers),
        canGoNext: canProceedFromQuestion(
          prev.question.id,
          state.session.answers
        ),
        isLastQuestion: false,
      };
    }

    case "COMPLETE": {
      const result = calculateAssessmentResult(state.session.answers);
      const lifeEstimate = toLifeEstimate(
        result,
        state.session.answers.birth_date as string
      );

      // Save to user data
      saveCompletedAssessment(state.session.answers, result, lifeEstimate);

      return {
        ...state,
        result,
      };
    }

    case "RESET": {
      clearAssessmentSession();
      const newSession = startNewAssessmentSession(
        ASSESSMENT_FLOW.id,
        ASSESSMENT_FLOW.version
      );
      return buildStateFromSession(newSession);
    }

    default:
      return state;
  }
}

// ===== PROVIDER =====
export function AssessmentProvider({ children }: { children: ReactNode }) {
  // Initialize state
  const initState = (): AssessmentState => {
    // Check for existing session
    let session = getAssessmentSession();

    // Start new session if needed
    if (!session || session.flowId !== ASSESSMENT_FLOW.id) {
      session = startNewAssessmentSession(
        ASSESSMENT_FLOW.id,
        ASSESSMENT_FLOW.version
      );
    } else {
      // Pre-fill existing session with user data if missing
      const userData = getUserData();
      let needsUpdate = false;

      if (userData.birthDate && !session.answers.birth_date) {
        session.answers.birth_date = userData.birthDate;
        needsUpdate = true;
      }
      if (userData.assessment?.gender && !session.answers.gender) {
        session.answers.gender = userData.assessment.gender;
        needsUpdate = true;
      }

      if (needsUpdate) {
        saveAssessmentSession(session);
      }
    }

    return buildStateFromSession(session);
  };

  const [state, dispatch] = useReducer(assessmentReducer, null, initState);

  // Actions
  const setAnswer = useCallback(
    (questionId: string, answer: AnswerValue) => {
      dispatch({ type: "SET_ANSWER", questionId, answer });
    },
    []
  );

  const goNext = useCallback(() => {
    dispatch({ type: "GO_NEXT" });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: "GO_BACK" });
  }, []);

  const complete = useCallback(() => {
    dispatch({ type: "COMPLETE" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <AssessmentContext.Provider
      value={{
        state,
        setAnswer,
        goNext,
        goBack,
        complete,
        reset,
        answers: state.session.answers,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

// ===== HOOK =====
export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within AssessmentProvider");
  }
  return context;
}
