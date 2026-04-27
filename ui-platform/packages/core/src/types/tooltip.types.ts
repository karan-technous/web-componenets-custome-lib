export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export type TooltipTrigger = 'hover' | 'click' | 'focus';

export type TooltipVariant = 'simple' | 'complex';

export interface TooltipBaseProps {
  content?: string;
  position: TooltipPosition;
  trigger: TooltipTrigger;
  open?: boolean;
  disabled: boolean;
  variant: TooltipVariant;
  delay: number;
}

export const TOOLTIP_DEFAULTS: Required<Omit<TooltipBaseProps, 'content' | 'open'>> = {
  position: 'top',
  trigger: 'hover',
  disabled: false,
  variant: 'simple',
  delay: 150,
};
