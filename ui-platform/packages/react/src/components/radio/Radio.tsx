import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type RadioProps = {
  value: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  supportingText?: string;
  uiChange?: (value: string) => void;
  uiFocus?: () => void;
  uiBlur?: () => void;
  children?: React.ReactNode;
};

export const Radio = forwardRef<HTMLElement, RadioProps>(
  (
    {
      value,
      checked,
      disabled = false,
      required = false,
      name,
      size = 'md',
      error = false,
      label,
      supportingText,
      uiChange,
      uiFocus,
      uiBlur,
      children,
    },
    forwardedRef,
  ) => {
    const ref = useRef<any>(null);

    useImperativeHandle(forwardedRef, () => ref.current);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      
      el.value = value;
      el.checked = !!checked;
      el.disabled = !!disabled;
      el.required = !!required;
      el.size = size;
      el.name = name;
      el.error = !!error;
      el.label = label;
      el.supportingText = supportingText;
    }, [value, checked, disabled, required, name, error, size, label, supportingText]);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleChange = (e: any) => uiChange?.(e.detail as string);
      const handleFocus = () => uiFocus?.();
      const handleBlur = () => uiBlur?.();

      el.addEventListener("uiChange", handleChange);
      el.addEventListener("uiFocus", handleFocus);
      el.addEventListener("uiBlur", handleBlur);

      return () => {
        el.removeEventListener("uiChange", handleChange);
        el.removeEventListener("uiFocus", handleFocus);
        el.removeEventListener("uiBlur", handleBlur);
      };
    }, [uiChange, uiFocus, uiBlur]);

    return React.createElement(
      "ui-radio",
      { ref },
      label ? React.createElement("span", { slot: "label" }, label) : null,
      supportingText ? React.createElement("span", { slot: "supporting" }, supportingText) : null,
      children
    );
  },
);

Radio.displayName = "Radio";
