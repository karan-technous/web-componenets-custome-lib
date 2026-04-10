import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type Props = {
  children?: any;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
};

export const UiButton = forwardRef<any, Props>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      disabled,
      loading,
      fullWidth,
      onClick,
    },
    ref,
  ) => {
    const innerRef = useRef<any>(null);

    // expose ref
    useImperativeHandle(ref, () => innerRef.current);

    // sync props
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      el.variant = variant;
      el.size = size;
      el.disabled = !!disabled;
      el.loading = !!loading;
      el.fullWidth = !!fullWidth;
    }, [variant, size, disabled, loading, fullWidth]);

    // event binding (standardized)
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      const handler = () => onClick?.();

      el.addEventListener("uiClick", handler);
      return () => el.removeEventListener("uiClick", handler);
    }, [onClick]);

    return <ui-button ref={innerRef}>{children}</ui-button>;
  },
);
