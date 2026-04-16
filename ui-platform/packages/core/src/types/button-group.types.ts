/**
 * Shared ButtonGroup Types for cross-framework compatibility
 * Source of truth for all button group component variations
 * Located in core package for single source of truth
 */

import type { ButtonVariant, ButtonSize } from './button.types';

// ButtonGroup orientation
export type ButtonGroupOrientation = 'horizontal' | 'vertical';

// ButtonGroup selection mode
export type ButtonGroupSelectionMode = 'none' | 'single' | 'multiple';

// ButtonGroup variant inheritance
export type ButtonGroupVariant = 'inherit' | ButtonVariant;

// ButtonGroup size inheritance
export type ButtonGroupSize = 'inherit' | ButtonSize;

// ButtonGroup event detail type
export interface ButtonGroupEventDetail {
  value: string | string[];
  selectionMode: ButtonGroupSelectionMode;
}

// ButtonGroup base props interface (shared across all frameworks)
export interface ButtonGroupBaseProps {
  orientation: ButtonGroupOrientation;
  variant: ButtonGroupVariant;
  size: ButtonGroupSize;
  segmented: boolean;
  attached: boolean;
  fullWidth: boolean;
  disabled: boolean;
  selectionMode: ButtonGroupSelectionMode;
  value: string | string[] | null;
  defaultValue: string | string[] | null;
}

// Default ButtonGroup configuration
export const BUTTON_GROUP_DEFAULTS: ButtonGroupBaseProps = {
  orientation: 'horizontal',
  variant: 'inherit',
  size: 'inherit',
  segmented: false,
  attached: false,
  fullWidth: false,
  disabled: false,
  selectionMode: 'none',
  value: null,
  defaultValue: null,
};

// CVA-style variant configuration for TailwindCSS
export const buttonGroupVariants = {
  base: [
    'inline-flex',
    'items-center',
    'gap-0',
  ],
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
    fullWidth: {
      'true': 'w-full',
      'false': '',
    },
    attached: {
      'true': '',
      'false': 'gap-2',
    },
    segmented: {
      'true': '',
      'false': '',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    fullWidth: false,
    attached: false,
    segmented: false,
  },
} as const;

// Helper type for computing button group classes
export type ButtonGroupClassVariant = {
  orientation?: ButtonGroupOrientation;
  fullWidth?: boolean;
  attached?: boolean;
  segmented?: boolean;
};

/**
 * CVA-style class generator utility for ButtonGroup
 */
export function computeButtonGroupClasses(props: ButtonGroupClassVariant): string {
  const { base, variants } = buttonGroupVariants;

  const orientationClass = variants.orientation[props.orientation || 'horizontal'];
  const fullWidthClass = variants.fullWidth[(props.fullWidth ? 'true' : 'false') as 'true' | 'false'];
  const attachedClass = variants.attached[(props.attached ? 'true' : 'false') as 'true' | 'false'];
  const segmentedClass = variants.segmented[(props.segmented ? 'true' : 'false') as 'true' | 'false'];

  return [
    ...base,
    orientationClass,
    fullWidthClass,
    attachedClass,
    segmentedClass,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Helper function to determine if a button is selected
 */
export function isButtonSelected(
  buttonValue: string,
  selectedValue: string | string[] | null,
  selectionMode: ButtonGroupSelectionMode,
): boolean {
  if (selectionMode === 'none') {
    return false;
  }

  if (selectedValue === null) {
    return false;
  }

  if (selectionMode === 'single') {
    return selectedValue === buttonValue;
  }

  if (selectionMode === 'multiple') {
    return Array.isArray(selectedValue) && selectedValue.includes(buttonValue);
  }

  return false;
}

/**
 * Helper function to compute new selected value based on selection mode
 */
export function computeNewSelectedValue(
  buttonValue: string,
  currentSelected: string | string[] | null,
  selectionMode: ButtonGroupSelectionMode,
): string | string[] {
  if (selectionMode === 'single') {
    return buttonValue;
  }

  if (selectionMode === 'multiple') {
    const currentArray = Array.isArray(currentSelected) ? currentSelected : [];
    if (currentArray.includes(buttonValue)) {
      return currentArray.filter(v => v !== buttonValue);
    }
    return [...currentArray, buttonValue];
  }

  return buttonValue;
}
