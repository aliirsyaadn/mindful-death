"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import type { AssessmentQuestion, AnswerValue } from "@/types/assessment";
import { getInputComponent } from "./inputs";

interface QuestionRendererProps {
  question: AssessmentQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  disabled?: boolean;
  error?: string;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  disabled = false,
  error,
}: QuestionRendererProps) {
  const t = useTranslations();

  // Get the input component from registry
  const InputComponent = getInputComponent(question.inputType);

  if (!InputComponent) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-600">
          Unknown input type: <code>{question.inputType}</code>
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Question Label */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900">
            {t(question.labelKey)}
            {question.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </h2>
          {question.descriptionKey && (
            <p className="text-zinc-600">{t(question.descriptionKey)}</p>
          )}
        </div>

        {/* Input Component */}
        <div className="py-2">
          <InputComponent
            question={question}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
