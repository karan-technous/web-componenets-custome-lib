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

export type Theme = UiTheme;

export const lightTheme: UiTheme = {
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

export const darkTheme: UiTheme = {
  '--ui-primary': '#60a5fa',
  '--ui-primary-hover': '#3b82f6',
  '--ui-bg': '#0f172a',
  '--ui-text': '#e2e8f0',
  '--ui-text-on-primary': '#0f172a',
  '--ui-border-color': '#334155',
  '--ui-border-radius': '6px',
  '--ui-secondary-hover-bg': 'rgba(226, 232, 240, 0.08)',
  '--ui-outline-hover-bg': 'rgba(96, 165, 250, 0.18)',
  '--ui-toggle-track-bg': '#475569',
  '--ui-toggle-track-checked-bg': '#2563eb',
  '--ui-toggle-track-disabled-bg': '#1e293b',
  '--ui-toggle-thumb-bg': '#f8fafc',
  '--ui-toggle-icon-color': '#ffffff',
  '--ui-spinner-color': '#0f172a',
};

export const defaultTheme: UiTheme = { ...lightTheme };

let themeInitialized = false;

function getThemeRoot(root?: HTMLElement) {
  if (root) {
    return root;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return document.documentElement;
}

function hasThemeVariables(root: HTMLElement) {
  return Object.keys(defaultTheme).every(name => root.style.getPropertyValue(name).trim() !== '');
}

export function applyTheme(theme: Partial<UiTheme>, root?: HTMLElement) {
  const themeRoot = getThemeRoot(root);

  if (!themeRoot) {
    return;
  }

  const resolvedTheme = {
    ...defaultTheme,
    ...theme,
  };

  for (const [name, value] of Object.entries(resolvedTheme)) {
    if (typeof value === 'string') {
      themeRoot.style.setProperty(name, value);
    }
  }

  themeInitialized = true;
}

export function initializeTheme(theme: Partial<UiTheme> = {}) {
  const root = getThemeRoot();

  if (!root) {
    return;
  }

  if (themeInitialized && Object.keys(theme).length === 0 && hasThemeVariables(root)) {
    return;
  }

  applyTheme(theme, root);
}

export function getThemeVariables() {
  if (typeof document === 'undefined') {
    return null;
  }

  return getComputedStyle(document.documentElement);
}
