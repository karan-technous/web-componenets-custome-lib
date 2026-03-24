import { useEffect, useRef } from "react";

type Props = {
  children?: any;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
};

export const UiButton = ({
  children,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  fullWidth,
  onClick,
}: Props) => {
  const ref = useRef<any>(null);

  // Sync props
  useEffect(() => {
    if (!ref.current) return;

    ref.current.variant = variant;
    ref.current.size = size;
    ref.current.disabled = !!disabled;
    ref.current.loading = !!loading;
    ref.current.fullWidth = !!fullWidth;
  }, [variant, size, disabled, loading, fullWidth]);

  // Events
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = () => onClick?.();

    el.addEventListener("clicked", handler);
    return () => el.removeEventListener("clicked", handler);
  }, [onClick]);

  return <ui-button ref={ref}>{children}</ui-button>;
};