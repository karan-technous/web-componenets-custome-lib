import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export type RadioGroupProps = {
  value?: string;
  defaultValue?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  radios?: string;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
};

export const RadioGroup = forwardRef<HTMLElement, RadioGroupProps>(
  (
    {
      value,
      defaultValue,
      name = "",
      disabled = false,
      required = false,
      label,
      size = "md",
      orientation = "vertical",
      radios,
      onChange,
      children,
    },
    forwardedRef,
  ) => {
    const ref = useRef<any>(null);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const currentValue = isControlled ? value : internalValue;

    useImperativeHandle(forwardedRef, () => ref.current);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      
      el.value = currentValue;
      el.name = name;
      el.disabled = !!disabled;
      el.required = !!required;
      el.size = size;
      el.label = label;
      el.orientation = orientation;
      el.radios = radios;
    }, [currentValue, name, disabled, required, label, orientation, size, radios]);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleChange = (e: any) => {
        const nextValue = e.detail as string;
        if (!isControlled) setInternalValue(nextValue);
        onChange?.(nextValue);
      };

      el.addEventListener("uiChange", handleChange);

      return () => {
        el.removeEventListener("uiChange", handleChange);
      };
    }, [isControlled, onChange]);

    return React.createElement(
      "ui-radio-group",
      { ref },
      label ? React.createElement("span", { slot: "label" }, label) : null,
      children
    );
  },
);

RadioGroup.displayName = "RadioGroup";
