export type UiTheme = {
  '--ui-primary': string;
  '--ui-primary-hover': string;
  '--ui-bg': string;
  '--ui-text': string;
  '--ui-text-on-primary': string;
  '--ui-border-color': string;
  '--ui-border-radius': string;
  '--ui-secondary-hover-bg': string;
  '--ui-outline-hover-bg': string;
  '--ui-toggle-track-bg': string;
  '--ui-toggle-track-checked-bg': string;
  '--ui-toggle-track-disabled-bg': string;
  '--ui-toggle-thumb-bg': string;
  '--ui-toggle-icon-color': string;
  '--ui-spinner-color': string;
};

export const defaultTheme: UiTheme = {
  '--ui-primary': '#3b82f6',
  '--ui-primary-hover': '#2563eb',
  '--ui-bg': '#ffffff',
  '--ui-text': '#111827',
  '--ui-text-on-primary': '#ffffff',
  '--ui-border-color': '#cbd5e1',
  '--ui-border-radius': '6px',
  '--ui-secondary-hover-bg': 'rgba(17, 24, 39, 0.05)',
  '--ui-outline-hover-bg': 'rgba(59, 130, 246, 0.1)',
  '--ui-toggle-track-bg': '#414141',
  '--ui-toggle-track-checked-bg': '#006404',
  '--ui-toggle-track-disabled-bg': '#9d9d9d',
  '--ui-toggle-thumb-bg': '#ffffff',
  '--ui-toggle-icon-color': '#ffffff',
  '--ui-spinner-color': '#ffffff',
};

let themeInitialized = false;

export function initializeTheme(theme: Partial<UiTheme> = {}) {
  if (typeof document === 'undefined') {
    return;
  }

  if (themeInitialized && Object.keys(theme).length === 0) {
    return;
  }

  const root = document.documentElement;
  const resolvedTheme = {
    ...defaultTheme,
    ...theme,
  };

  for (const [name, value] of Object.entries(resolvedTheme)) {
    root.style.setProperty(name, value);
  }

  themeInitialized = true;
}

export function getThemeVariables() {
  if (typeof document === 'undefined') {
    return null;
  }

  return getComputedStyle(document.documentElement);
}
