import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type {
  ButtonVariant,
  ButtonSize,
  ButtonRounded,
  ButtonEventDetail,
  IconName,
} from "@karan9186/core";

// === TYPES ===

export interface UiButtonProps {
  /** Button content */
  children?: ReactNode;

  /** Visual style variant */
  variant?: ButtonVariant;

  /** Size of the button */
  size?: ButtonSize;

  /** Whether the button is disabled */
  disabled?: boolean;

  /** Whether the button is in loading state */
  loading?: boolean;

  /** Whether the button should take full width */
  fullWidth?: boolean;

  /** Whether to enable click animation */
  animated?: boolean;

  /** Border radius size */
  rounded?: ButtonRounded;

  /** Icon name for left side (from lucide icons) */
  iconLeft?: IconName;

  /** Icon name for right side (from lucide icons) */
  iconRight?: IconName;

  /** Icon name for center (for icon-only buttons) */
  icon?: IconName;

  /** Click event handler */
  onUiClick?: (detail: ButtonEventDetail) => void;

  /** Focus event handler */
  onUiFocus?: () => void;

  /** Blur event handler */
  onUiBlur?: () => void;

  /** Native click handler (for compatibility) */
  onClick?: (e: ReactMouseEvent<HTMLButtonElement>) => void;

  /** Additional CSS classes */
  className?: string;

  /** HTML data attributes */
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export interface UiButtonRef {
  /** Reference to the underlying ui-button element */
  readonly element: HTMLElement | null;
  /** Focus the button */
  focus: () => void;
  /** Blur the button */
  blur: () => void;
  /** Click the button programmatically */
  click: () => void;
}

// === COMPONENT ===

/**
 * React Button Component
 * Modern wrapper around ui-button web component
 *
 * @example
 * ```tsx
 * <UiButton
 *   variant="default"
 *   size="md"
 *   onUiClick={(detail) => console.log('Clicked!', detail)}
 * >
 *   <span slot="icon-left">👈</span>
 *   Click Me
 *   <span slot="icon-right">👉</span>
 * </UiButton>
 * ```
 */
export const UiButton = forwardRef<UiButtonRef, UiButtonProps>(
  (
    {
      children,
      variant = "default",
      size = "default",
      disabled = false,
      loading = false,
      fullWidth = false,
      animated = false,
      rounded = 'md',
      iconLeft,
      iconRight,
      icon,
      onUiClick,
      onUiFocus,
      onUiBlur,
      onClick,
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
      focus: () => innerRef.current?.focus(),
      blur: () => innerRef.current?.blur(),
      click: () => innerRef.current?.click(),
    }));

    // Sync props to web component
    useEffect(() => {
      const el = innerRef.current as (HTMLElement & {
        variant?: string;
        size?: string;
        disabled?: boolean;
        loading?: boolean;
        fullWidth?: boolean;
        animated?: boolean;
        rounded?: string;
        iconLeft?: IconName;
        iconRight?: IconName;
        icon?: IconName;
      }) | null;
      if (!el) return;

      el.variant = variant;
      el.size = size;
      el.disabled = disabled;
      el.loading = loading;
      el.fullWidth = fullWidth;
      el.animated = animated;
      el.rounded = rounded;
      el.iconLeft = iconLeft;
      el.iconRight = iconRight;
      el.icon = icon;
    }, [variant, size, disabled, loading, fullWidth, animated, rounded, iconLeft, iconRight, icon]);

    // Event handlers with proper typing
    const handleClick = useCallback(
      (e: CustomEvent<ButtonEventDetail>) => {
        onUiClick?.(e.detail);
        // Also call native onClick for compatibility
        if (onClick) {
          const syntheticEvent = new MouseEvent("click") as unknown as ReactMouseEvent<HTMLButtonElement>;
          Object.defineProperty(syntheticEvent, "target", { value: innerRef.current });
          onClick(syntheticEvent);
        }
      },
      [onUiClick, onClick],
    );

    const handleFocus = useCallback(() => {
      onUiFocus?.();
    }, [onUiFocus]);

    const handleBlur = useCallback(() => {
      onUiBlur?.();
    }, [onUiBlur]);

    // Bind event listeners
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      el.addEventListener("uiClick", handleClick as EventListener);
      el.addEventListener("uiFocus", handleFocus);
      el.addEventListener("uiBlur", handleBlur);

      return () => {
        el.removeEventListener("uiClick", handleClick as EventListener);
        el.removeEventListener("uiFocus", handleFocus);
        el.removeEventListener("uiBlur", handleBlur);
      };
    }, [handleClick, handleFocus, handleBlur]);

    return (
      <ui-button
        ref={innerRef}
        className={className}
        {...rest}
      >
        {children}
      </ui-button>
    );
  },
);

UiButton.displayName = "UiButton";

// === HOOK UTILITY ===

/**
 * Hook for using button functionality in React components
 * @returns Object with button ref and helper methods
 */
export function useButton() {
  const ref = useRef<UiButtonRef>(null);

  return {
    ref,
    focus: () => ref.current?.focus(),
    blur: () => ref.current?.blur(),
    click: () => ref.current?.click(),
  };
}
