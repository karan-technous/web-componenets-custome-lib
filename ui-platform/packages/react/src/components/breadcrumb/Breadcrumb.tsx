import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';

export interface UiBreadcrumbProps {
  /** Breadcrumb items as JSON string */
  items?: string;
  /** Separator between items */
  separator?: 'slash' | 'chevron' | 'arrow' | string;
  /** Maximum number of items before collapsing */
  maxItems?: number;
  /** Number of items to show before collapse indicator */
  itemsBeforeCollapse?: number;
  /** Number of items to show after collapse indicator */
  itemsAfterCollapse?: number;
  /** Whether the breadcrumb is disabled */
  disabled?: boolean;
  /** Callback when a breadcrumb item is clicked */
  onUiClick?: (detail: { value: string; index: number; href?: string }) => void;
  /** Additional CSS classes */
  className?: string;
  /** HTML data attributes */
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export interface UiBreadcrumbRef {
  element: HTMLElement | null;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ui-breadcrumb': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        items?: string;
        separator?: 'slash' | 'chevron' | 'arrow' | string;
        maxItems?: number;
        itemsBeforeCollapse?: number;
        itemsAfterCollapse?: number;
        disabled?: boolean;
      };
    }
  }
}

export const Breadcrumb = forwardRef<UiBreadcrumbRef, UiBreadcrumbProps>(
  (
    {
      items = '',
      separator = 'slash',
      maxItems,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 1,
      disabled = false,
      onUiClick,
      className,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLElement>(null);

    // Expose imperative handle
    useImperativeHandle(ref, () => ({
      element: innerRef.current,
    }));

    // Sync props to web component
    useEffect(() => {
      const el = innerRef.current as any;
      if (!el) return;

      el.items = items;
      el.separator = separator;
      if (maxItems !== undefined) el.maxItems = maxItems;
      el.itemsBeforeCollapse = itemsBeforeCollapse;
      el.itemsAfterCollapse = itemsAfterCollapse;
      el.disabled = disabled;
    }, [items, separator, maxItems, itemsBeforeCollapse, itemsAfterCollapse, disabled]);

    // Setup event listeners
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      const handleUiClick = (event: CustomEvent) => {
        onUiClick?.(event.detail);
      };

      el.addEventListener('uiClick', handleUiClick);

      return () => {
        el.removeEventListener('uiClick', handleUiClick);
      };
    }, [onUiClick]);

    return React.createElement(
      'ui-breadcrumb' as any,
      {
        ref: innerRef,
        class: className,
        items,
        separator,
        maxItems,
        itemsBeforeCollapse,
        itemsAfterCollapse,
        disabled,
        ...rest,
      },
    );
  },
);

Breadcrumb.displayName = 'Breadcrumb';
