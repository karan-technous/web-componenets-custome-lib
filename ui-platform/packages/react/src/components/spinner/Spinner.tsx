import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

// === TYPES ===

export type SpinnerVariant = 'circular' | 'dots' | 'bars' | 'pulse' | 'ring';
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerSpeed = 'slow' | 'normal' | 'fast';

export interface UiSpinnerProps {
  /** Animation variant style */
  variant?: SpinnerVariant;

  /** Size of the spinner */
  size?: SpinnerSize | number;

  /** Animation speed */
  speed?: SpinnerSpeed | number;

  /** Primary color for the spinner */
  color?: string;

  /** Background/track color */
  trackColor?: string;

  /** Whether the spinner is visible */
  loading?: boolean;

  /** Display as fullscreen/container overlay */
  overlay?: boolean;

  /** Display inline with text (no flex center) */
  inline?: boolean;

  /** Center the spinner in its container */
  center?: boolean;

  /** Primary label text (e.g., "Loading...") */
  label?: string;

  /** Secondary label text (e.g., "Please wait") */
  subLabel?: string;

  /** Shown event handler */
  onShown?: () => void;

  /** Hidden event handler */
  onHidden?: () => void;

  /** Additional CSS classes */
  className?: string;

  /** HTML data attributes */
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export interface UiSpinnerRef {
  /** Reference to the underlying ui-spinner element */
  readonly element: HTMLElement | null;
}

// === COMPONENT ===

/**
 * React Spinner Component
 * Modern wrapper around ui-spinner web component
 *
 * @example
 * ```tsx
 * <UiSpinner
 *   variant="circular"
 *   size="md"
 *   loading={true}
 *   label="Loading..."
 * />
 * ```
 */
export const UiSpinner = forwardRef<UiSpinnerRef, UiSpinnerProps>(
  (
    {
      variant = 'circular',
      size = 'md',
      speed = 'normal',
      color,
      trackColor,
      loading = true,
      overlay = false,
      inline = false,
      center = false,
      label,
      subLabel,
      onShown,
      onHidden,
      className,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLElement>(null);

    // Expose imperative handle
    useImperativeHandle(ref, () => ({
      get element() {
        return innerRef.current;
      },
    }));

    // Sync props to web component
    useEffect(() => {
      const el = innerRef.current as (HTMLElement & {
        variant?: SpinnerVariant;
        size?: SpinnerSize | number;
        speed?: SpinnerSpeed | number;
        color?: string;
        trackColor?: string;
        loading?: boolean;
        overlay?: boolean;
        inline?: boolean;
        center?: boolean;
        label?: string;
        subLabel?: string;
      }) | null;
      if (!el) return;

      el.variant = variant;
      el.size = size;
      el.speed = speed;
      if (color !== undefined) el.color = color;
      if (trackColor !== undefined) el.trackColor = trackColor;
      el.loading = loading;
      el.overlay = overlay;
      el.inline = inline;
      el.center = center;
      if (label !== undefined) el.label = label;
      if (subLabel !== undefined) el.subLabel = subLabel;
    }, [variant, size, speed, color, trackColor, loading, overlay, inline, center, label, subLabel]);

    // Event handlers
    const handleShown = useCallback(() => {
      onShown?.();
    }, [onShown]);

    const handleHidden = useCallback(() => {
      onHidden?.();
    }, [onHidden]);

    // Bind event listeners
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      el.addEventListener("shown", handleShown);
      el.addEventListener("hidden", handleHidden);

      return () => {
        el.removeEventListener("shown", handleShown);
        el.removeEventListener("hidden", handleHidden);
      };
    }, [handleShown, handleHidden]);

    return (
      <ui-spinner
        ref={innerRef}
        className={className}
        {...rest}
      />
    );
  },
);

UiSpinner.displayName = "UiSpinner";
