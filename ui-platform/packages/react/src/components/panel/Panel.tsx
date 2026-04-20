import React, { forwardRef, useEffect, useRef } from 'react';

export type PanelVariant = 'default' | 'outlined' | 'elevated';
export type PanelSize = 'sm' | 'md' | 'lg';
export type PanelRounded = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface UiPanelProps {
  /** Visual variant of the panel */
  variant?: PanelVariant;
  /** Size of the panel */
  size?: PanelSize;
  /** Border radius scale */
  rounded?: PanelRounded;
  /** Whether the panel is collapsible */
  collapsible?: boolean;
  /** Expanded state (controlled) */
  expanded?: boolean;
  /** Default expanded state (uncontrolled) */
  defaultExpanded?: boolean;
  /** Whether the panel is in loading state */
  loading?: boolean;
  /** Whether the panel is disabled */
  disabled?: boolean;
  /** Callback when panel is expanded/collapsed */
  onToggle?: (expanded: boolean) => void;
  /** @deprecated Use onToggle */
  onUiToggle?: (detail: { expanded: boolean }) => void;
  /** Header content */
  header?: React.ReactNode;
  /** Actions content */
  actions?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Panel content (children) */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** HTML data attributes */
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export type UiPanelRef = HTMLUiPanelElement;

type HTMLUiPanelElement = HTMLElement & {
  variant?: PanelVariant;
  size?: PanelSize;
  rounded?: PanelRounded;
  collapsible?: boolean;
  expanded?: boolean;
  loading?: boolean;
  disabled?: boolean;
  stickyHeader?: boolean;
  lazy?: boolean;
  toggle?: () => void;
  expand?: () => void;
  collapse?: () => void;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-panel': any;
    }
  }
}

export const Panel = forwardRef<UiPanelRef, UiPanelProps>(
  (
    {
      variant = 'default',
      size = 'md',
      rounded = 'md',
      collapsible = false,
      expanded,
      defaultExpanded = true,
      loading = false,
      disabled = false,
      onToggle,
      onUiToggle,
      header,
      actions,
      footer,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<UiPanelRef>(null);
    const initializedDefaultExpandedRef = useRef(false);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      el.variant = variant;
      el.size = size;
      el.rounded = rounded;
      el.collapsible = collapsible;
      if (typeof expanded === 'boolean') el.expanded = expanded;
      el.loading = loading;
      el.disabled = disabled;
    }, [variant, size, rounded, collapsible, expanded, loading, disabled]);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || typeof expanded === 'boolean' || initializedDefaultExpandedRef.current) {
        return;
      }
      el.expanded = defaultExpanded;
      initializedDefaultExpandedRef.current = true;
    }, [expanded, defaultExpanded]);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      const handleToggle = (event: Event) => {
        const next = (event as CustomEvent<boolean>).detail;
        onToggle?.(next);
      };

      const handleLegacyToggle = (event: Event) => {
        onUiToggle?.((event as CustomEvent<{ expanded: boolean }>).detail);
      };

      el.addEventListener('toggle', handleToggle as EventListener);
      el.addEventListener('uiToggle', handleLegacyToggle as EventListener);

      return () => {
        el.removeEventListener('toggle', handleToggle as EventListener);
        el.removeEventListener('uiToggle', handleLegacyToggle as EventListener);
      };
    }, [onToggle, onUiToggle]);

    const assignRef = (node: UiPanelRef | null) => {
      innerRef.current = node;
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    };
    const isControlled = typeof expanded === 'boolean';

    return React.createElement(
      'ui-panel',
      {
        ref: assignRef,
        class: className,
        variant,
        size,
        rounded,
        collapsible,
        expanded,
        'data-controlled': isControlled ? 'true' : undefined,
        loading,
        disabled,
        ...rest,
      },
      header && React.createElement('div', {
        slot: 'header',
        dangerouslySetInnerHTML: typeof header === 'string' ? { __html: header } : undefined,
      }, typeof header !== 'string' ? header : undefined),
      actions && React.createElement('div', {
        slot: 'actions',
        dangerouslySetInnerHTML: typeof actions === 'string' ? { __html: actions } : undefined,
      }, typeof actions !== 'string' ? actions : undefined),
      typeof children === 'string'
        ? React.createElement('div', { dangerouslySetInnerHTML: { __html: children } })
        : children,
      footer && React.createElement('div', {
        slot: 'footer',
        dangerouslySetInnerHTML: typeof footer === 'string' ? { __html: footer } : undefined,
      }, typeof footer !== 'string' ? footer : undefined),
    );
  },
);

Panel.displayName = 'Panel';
