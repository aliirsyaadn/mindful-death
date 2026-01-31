// ===== CONDITION OPERATORS FOR BRANCHING =====
export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "includes"
  | "not_includes"
  | "exists"
  | "not_exists";

// ===== BRANCH CONDITION =====
export interface BranchCondition {
  questionId: string;
  operator: ConditionOperator;
  value: string | number | boolean | string[];
}

// ===== QUESTION OPTION =====
export interface QuestionOption {
  id: string;
  labelKey: string;
  value: string | number;
  icon?: string;
  descriptionKey?: string;
  image?: string;
}

// ===== QUESTION CONFIG (varies by input type) =====
export interface QuestionConfig {
  // For select types
  options?: QuestionOption[];
  layout?: "vertical" | "horizontal" | "grid";

  // For slider/number types
  min?: number;
  max?: number;
  step?: number;
  unit?: string;

  // For date type
  minYear?: number;
  maxYear?: number;
  format?: string;
  showAge?: boolean;

  // For boolean type
  trueLabel?: string;
  falseLabel?: string;
  style?: "toggle" | "buttons";

  // For text type
  multiline?: boolean;
  maxLength?: number;
  placeholder?: string;

  // For multi-select
  minSelections?: number;
  maxSelections?: number | null;

  // Generic
  showDescription?: boolean;
  showValue?: boolean;
  showMinMax?: boolean;
  showUnit?: boolean;
}

// ===== QUESTION DEFINITION =====
export interface AssessmentQuestion {
  id: string;
  sectionId: string;
  inputType: string;
  labelKey: string;
  descriptionKey?: string;
  required: boolean;
  order: number;
  config: QuestionConfig;
  showIf?: BranchCondition[];
  showIfAny?: BranchCondition[];
}

// ===== SECTION DEFINITION =====
export interface AssessmentSection {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  icon?: string;
  order: number;
  showIf?: BranchCondition[];
  showIfAny?: BranchCondition[];
}

// ===== RESEARCH CITATION =====
export interface ResearchCitation {
  id: string;
  title: string;
  journal: string;
  year: number;
  url?: string;
  doi?: string;
}

// ===== COMPOUND EFFECT =====
export interface CompoundEffect {
  factorId: string;
  multiplier: number;
}

// ===== AGE MODIFIER =====
export interface AgeModifier {
  minAge: number;
  maxAge: number;
  multiplier: number;
}

// ===== ADJUSTMENT FACTOR =====
export interface AdjustmentFactor {
  id: string;
  questionId: string;
  answerValue: string | number | boolean;
  adjustment: number;
  citationIds: string[];
  compoundWith?: CompoundEffect[];
  ageModifier?: AgeModifier[];
}

// ===== ASSESSMENT FLOW CONFIG (loaded from JSON) =====
export interface AssessmentFlowConfig {
  id: string;
  version: string;
  sections: AssessmentSection[];
  questions: AssessmentQuestion[];
}

// ===== FACTORS CONFIG (loaded from JSON) =====
export interface FactorsConfig {
  factors: AdjustmentFactor[];
  citations: ResearchCitation[];
}

// ===== INPUT TYPE DEFINITION =====
export interface InputTypeDefinition {
  type: string;
  component: string;
  defaultConfig: Partial<QuestionConfig>;
  validation: {
    valueType: "string" | "number" | "boolean" | "array";
  };
}

// ===== INPUT TYPES CONFIG (loaded from JSON) =====
export interface InputTypesConfig {
  inputTypes: InputTypeDefinition[];
}

// ===== USER ANSWERS =====
export type AnswerValue = string | number | boolean | string[];

export interface AssessmentAnswers {
  [questionId: string]: AnswerValue;
}

// ===== ASSESSMENT SESSION STATE =====
export interface AssessmentSession {
  flowId: string;
  flowVersion: string;
  currentQuestionId: string | null;
  answers: AssessmentAnswers;
  startedAt: string;
  lastUpdatedAt: string;
  completedAt?: string;
}

// ===== APPLIED FACTOR (for results) =====
export interface AppliedFactor {
  factorId: string;
  questionId: string;
  questionLabel: string;
  answerValue: AnswerValue;
  answerLabel: string;
  baseAdjustment: number;
  finalAdjustment: number;
  citations: ResearchCitation[];
}

// ===== ASSESSMENT RESULT =====
export interface AssessmentResult {
  baseLifeExpectancy: number;
  totalAdjustment: number;
  adjustedLifeExpectancy: number;
  appliedFactors: AppliedFactor[];
  positiveFactors: AppliedFactor[];
  negativeFactors: AppliedFactor[];
  confidence: "low" | "medium" | "high";
  calculatedAt: string;
}

// ===== PROGRESS INFO =====
export interface AssessmentProgress {
  totalQuestions: number;
  answeredQuestions: number;
  percentage: number;
  currentSectionIndex: number;
  totalSections: number;
  currentSection: AssessmentSection | null;
}

// ===== INPUT COMPONENT PROPS =====
export interface InputProps {
  question: AssessmentQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  disabled?: boolean;
}

// ===== EXTENDED USER DATA (for storing results) =====
export interface ExtendedAssessmentData {
  answers: AssessmentAnswers;
  result: AssessmentResult;
  completedAt: string;
}
