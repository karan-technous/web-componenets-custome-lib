import { Theme, applyTheme as applyThemeCore } from "./theme";

export function applyThemeToElement(
  theme: Theme,
  root: HTMLElement = document.documentElement,
) {
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export { applyThemeCore as applyTheme };
