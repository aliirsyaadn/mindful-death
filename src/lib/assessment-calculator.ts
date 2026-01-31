import type {
  AssessmentAnswers,
  AssessmentResult,
  AppliedFactor,
  AdjustmentFactor,
  AnswerValue,
} from "@/types/assessment";
import type { LifeEstimate } from "@/types";
import {
  FACTORS_CONFIG,
  getFactors,
  getCitationsByIds,
  getQuestionById,
} from "./assessment-config";
import {
  INDONESIA_LIFE_EXPECTANCY,
  LIFE_EXPECTANCY_BY_PROVINCE,
} from "./research-data";

// ===== HELPER FUNCTIONS =====

/**
 * Calculate age from birth date string
 */
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * Get base life expectancy based on gender and province
 */
function getBaseLifeExpectancy(
  gender: "male" | "female",
  province?: string
): number {
  // Start with gender-based life expectancy
  let baseLE =
    gender === "female"
      ? INDONESIA_LIFE_EXPECTANCY.female
      : INDONESIA_LIFE_EXPECTANCY.male;

  // Blend with provincial data if available
  if (province && province !== "other") {
    const provinceData = LIFE_EXPECTANCY_BY_PROVINCE.find(
      (p) => p.province === province
    );
    if (provinceData) {
      // Average between gender base and province average
      baseLE = (baseLE + provinceData.lifeExpectancy) / 2;
    }
  }

  return baseLE;
}

/**
 * Check if a factor matches an answer
 */
function doesFactorMatchAnswer(
  factor: AdjustmentFactor,
  answer: AnswerValue | undefined
): boolean {
  if (answer === undefined || answer === null) {
    return false;
  }

  // Direct value match
  if (answer === factor.answerValue) {
    return true;
  }

  // Multi-select contains value
  if (Array.isArray(answer) && answer.includes(factor.answerValue as string)) {
    return true;
  }

  return false;
}

/**
 * Get all factors that match the current answers
 */
function getMatchingFactors(answers: AssessmentAnswers): AdjustmentFactor[] {
  return getFactors().filter((factor) => {
    const answer = answers[factor.questionId];
    return doesFactorMatchAnswer(factor, answer);
  });
}

/**
 * Apply age modifier to a factor's adjustment
 */
function applyAgeModifier(
  factor: AdjustmentFactor,
  baseAdjustment: number,
  age: number
): number {
  if (!factor.ageModifier || factor.ageModifier.length === 0) {
    return baseAdjustment;
  }

  const modifier = factor.ageModifier.find(
    (m) => age >= m.minAge && age <= m.maxAge
  );

  if (modifier) {
    return baseAdjustment * modifier.multiplier;
  }

  return baseAdjustment;
}

/**
 * Apply compound effects between factors
 */
function applyCompoundEffects(
  factors: AdjustmentFactor[],
  factorAdjustments: Map<string, number>
): Map<string, number> {
  const result = new Map(factorAdjustments);
  const factorIds = new Set(factors.map((f) => f.id));

  for (const factor of factors) {
    if (factor.compoundWith && factor.compoundWith.length > 0) {
      for (const compound of factor.compoundWith) {
        // Check if the compound factor is also present
        if (factorIds.has(compound.factorId)) {
          // Apply multiplier to this factor's adjustment
          const currentAdjustment = result.get(factor.id) || 0;
          result.set(factor.id, currentAdjustment * compound.multiplier);
        }
      }
    }
  }

  return result;
}

/**
 * Get label for an answer value
 */
function getAnswerLabel(questionId: string, answer: AnswerValue): string {
  const question = getQuestionById(questionId);
  if (!question) return String(answer);

  if (question.config.options) {
    const option = question.config.options.find((o) => {
      if (Array.isArray(answer)) {
        return answer.includes(o.value as string);
      }
      return o.value === answer;
    });
    if (option) {
      return option.labelKey; // Will be translated by UI
    }
  }

  return String(answer);
}

// ===== MAIN CALCULATION =====

/**
 * Calculate assessment result from answers
 */
