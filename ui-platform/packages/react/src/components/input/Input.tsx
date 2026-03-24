import React, { useEffect, useRef } from "react";

type UiInputProps = {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

export const UiInput = React.memo(
  ({ value, placeholder, disabled, onChange, onBlur }: UiInputProps) => {
    const ref = useRef<any>(null);

    // Stable refs
    const onChangeRef = useRef(onChange);
    const onBlurRef = useRef(onBlur);

    useEffect(() => {
      onChangeRef.current = onChange;
      onBlurRef.current = onBlur;
    });

    // Set properties (no re-render)
    useEffect(() => {
      if (!ref.current) return;

      ref.current.value = value ?? "";
      ref.current.placeholder = placeholder ?? "";
      ref.current.disabled = !!disabled;
    }, [value, placeholder, disabled]);

    // Attach listeners ONCE
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleChange = (e: any) => {
        onChangeRef.current?.(e.detail);
      };

      const handleBlur = () => {
        onBlurRef.current?.();
      };

      el.addEventListener("valueChange", handleChange);
      el.addEventListener("uiBlur", handleBlur);

      return () => {
        el.removeEventListener("valueChange", handleChange);
        el.removeEventListener("uiBlur", handleBlur);
      };
    }, []);

    return <ui-input ref={ref}></ui-input>;
  },
);
