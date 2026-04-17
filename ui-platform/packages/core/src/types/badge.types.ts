/**
 * Badge component types
 */

export type BadgeVariant = 'solid' | 'soft' | 'outline';
export type BadgeColor = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'rounded' | 'pill';

export interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  shape?: BadgeShape;
  dot?: boolean;
  removable?: boolean;
  disabled?: boolean;
}

export interface BadgeEventDetail {
  color: BadgeColor;
  variant: BadgeVariant;
}
