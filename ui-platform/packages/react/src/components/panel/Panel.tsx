import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';

export type PanelVariant = 'default' | 'outlined' | 'elevated';
export type PanelSize = 'sm' | 'md' | 'lg';

export interface UiPanelProps {
  /** Visual variant of the panel */
  variant?: PanelVariant;
  /** Size of the panel */
  size?: PanelSize;
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

export interface UiPanelRef {
  element: HTMLElement | null;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
  isExpanded: () => boolean;
}

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
      collapsible = false,
      defaultExpanded = true,
      expanded,
      loading = false,
      disabled = false,
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
    console.log("Panel wrapper: Props received", { variant, size, collapsible, expanded, loading, disabled, hasHeader: !!header, hasActions: !!actions, hasFooter: !!footer, hasChildren: !!children });
    
    const innerRef = useRef<HTMLElement>(null);

    // Determine if component is controlled
    const isControlled = expanded !== undefined;

    // Expose imperative handle
    useImperativeHandle(ref, () => ({
      element: innerRef.current,
      toggle: () => (innerRef.current as any)?.toggle?.(),
      expand: () => (innerRef.current as any)?.expand?.(),
      collapse: () => (innerRef.current as any)?.collapse?.(),
      isExpanded: () => (innerRef.current as any)?.expanded ?? true,
    }));

    // Sync props to web component
    useEffect(() => {
      const el = innerRef.current as any;
      if (!el) return;

      el.variant = variant;
      el.size = size;
      el.collapsible = collapsible;

      if (isControlled) {
        el.expanded = expanded;
      } else {
        el.expanded = defaultExpanded;
      }

      el.loading = loading;
      el.disabled = disabled;
    }, [variant, size, collapsible, expanded, defaultExpanded, loading, disabled, isControlled]);

    // Event listeners
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      const handleUiToggle = (event: CustomEvent) => {
        onUiToggle?.(event.detail);
      };

      el.addEventListener('uiToggle', handleUiToggle);

      return () => {
        el.removeEventListener('uiToggle', handleUiToggle);
      };
    }, [onUiToggle]);

    return React.createElement(
      'ui-panel',
      {
        ref: innerRef,
        class: className,
        variant,
        size,
        collapsible,
        expanded: isControlled ? expanded : undefined,
        defaultExpanded: isControlled ? undefined : defaultExpanded,
        loading,
        disabled,
        'data-controlled': isControlled,
        ...rest,
      },
      header && React.createElement('div', { 
        slot: 'header',
        dangerouslySetInnerHTML: typeof header === 'string' ? { __html: header } : undefined 
      }, typeof header !== 'string' ? header : undefined),
      actions && React.createElement('div', { 
        slot: 'actions',
        dangerouslySetInnerHTML: typeof actions === 'string' ? { __html: actions } : undefined 
      }, typeof actions !== 'string' ? actions : undefined),
      typeof children === 'string' 
        ? React.createElement('div', { dangerouslySetInnerHTML: { __html: children } })
        : children,
      footer && React.createElement('div', { 
        slot: 'footer',
        dangerouslySetInnerHTML: typeof footer === 'string' ? { __html: footer } : undefined 
      }, typeof footer !== 'string' ? footer : undefined),
    );
  },
);

Panel.displayName = 'Panel';
