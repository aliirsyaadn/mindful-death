import type {
  AssessmentFlowConfig,
  FactorsConfig,
  InputTypesConfig,
  AssessmentQuestion,
  AssessmentSection,
  AdjustmentFactor,
  ResearchCitation,
} from "@/types/assessment";

// Import JSON configs
import flowConfig from "@/data/assessment/flow.json";
import factorsConfig from "@/data/assessment/factors.json";
import inputTypesConfig from "@/data/assessment/input-types.json";

// ===== TYPED CONFIG EXPORTS =====

export const ASSESSMENT_FLOW: AssessmentFlowConfig = flowConfig as AssessmentFlowConfig;
export const FACTORS_CONFIG: FactorsConfig = factorsConfig as FactorsConfig;
export const INPUT_TYPES_CONFIG: InputTypesConfig = inputTypesConfig as InputTypesConfig;

// ===== HELPER FUNCTIONS =====

/**
 * Get all sections sorted by order
 */
export function getSections(): AssessmentSection[] {
  return [...ASSESSMENT_FLOW.sections].sort((a, b) => a.order - b.order);
}

/**
 * Get a section by ID
 */
export function getSectionById(sectionId: string): AssessmentSection | undefined {
  return ASSESSMENT_FLOW.sections.find((s) => s.id === sectionId);
}

/**
 * Get all questions sorted by section order then question order
 */
export function getQuestions(): AssessmentQuestion[] {
  const sectionOrder = new Map(
    ASSESSMENT_FLOW.sections.map((s) => [s.id, s.order])
  );

  return [...ASSESSMENT_FLOW.questions].sort((a, b) => {
    const sectionOrderA = sectionOrder.get(a.sectionId) ?? 999;
    const sectionOrderB = sectionOrder.get(b.sectionId) ?? 999;

    if (sectionOrderA !== sectionOrderB) {
      return sectionOrderA - sectionOrderB;
    }

    return a.order - b.order;
  });
}

/**
 * Get a question by ID
 */
export function getQuestionById(questionId: string): AssessmentQuestion | undefined {
  return ASSESSMENT_FLOW.questions.find((q) => q.id === questionId);
}

/**
 * Get questions for a specific section
 */
export function getQuestionsBySection(sectionId: string): AssessmentQuestion[] {
  return ASSESSMENT_FLOW.questions
    .filter((q) => q.sectionId === sectionId)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get all adjustment factors
 */
export function getFactors(): AdjustmentFactor[] {
  return FACTORS_CONFIG.factors;
}

/**
 * Get factors for a specific question
 */
export function getFactorsByQuestion(questionId: string): AdjustmentFactor[] {
  return FACTORS_CONFIG.factors.filter((f) => f.questionId === questionId);
}

/**
 * Get a factor by ID
 */
export function getFactorById(factorId: string): AdjustmentFactor | undefined {
  return FACTORS_CONFIG.factors.find((f) => f.id === factorId);
}

/**
 * Get all citations
 */
export function getCitations(): ResearchCitation[] {
  return FACTORS_CONFIG.citations;
}

/**
 * Get a citation by ID
 */
export function getCitationById(citationId: string): ResearchCitation | undefined {
  return FACTORS_CONFIG.citations.find((c) => c.id === citationId);
}

/**
 * Get citations by IDs
 */
export function getCitationsByIds(citationIds: string[]): ResearchCitation[] {
  return FACTORS_CONFIG.citations.filter((c) => citationIds.includes(c.id));
}

/**
 * Get input type definition
 */
export function getInputTypeDefinition(inputType: string) {
  return INPUT_TYPES_CONFIG.inputTypes.find((t) => t.type === inputType);
}

/**
 * Get merged config for a question (question config + default input type config)
 */
export function getMergedQuestionConfig(question: AssessmentQuestion) {
  const inputTypeDef = getInputTypeDefinition(question.inputType);
  const defaultConfig = inputTypeDef?.defaultConfig ?? {};

  return {
    ...defaultConfig,
    ...question.config,
  };
}

/**
 * Validate the flow config (useful for debugging)
 */
export function validateFlowConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check all questions reference valid sections
  const sectionIds = new Set(ASSESSMENT_FLOW.sections.map((s) => s.id));
  for (const question of ASSESSMENT_FLOW.questions) {
    if (!sectionIds.has(question.sectionId)) {
      errors.push(
        `Question "${question.id}" references non-existent section "${question.sectionId}"`
      );
    }
  }

  // Check all showIf conditions reference valid questions
  const questionIds = new Set(ASSESSMENT_FLOW.questions.map((q) => q.id));

  for (const section of ASSESSMENT_FLOW.sections) {
    if (section.showIf) {
      for (const condition of section.showIf) {
        if (!questionIds.has(condition.questionId)) {
          errors.push(
            `Section "${section.id}" showIf references non-existent question "${condition.questionId}"`
          );
        }
      }
    }
    if (section.showIfAny) {
      for (const condition of section.showIfAny) {
        if (!questionIds.has(condition.questionId)) {
          errors.push(
            `Section "${section.id}" showIfAny references non-existent question "${condition.questionId}"`
          );
        }
      }
    }
  }

  for (const question of ASSESSMENT_FLOW.questions) {
    if (question.showIf) {
      for (const condition of question.showIf) {
        if (!questionIds.has(condition.questionId)) {
          errors.push(
            `Question "${question.id}" showIf references non-existent question "${condition.questionId}"`
          );
        }
      }
    }
    if (question.showIfAny) {
      for (const condition of question.showIfAny) {
        if (!questionIds.has(condition.questionId)) {
          errors.push(
            `Question "${question.id}" showIfAny references non-existent question "${condition.questionId}"`
          );
        }
      }
    }
  }

  // Check all factors reference valid questions
  for (const factor of FACTORS_CONFIG.factors) {
    if (!questionIds.has(factor.questionId)) {
      errors.push(
        `Factor "${factor.id}" references non-existent question "${factor.questionId}"`
      );
    }
  }

  // Check all factor citations exist
  const citationIds = new Set(FACTORS_CONFIG.citations.map((c) => c.id));
  for (const factor of FACTORS_CONFIG.factors) {
    for (const citationId of factor.citationIds) {
      if (!citationIds.has(citationId)) {
        errors.push(
          `Factor "${factor.id}" references non-existent citation "${citationId}"`
        );
      }
    }
  }

  // Check compound effects reference valid factors
  const factorIds = new Set(FACTORS_CONFIG.factors.map((f) => f.id));
  for (const factor of FACTORS_CONFIG.factors) {
    if (factor.compoundWith) {
      for (const compound of factor.compoundWith) {
        if (!factorIds.has(compound.factorId)) {
          errors.push(
            `Factor "${factor.id}" compoundWith references non-existent factor "${compound.factorId}"`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
