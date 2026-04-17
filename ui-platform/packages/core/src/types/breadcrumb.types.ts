/**
 * Breadcrumb component types
 */

export type BreadcrumbSeparator = string | 'chevron' | 'slash' | 'arrow';

export interface BreadcrumbItem {
  /** Unique identifier for the item */
  value: string;
  /** Display text */
  label: string;
  /** URL for navigation (optional) */
  href?: string;
  /** Whether this is the active/last item */
  active?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Icon name for the item (optional) */
  icon?: string;
}

export interface BreadcrumbProps {
  /** Separator between items */
  separator?: BreadcrumbSeparator;
  /** Maximum number of items before collapsing */
  maxItems?: number;
  /** Number of items to show before collapse indicator */
  itemsBeforeCollapse?: number;
  /** Number of items to show after collapse indicator */
  itemsAfterCollapse?: number;
  /** Whether the breadcrumb is disabled */
  disabled?: boolean;
}

export interface BreadcrumbEventDetail {
  /** Value of the clicked item */
  value: string;
  /** Index of the clicked item */
  index: number;
  /** Href of the clicked item */
  href?: string;
}
