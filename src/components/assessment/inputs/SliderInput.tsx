"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import type { InputProps } from "@/types/assessment";

export function SliderInput({ question, value, onChange, disabled }: InputProps) {
  const config = question.config;
  const min = config.min ?? 0;
  const max = config.max ?? 100;
  const step = config.step ?? 1;
  const unit = config.unit || "";

  // Use internal state for smooth sliding
  const [internalValue, setInternalValue] = useState<number>(
    typeof value === "number" ? value : min
  );

  // Sync with external value
  useEffect(() => {
    if (typeof value === "number") {
      setInternalValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue: number[]) => {
    setInternalValue(newValue[0]);
  };

  const handleValueCommit = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <div className="space-y-6">
      {/* Value display */}
      <div className="text-center">
        <motion.div
          key={internalValue}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-baseline gap-2"
        >
          <span className="text-5xl font-bold text-zinc-900">
            {internalValue}
          </span>
          {unit && <span className="text-xl text-zinc-500">{unit}</span>}
        </motion.div>
      </div>

      {/* Slider */}
      <div className="px-2">
        <Slider
          value={[internalValue]}
          onValueChange={handleValueChange}
          onValueCommit={handleValueCommit}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full"
        />
      </div>

      {/* Min/Max labels */}
      {config.showMinMax !== false && (
        <div className="flex justify-between text-sm text-zinc-500 px-2">
          <span>
            {min} {unit}
          </span>
          <span>
            {max} {unit}
          </span>
        </div>
      )}
    </div>
  );
}
