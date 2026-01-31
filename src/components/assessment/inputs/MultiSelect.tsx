"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { InputProps } from "@/types/assessment";

export function MultiSelect({ question, value, onChange, disabled }: InputProps) {
  const t = useTranslations();
  const options = question.config.options || [];
  const selectedValues = (value as string[]) || [];

  const handleToggle = (optionValue: string) => {
    if (disabled) return;

    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];

    onChange(newValues);
  };

  return (
    <div className="grid gap-3">
      {options.map((option, index) => {
        const isSelected = selectedValues.includes(option.value as string);

        return (
          <motion.button
            key={option.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            disabled={disabled}
            onClick={() => handleToggle(option.value as string)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 hover:border-zinc-300 bg-white"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? "bg-white border-white"
                    : "border-zinc-300 bg-transparent"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-zinc-900" />}
              </div>
              {option.icon && (
                <span className="text-xl flex-shrink-0">{option.icon}</span>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{t(option.labelKey)}</p>
                {option.descriptionKey && (
                  <p
                    className={`text-sm mt-1 ${
                      isSelected ? "text-zinc-300" : "text-zinc-500"
                    }`}
                  >
                    {t(option.descriptionKey)}
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
