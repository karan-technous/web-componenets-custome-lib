import type { IconName } from './icon.types';

export type TabItem = {
  key: string;
  label: string;
  content?: string | HTMLElement;
  disabled?: boolean;
  icon?: IconName | string;
  tooltip?: string;
  tagColor?: string;
};

export type TabIconClickDetail = {
  index: number;
  tab: TabItem;
};
