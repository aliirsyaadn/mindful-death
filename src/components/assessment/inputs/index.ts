import type { ComponentType } from "react";
import type { InputProps } from "@/types/assessment";

// Import all input components
import { SingleSelect } from "./SingleSelect";
import { MultiSelect } from "./MultiSelect";
import { SliderInput } from "./SliderInput";
import { NumberInput } from "./NumberInput";
import { DateInput } from "./DateInput";
import { BooleanToggle } from "./BooleanToggle";
import { TextInput } from "./TextInput";

// Input component registry
// Maps input type strings from JSON config to React components
export const INPUT_REGISTRY: Record<string, ComponentType<InputProps>> = {
  "single-select": SingleSelect,
  "multi-select": MultiSelect,
  slider: SliderInput,
  number: NumberInput,
  date: DateInput,
  boolean: BooleanToggle,
  text: TextInput,
};

/**
 * Get input component by type
 * Returns null if type not found
 */
export function getInputComponent(
  inputType: string
): ComponentType<InputProps> | null {
  return INPUT_REGISTRY[inputType] || null;
}

/**
 * Check if input type is registered
 */
export function isInputTypeRegistered(inputType: string): boolean {
  return inputType in INPUT_REGISTRY;
}

/**
 * Register a new input type
 * Use this to add custom input types dynamically
 */
export function registerInputType(
  inputType: string,
  component: ComponentType<InputProps>
): void {
  INPUT_REGISTRY[inputType] = component;
}

// Re-export all components for direct import
export { SingleSelect } from "./SingleSelect";
export { MultiSelect } from "./MultiSelect";
export { SliderInput } from "./SliderInput";
export { NumberInput } from "./NumberInput";
export { DateInput } from "./DateInput";
export { BooleanToggle } from "./BooleanToggle";
export { TextInput } from "./TextInput";
