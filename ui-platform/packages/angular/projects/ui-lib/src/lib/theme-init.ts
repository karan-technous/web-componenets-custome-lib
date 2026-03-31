import { applyTheme, lightTheme } from '@ui-platform/core';

export function initTheme() {
  return () => {
    const root = document.documentElement;

    const hasTheme =
      getComputedStyle(root).getPropertyValue('--ui-bg').trim() !== '';

    if (!hasTheme) {
      applyTheme(lightTheme);
    }
  };
}