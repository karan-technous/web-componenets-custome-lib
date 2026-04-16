import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
  useState,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import type {
  ButtonGroupOrientation,
  ButtonGroupSelectionMode,
  ButtonGroupVariant,
  ButtonGroupSize,
  ButtonGroupEventDetail,
  IconName,
  ButtonRounded,
} from "@karan9186/core";
import { isButtonSelected, computeNewSelectedValue } from "@karan9186/core";
import { UiButton } from "../button/Button";

// === TYPES ===

export interface UiButtonGroupProps {
  /** Button children to be grouped */
  children?: ReactNode;

  /** Orientation of the button group */
  orientation?: ButtonGroupOrientation;

  /** Gap between buttons */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'none';

  /** Variant inheritance for child buttons */
  variant?: ButtonGroupVariant;

  /** Size inheritance for child buttons */
  size?: ButtonGroupSize;

  /** Whether buttons are segmented */
  segmented?: boolean;

  /** Whether the group takes full width */
  fullWidth?: boolean;

  /** Whether the entire group is disabled */
  disabled?: boolean;

  /** Border radius size for the button group */
  rounded?: ButtonRounded;

  /** JSON string array of button objects with value, label, and optional button props */
  buttons?: string;

  /** Whether child buttons are in loading state */
  buttonLoading?: boolean;

  /** Whether to enable click animation on child buttons (press effect) */
  buttonAnimated?: boolean;

  /** Whether child buttons should take full width */
  buttonFullWidth?: boolean;

  /** Selection mode for the button group */
  selectionMode?: 'none' | 'single' | 'multiple';

  /** Current selected value(s) */
  value?: string | string[];

  /** Change event handler */
  onUiChange?: (detail: ButtonGroupEventDetail) => void;

  /** Value change event handler (new API) */
  onValueChange?: (value: string | string[]) => void;

  /** Click event handler (proxy) */
  onUiClick?: (detail: ButtonGroupEventDetail) => void;

  /** Additional CSS classes */
  className?: string;

  /** HTML data attributes */
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export interface UiButtonGroupRef {
  /** Reference to the underlying ui-button-group element */
  readonly element: HTMLElement | null;
  /** Focus the button group */
  focus: () => void;
  /** Blur the button group */
  blur: () => void;
}

// === COMPONENT ===

/**
 * React ButtonGroup Component
 * Modern wrapper around ui-button-group web component
 *
 * @example
 * ```tsx
 * <UiButtonGroup
 *   orientation="horizontal"
 *   selectionMode="single"
 *   value={selectedValue}
 *   onUiChange={(detail) => setSelectedValue(detail.value)}
 * >
 *   <UiButton value="option1">Option 1</UiButton>
 *   <UiButton value="option2">Option 2</UiButton>
 *   <UiButton value="option3">Option 3</UiButton>
 * </UiButtonGroup>
 * ```
 */
export const UiButtonGroup = forwardRef<UiButtonGroupRef, UiButtonGroupProps>(
  (
    {
      children,
      variant = "inherit",
      size = "inherit",
      segmented = false,
      orientation = "horizontal",
      gap = "md",
      fullWidth = false,
      disabled = false,
      rounded = "md",
      buttons,
      buttonLoading = false,
      buttonAnimated = false,
      buttonFullWidth = false,
      selectionMode = "none",
      value,
      onUiChange,
      onValueChange,
      onUiClick,
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
    }));

    // Sync props to web component
    useEffect(() => {
      const el = innerRef.current as (HTMLElement & {
        variant?: string;
        size?: string;
        segmented?: boolean;
        orientation?: string;
        gap?: string;
        fullWidth?: boolean;
        disabled?: boolean;
        rounded?: string;
        buttons?: string;
        buttonLoading?: boolean;
        buttonAnimated?: boolean;
        buttonFullWidth?: boolean;
        selectionMode?: string;
        value?: string | string[];
      }) | null;
      if (!el) return;

      el.variant = variant;
      el.size = size;
      el.segmented = segmented;
      el.orientation = orientation;
      el.gap = gap;
      el.fullWidth = fullWidth;
      el.disabled = disabled;
      el.rounded = rounded;
      if (buttons !== undefined) el.buttons = buttons;
      el.buttonLoading = buttonLoading;
      el.buttonAnimated = buttonAnimated;
      el.buttonFullWidth = buttonFullWidth;
      el.selectionMode = selectionMode;
      if (value !== undefined) el.value = value;
    }, [variant, size, segmented, orientation, gap, fullWidth, disabled, rounded, buttons, buttonLoading, buttonAnimated, buttonFullWidth, selectionMode, value]);

    // Setup event listeners
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      const handleValueChange = (e: Event) => {
        const customEvent = e as CustomEvent<string | string[]>;
        onValueChange?.(customEvent.detail);
      };

      const handleUiChange = (e: Event) => {
        const customEvent = e as CustomEvent<ButtonGroupEventDetail>;
        onUiChange?.(customEvent.detail);
      };

      const handleUiClick = (e: Event) => {
        const customEvent = e as CustomEvent<ButtonGroupEventDetail>;
        onUiClick?.(customEvent.detail);
      };

      el.addEventListener('valueChange', handleValueChange);
      el.addEventListener('uiChange', handleUiChange);
      el.addEventListener('uiClick', handleUiClick);

      return () => {
        el.removeEventListener('valueChange', handleValueChange);
        el.removeEventListener('uiChange', handleUiChange);
        el.removeEventListener('uiClick', handleUiClick);
      };
    }, [onValueChange, onUiChange, onUiClick]);

    // Apply props to child buttons
    const childrenWithProps = Children.map(children, (child, index) => {
      if (!isValidElement(child)) {
        return child;
      }

      // Only apply props to UiButton components
      if (child.type !== UiButton) {
        return child;
      }

      const total = Children.count(children);
      const isFirst = index === 0;
      const isLast = index === total - 1;

      // Apply variant and size inheritance
      const childProps: Partial<React.ComponentProps<typeof UiButton>> = {};

      if (variant !== 'inherit') {
        childProps.variant = variant;
      }

      if (size !== 'inherit') {
        childProps.size = size;
      }

      if (disabled) {
        childProps.disabled = disabled;
      }

      // Apply segmented styling
      if (segmented) {
        if (isFirst && total > 1) {
          childProps['data-position'] = 'first';
        } else if (isLast && total > 1) {
          childProps['data-position'] = 'last';
        } else if (total > 1) {
          childProps['data-position'] = 'middle';
        }
      }

      return cloneElement(child, childProps);
    });

    // Compute group classes
    const groupClasses = [
      "ui-button-group-react",
      `ui-button-group-react--${orientation}`,
      `ui-button-group-react--gap-${gap}`,
      fullWidth && "ui-button-group-react--full-width",
      segmented && "ui-button-group-react--segmented",
      disabled && "ui-button-group-react--disabled",
      `ui-button-group-react--rounded-${rounded}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Compute group role
    const groupRole = "group";

    // Compute aria props
    const ariaProps: Record<string, string> = {};

    return (
      <ui-button-group
        ref={innerRef as any}
        className={groupClasses}
        role={groupRole}
        {...ariaProps}
        {...rest}
      >
        {childrenWithProps}
      </ui-button-group>
    );
  },
);

UiButtonGroup.displayName = "UiButtonGroup";
