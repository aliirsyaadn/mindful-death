"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { InputProps } from "@/types/assessment";

export function SingleSelect({ question, value, onChange, disabled }: InputProps) {
  const t = useTranslations();
  const options = question.config.options || [];

  return (
    <div className="grid gap-3">
      {options.map((option, index) => {
        const isSelected = value === option.value;

        return (
          <motion.button
            key={option.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 hover:border-zinc-300 bg-white"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-center gap-3">
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
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0"
                >
                  <Check className="w-4 h-4 text-zinc-900" />
                </motion.div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
