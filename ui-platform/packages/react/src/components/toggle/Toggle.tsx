import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

type ToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  onChange?: (checked: boolean) => void;
};

export const Toggle = forwardRef<any, ToggleProps>(
  (
    { checked, defaultChecked = false, disabled, size = "md", onChange },
    forwardedRef,
  ) => {
    const wcRef = useRef<any>(null);

    const isControlled = checked !== undefined;
    const [internal, setInternal] = useState(defaultChecked);

    const value = isControlled ? checked : internal;

    // expose ref
    useImperativeHandle(forwardedRef, () => wcRef.current);

    // sync props → WC
    useEffect(() => {
      const el = wcRef.current;
      if (!el) return;

      el.checked = value;
      el.disabled = !!disabled;
      el.size = size;
    }, [value, disabled, size]);

    // events
    useEffect(() => {
      const el = wcRef.current;
      if (!el) return;

      const handler = (e: any) => {
        const newValue = e.detail;

        if (!isControlled) {
          setInternal(newValue);
        }

        onChange?.(newValue);
      };

      el.addEventListener("toggleChange", handler);

      return () => {
        el.removeEventListener("toggleChange", handler);
      };
    }, [isControlled, onChange]);

    return <ui-toggle ref={wcRef}></ui-toggle>;
  },
);

Toggle.displayName = "Toggle";
