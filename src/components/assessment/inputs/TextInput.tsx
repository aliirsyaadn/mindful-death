"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import type { InputProps } from "@/types/assessment";

export function TextInput({ question, value, onChange, disabled }: InputProps) {
  const config = question.config;
  const maxLength = config.maxLength;
  const placeholder = config.placeholder || "";
  const multiline = config.multiline || false;

  const [inputValue, setInputValue] = useState<string>(
    typeof value === "string" ? value : ""
  );

  useEffect(() => {
    if (typeof value === "string") {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;

    setInputValue(newValue);
    onChange(newValue);
  };

  if (multiline) {
    return (
      <div className="space-y-2">
        <textarea
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          rows={4}
          className="w-full p-4 rounded-xl border-2 border-zinc-200 bg-white focus:border-zinc-900 focus:outline-none transition-colors resize-none"
        />
        {maxLength && (
          <p className="text-right text-sm text-zinc-500">
            {inputValue.length} / {maxLength}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        type="text"
        value={inputValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className="h-14 text-lg rounded-xl border-2"
      />
      {maxLength && (
        <p className="text-right text-sm text-zinc-500">
          {inputValue.length} / {maxLength}
        </p>
      )}
    </div>
  );
}
