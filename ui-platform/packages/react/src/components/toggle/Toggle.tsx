import React, { useEffect, useRef, useState, forwardRef } from "react";

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
    ref,
  ) => {
    const wcRef = useRef<any>(null);

    const isControlled = checked !== undefined;

    const [internal, setInternal] = useState(defaultChecked);

    const value = isControlled ? checked : internal;

    // React → Web Component (IMPORTANT)
    useEffect(() => {
      const el = wcRef.current;
      if (!el) return;

      el.checked = value;
      el.disabled = disabled;
      el.size = size;
    }, [value, disabled, size]);

    // Web Component → React
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
      return () => el.removeEventListener("toggleChange", handler);
    }, [isControlled, onChange]);

    return <ui-toggle ref={wcRef}></ui-toggle>;
  },
);
