// src/icons/icon.registry.ts
import { icons } from 'lucide';

// Type-safe keys
export type IconName = keyof typeof icons;

export const ICONS = icons;