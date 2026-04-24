import { useState, useCallback, useRef } from "react";

export interface UseRadioGroupOptions {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

export interface UseRadioGroupReturn {
  value: string;
  setValue: (value: string) => void;
  isChecked: (value: string) => boolean;
  disabled: boolean;
  required: boolean;
  name: string;
}

export function useRadioGroup(options: UseRadioGroupOptions = {}): UseRadioGroupReturn {
  const {
    defaultValue = "",
    value: controlledValue,
    onChange,
    disabled = false,
    required = false,
    name = "",
  } = options;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  const isChecked = useCallback(
    (checkValue: string) => {
      return value === checkValue;
    },
    [value],
  );

  return {
    value,
    setValue,
    isChecked,
    disabled,
    required,
    name,
  };
}