export function calculateAssessmentResult(
  answers: AssessmentAnswers
): AssessmentResult {
  // Extract basic info
  const gender = answers.gender as "male" | "female";
  const birthDate = answers.birth_date as string;
  const province = answers.province as string | undefined;
  const age = calculateAge(birthDate);

  // Get base life expectancy
  const baseLifeExpectancy = getBaseLifeExpectancy(gender, province);

  // Get all matching factors
  const matchingFactors = getMatchingFactors(answers);

  // Calculate individual adjustments with age modifiers
  const factorAdjustments = new Map<string, number>();
  for (const factor of matchingFactors) {
    const adjusted = applyAgeModifier(factor, factor.adjustment, age);
    factorAdjustments.set(factor.id, adjusted);
  }

  // Apply compound effects
  const finalAdjustments = applyCompoundEffects(
    matchingFactors,
    factorAdjustments
  );

  // Build applied factors list
  const appliedFactors: AppliedFactor[] = matchingFactors.map((factor) => {
    const question = getQuestionById(factor.questionId);
    const finalAdjustment = finalAdjustments.get(factor.id) || factor.adjustment;

    return {
      factorId: factor.id,
      questionId: factor.questionId,
      questionLabel: question?.labelKey || factor.questionId,
      answerValue: answers[factor.questionId],
      answerLabel: getAnswerLabel(factor.questionId, answers[factor.questionId]),
      baseAdjustment: factor.adjustment,
      finalAdjustment,
      citations: getCitationsByIds(factor.citationIds),
    };
  });

  // Separate positive and negative factors
  const positiveFactors = appliedFactors.filter((f) => f.finalAdjustment > 0);
  const negativeFactors = appliedFactors.filter((f) => f.finalAdjustment < 0);

  // Sum all adjustments
  let totalAdjustment = 0;
  for (const adjustment of finalAdjustments.values()) {
    totalAdjustment += adjustment;
  }

  // Calculate final life expectancy
  const adjustedLifeExpectancy = Math.max(
    age + 1, // Minimum: current age + 1
    Math.round((baseLifeExpectancy + totalAdjustment) * 10) / 10 // Round to 1 decimal
  );

  // Calculate confidence based on questions answered
  const totalFactorQuestions = new Set(
    FACTORS_CONFIG.factors.map((f) => f.questionId)
  ).size;
  const answeredFactorQuestions = new Set(
    matchingFactors.map((f) => f.questionId)
  ).size;
  const answerRatio = answeredFactorQuestions / totalFactorQuestions;

  let confidence: "low" | "medium" | "high" = "low";
  if (answerRatio >= 0.7) confidence = "high";
  else if (answerRatio >= 0.4) confidence = "medium";

  return {
    baseLifeExpectancy,
    totalAdjustment: Math.round(totalAdjustment * 10) / 10,
    adjustedLifeExpectancy,
    appliedFactors,
    positiveFactors,
    negativeFactors,
    confidence,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Convert AssessmentResult to the existing LifeEstimate format for backward compatibility
 */
export function toLifeEstimate(
  result: AssessmentResult,
  birthDate: string
): LifeEstimate {
  const DAYS_PER_YEAR = 365.25;
  const age = calculateAge(birthDate);

  const yearsRemaining = Math.max(0, result.adjustedLifeExpectancy - age);
  const daysRemaining = Math.round(yearsRemaining * DAYS_PER_YEAR);
  const daysLived = Math.round(age * DAYS_PER_YEAR);
  const totalDays = Math.round(result.adjustedLifeExpectancy * DAYS_PER_YEAR);

  return {
    lifeExpectancy: result.adjustedLifeExpectancy,
    yearsRemaining,
    daysRemaining,
    daysLived,
    totalDays,
    adjustmentApplied: result.totalAdjustment,
  };
}

/**
 * Get a summary of factors impact
 */
export function getFactorsSummary(result: AssessmentResult): {
  totalPositive: number;
  totalNegative: number;
  biggestPositive: AppliedFactor | null;
  biggestNegative: AppliedFactor | null;
} {
  const totalPositive = result.positiveFactors.reduce(
    (sum, f) => sum + f.finalAdjustment,
    0
  );
  const totalNegative = result.negativeFactors.reduce(
    (sum, f) => sum + f.finalAdjustment,
    0
  );

  const biggestPositive =
    result.positiveFactors.length > 0
      ? result.positiveFactors.reduce((max, f) =>
          f.finalAdjustment > max.finalAdjustment ? f : max
        )
      : null;

  const biggestNegative =
    result.negativeFactors.length > 0
      ? result.negativeFactors.reduce((min, f) =>
          f.finalAdjustment < min.finalAdjustment ? f : min
        )
      : null;

  return {
    totalPositive: Math.round(totalPositive * 10) / 10,
    totalNegative: Math.round(totalNegative * 10) / 10,
    biggestPositive,
    biggestNegative,
  };
}
