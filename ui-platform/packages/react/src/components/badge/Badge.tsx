import React, { forwardRef, useEffect, useRef } from 'react';

export interface UiBadgeProps {
  /** Visual style variant of the badge */
  variant?: 'solid' | 'soft' | 'outline';
  /** Color theme of the badge */
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  /** Size of the badge */
  size?: 'sm' | 'md' | 'lg';
  /** Shape of the badge */
  shape?: 'rounded' | 'pill';
  /** Show as a dot indicator (status indicator) */
  dot?: boolean;
  /** Show remove button */
  removable?: boolean;
  /** Disable the badge */
  disabled?: boolean;
  /** Callback when remove button is clicked */
  onRemove?: () => void;
  /** Badge icon */
  icon?: React.ReactNode;
  /** Badge content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** HTML data attributes */
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export interface UiBadgeRef {
  element: HTMLElement | null;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-badge': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: 'solid' | 'soft' | 'outline';
        color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
        size?: 'sm' | 'md' | 'lg';
        shape?: 'rounded' | 'pill';
        dot?: boolean;
        removable?: boolean;
        disabled?: boolean;
      };
    }
  }
}

export const Badge = forwardRef<UiBadgeRef, UiBadgeProps>(
  (
    {
      variant = 'solid',
      color = 'primary',
      size = 'md',
      shape = 'rounded',
      dot = false,
      removable = false,
      disabled = false,
      onRemove,
      icon,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLElement>(null);

    // Expose imperative handle
    useEffect(() => {
      if (typeof ref === 'function') {
        ref({ element: innerRef.current });
      } else if (ref) {
        ref.current = { element: innerRef.current };
      }
    }, [ref]);

    // Sync props to web component
    useEffect(() => {
      const el = innerRef.current as any;
      if (!el) return;

      el.variant = variant;
      el.color = color;
      el.size = size;
      el.shape = shape;
      el.dot = dot;
      el.removable = removable;
      el.disabled = disabled;
    }, [variant, color, size, shape, dot, removable, disabled]);

    // Setup event listeners
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      const handleRemove = () => {
        onRemove?.();
      };

      el.addEventListener('remove', handleRemove);

      return () => {
        el.removeEventListener('remove', handleRemove);
      };
    }, [onRemove]);

    return React.createElement(
      'ui-badge' as any,
      {
        ref: innerRef,
        class: className,
        variant,
        color,
        size,
        shape,
        dot,
        removable,
        disabled,
        ...rest,
      },
      icon && React.createElement('span', { slot: 'icon' }, icon),
      !dot && children,
    );
  },
);

Badge.displayName = 'Badge';
