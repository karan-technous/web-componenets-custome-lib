import { Theme } from './theme';

export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement) {
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}