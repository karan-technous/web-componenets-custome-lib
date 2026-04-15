/**
 * Shared Icon Types for cross-framework compatibility
 * Re-exported from lucide for type safety
 */

import type { icons } from 'lucide';

// Type-safe icon names from lucide
export type IconName = keyof typeof icons;

// Icon component props (shared across frameworks)
export interface IconProps {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  stroke?: number;
  color?: string;
}
