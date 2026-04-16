import { useState, useCallback } from "react";
import type {
  ButtonGroupSelectionMode,
  ButtonGroupEventDetail,
} from "@karan9186/core";
import { isButtonSelected, computeNewSelectedValue } from "@karan9186/core";

// === TYPES ===

export interface UseButtonGroupOptions {
  /** Selection mode for the group */
  selectionMode?: ButtonGroupSelectionMode;
  
  /** Default value for uncontrolled mode */
  defaultValue?: string | string[] | null;
  
  /** Controlled value (if provided) */
  value?: string | string[] | null;
  
  /** Callback when value changes */
  onChange?: (value: string | string[]) => void;
}

export interface UseButtonGroupReturn {
  /** Current selected value(s) */
  value: string | string[] | null;
  
  /** Function to update the selected value */
  setValue: (value: string | string[]) => void;
  
  /** Function to handle button click */
  handleButtonClick: (buttonValue: string) => void;
  
  /** Function to check if a button is selected */
  isSelected: (buttonValue: string) => boolean;
  
  /** Selection mode */
  selectionMode: ButtonGroupSelectionMode;
}

// === HOOK ===

/**
 * React hook for ButtonGroup functionality
 * Handles selection state, toggle logic, and controlled/uncontrolled sync
 *
 * @example
 * ```tsx
 * const { value, handleButtonClick, isSelected } = useButtonGroup({
 *   selectionMode: 'single',
 *   defaultValue: 'option1',
 *   onChange: (value) => console.log('Selected:', value)
 * });
 * ```
 */
export function useButtonGroup(options: UseButtonGroupOptions = {}): UseButtonGroupReturn {
  const {
    selectionMode = "none",
    defaultValue = null,
    value: controlledValue,
    onChange,
  } = options;

  // Determine if controlled or uncontrolled
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | string[] | null>(defaultValue);

  const effectiveValue = isControlled ? controlledValue : internalValue;

  // Update value function
  const setValue = useCallback(
    (newValue: string | string[]) => {
      if (isControlled) {
        onChange?.(newValue);
      } else {
        setInternalValue(newValue);
        onChange?.(newValue);
      }
    },
    [isControlled, onChange],
  );

  // Handle button click
  const handleButtonClick = useCallback(
    (buttonValue: string) => {
      if (selectionMode === "none") {
        return;
      }

      const newSelected = computeNewSelectedValue(buttonValue, effectiveValue, selectionMode);
      setValue(newSelected);
    },
    [selectionMode, effectiveValue, setValue],
  );

  // Check if button is selected
  const isSelected = useCallback(
    (buttonValue: string): boolean => {
      return isButtonSelected(buttonValue, effectiveValue, selectionMode);
    },
    [effectiveValue, selectionMode],
  );

  return {
    value: effectiveValue,
    setValue,
    handleButtonClick,
    isSelected,
    selectionMode,
  };
}
