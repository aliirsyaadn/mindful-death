"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { InputProps } from "@/types/assessment";

export function NumberInput({ question, value, onChange, disabled }: InputProps) {
  const config = question.config;
  const min = config.min;
  const max = config.max;
  const step = config.step ?? 1;
  const unit = config.unit || "";

  const [inputValue, setInputValue] = useState<string>(
    value !== undefined ? String(value) : ""
  );

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(String(value));
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      if (min !== undefined && numValue < min) return;
      if (max !== undefined && numValue > max) return;
      onChange(numValue);
    }
  };

  const handleIncrement = () => {
    const currentValue = typeof value === "number" ? value : 0;
    const newValue = currentValue + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const currentValue = typeof value === "number" ? value : 0;
    const newValue = currentValue - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={disabled || (min !== undefined && (value as number) <= min)}
          className="h-12 w-12 rounded-full"
        >
          <Minus className="h-5 w-5" />
        </Button>

        <div className="relative">
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className="w-32 h-16 text-center text-3xl font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {unit}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && (value as number) >= max)}
          className="h-12 w-12 rounded-full"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {(min !== undefined || max !== undefined) && (
        <p className="text-center text-sm text-zinc-500">
          {min !== undefined && max !== undefined
            ? `${min} - ${max} ${unit}`
            : min !== undefined
            ? `Min: ${min} ${unit}`
            : `Max: ${max} ${unit}`}
        </p>
      )}
    </div>
  );
}
