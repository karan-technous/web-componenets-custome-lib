import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";

type UiInputProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "number";
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

export const UiInput = forwardRef<HTMLElement, UiInputProps>(
  (
    {
      value,
      defaultValue = "",
      placeholder,
      disabled,
      type = "text",
      onChange,
      onBlur,
    },
    forwardedRef,
  ) => {
    const ref = useRef<any>(null);

    // Controlled vs uncontrolled
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);

    const currentValue = isControlled ? value : internalValue;

    // Stable refs
    const onChangeRef = useRef(onChange);
    const onBlurRef = useRef(onBlur);

    useEffect(() => {
      onChangeRef.current = onChange;
      onBlurRef.current = onBlur;
    });

    // Sync props → Web Component
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      el.value = currentValue ?? "";
      el.placeholder = placeholder ?? "";
      el.disabled = !!disabled;
      el.type = type;
    }, [currentValue, placeholder, disabled, type]);

    // Events
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleChange = (e: any) => {
        const val = e.detail;

        if (!isControlled) {
          setInternalValue(val);
        }

        onChangeRef.current?.(val);
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
    }, [isControlled]);

    useImperativeHandle(forwardedRef, () => ref.current);

    return <ui-input ref={ref}></ui-input>;
  },
);

UiInput.displayName = "UiInput";
