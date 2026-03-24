import { useEffect, useRef } from "react";

type UiInputProps = {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

export const UiInput = ({
  value,
  placeholder,
  disabled,
  onChange,
  onBlur,
}: UiInputProps) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current && ref.current.value !== value) {
      ref.current.value = value ?? "";
    }
  }, [value]);

  useEffect(() => {
    if (ref.current) {
      ref.current.placeholder = placeholder ?? "";
      ref.current.disabled = !!disabled;
    }
  }, [placeholder, disabled]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = (e: any) => {
      onChange?.(e.detail);
    };

    const handleBlur = () => {
      onBlur?.();
    };

    el.addEventListener("valueChange", handleChange);
    el.addEventListener("uiBlur", handleBlur);

    return () => {
      el.removeEventListener("valueChange", handleChange);
      el.removeEventListener("uiBlur", handleBlur);
    };
  }, [onChange, onBlur]);

  return <ui-input ref={ref}></ui-input>;
};