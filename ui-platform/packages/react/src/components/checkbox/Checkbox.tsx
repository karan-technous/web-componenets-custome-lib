import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type UiCheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  children?: React.ReactNode;
};

export const UiCheckbox = forwardRef<HTMLElement, UiCheckboxProps>(
  (
    {
      checked,
      defaultChecked = false,
      disabled = false,
      size = "md",
      label,
      onChange,
      onBlur,
      children,
    },
    forwardedRef,
  ) => {
    const ref = useRef<any>(null);

    // Controlled vs uncontrolled
    const controlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const currentValue = controlled ? checked : internalChecked;

    // Stable refs for events
    const onChangeRef = useRef(onChange);
    const onBlurRef = useRef(onBlur);

    useEffect(() => {
      onChangeRef.current = onChange;
      onBlurRef.current = onBlur;
    }, [onChange, onBlur]);

    // Sync props → web component
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      el.checked = !!currentValue;
      el.disabled = !!disabled;
      el.size = size;
      el.label = label || "";
    }, [currentValue, disabled, size, label]);

    // Event normalization
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleChange = (event: any) => {
        const next = !!event.detail;

        if (!controlled) {
          setInternalChecked(next);
        }

        onChangeRef.current?.(next);
      };

      const handleBlur = () => {
        onBlurRef.current?.();
      };

      el.addEventListener("onChange", handleChange);
      el.addEventListener("onBlur", handleBlur);

      return () => {
        el.removeEventListener("onChange", handleChange);
        el.removeEventListener("onBlur", handleBlur);
      };
    }, [controlled]);

    // Forward ref
    useImperativeHandle(forwardedRef, () => ref.current, []);

    return <ui-checkbox ref={ref}>{children}</ui-checkbox>;
  },
);

UiCheckbox.displayName = "UiCheckbox";
