"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { InputProps } from "@/types/assessment";

export function BooleanToggle({ question, value, onChange, disabled }: InputProps) {
  const t = useTranslations();
  const config = question.config;

  const trueLabel = config.trueLabel ? t(config.trueLabel) : "Ya";
  const falseLabel = config.falseLabel ? t(config.falseLabel) : "Tidak";

  const options = [
    { value: true, label: trueLabel, icon: Check },
    { value: false, label: falseLabel, icon: X },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => {
        const isSelected = value === option.value;
        const Icon = option.icon;

        return (
          <motion.button
            key={String(option.value)}
            type="button"
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`relative p-6 rounded-xl border-2 transition-all ${
              isSelected
                ? option.value
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-red-500 bg-red-50 text-red-700"
                : "border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSelected
                    ? option.value
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-zinc-100 text-zinc-400"
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="font-semibold text-lg">{option.label}</span>
            </div>

            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center ${
                  option.value ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
