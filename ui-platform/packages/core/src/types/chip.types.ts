import type { IconName } from './icon.types';

export type ChipEventDetail = string;

export interface ChipProps {
  label: string;
  value: string;
  active?: boolean;
  disabled?: boolean;
  iconName?: IconName;
  badgeCounter?: number;
  removable?: boolean;
}
