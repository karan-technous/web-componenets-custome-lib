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
  rounded?: "xs" | "sm" | "md" | "xl";
  icon?: string;
  iconAriaLabel?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onIconClick?: () => void;
};

export const UiInput = forwardRef<HTMLElement, UiInputProps>(
  (
    {
      value,
      defaultValue = "",
      placeholder,
      disabled,
      type = "text",
      rounded = "md",
      icon,
      iconAriaLabel,
      onChange,
      onBlur,
      onIconClick,
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
    const onIconClickRef = useRef(onIconClick);

    useEffect(() => {
      onChangeRef.current = onChange;
      onBlurRef.current = onBlur;
      onIconClickRef.current = onIconClick;
    });

    // Sync props → Web Component
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      el.value = currentValue ?? "";
      el.placeholder = placeholder ?? "";
      el.disabled = !!disabled;
      el.type = type;
      el.rounded = rounded;
      el.icon = icon;
      el.iconAriaLabel = iconAriaLabel ?? "Input icon action";
    }, [currentValue, placeholder, disabled, type, rounded, icon, iconAriaLabel]);

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

      const handleIconClick = () => {
        onIconClickRef.current?.();
      };

      el.addEventListener("valueChange", handleChange);
      el.addEventListener("uiBlur", handleBlur);
      el.addEventListener("uiIconClick", handleIconClick);

      return () => {
        el.removeEventListener("valueChange", handleChange);
        el.removeEventListener("uiBlur", handleBlur);
        el.removeEventListener("uiIconClick", handleIconClick);
      };
    }, [isControlled]);

    useImperativeHandle(forwardedRef, () => ref.current);

    return <ui-input ref={ref}></ui-input>;
  },
);

UiInput.displayName = "UiInput";
