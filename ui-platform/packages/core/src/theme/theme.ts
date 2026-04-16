export type UiTheme = {
  '--ui-primary': string;
  '--ui-primary-hover': string;
  '--ui-primary-foreground': string;
  '--ui-bg': string;
  '--ui-text': string;
  '--ui-text-on-primary': string;
  '--ui-border': string;
  '--ui-border-hover': string;
  '--ui-border-color': string;
  '--ui-border-radius': string;
  '--ui-secondary': string;
  '--ui-secondary-foreground': string;
  '--ui-secondary-hover': string;
  '--ui-secondary-hover-bg': string;
  '--ui-outline-hover-bg': string;
  '--ui-foreground': string;
  '--ui-accent': string;
  '--ui-destructive': string;
  '--ui-destructive-foreground': string;
  '--ui-destructive-hover': string;
  '--ui-ring': string;
  '--ui-toggle-track-bg': string;
  '--ui-toggle-track-checked-bg': string;
  '--ui-toggle-track-disabled-bg': string;
  '--ui-toggle-thumb-bg': string;
  '--ui-toggle-icon-color': string;
  '--ui-spinner-color': string;
  '--ui-toast-bg': string;
  '--ui-toast-text': string;
  '--ui-toast-border': string;
  '--ui-toast-success-bg': string;
  '--ui-toast-success-text': string;
  '--ui-toast-success-border': string;
  '--ui-toast-error-bg': string;
  '--ui-toast-error-text': string;
  '--ui-toast-error-border': string;
  '--ui-toast-warning-bg': string;
  '--ui-toast-warning-text': string;
  '--ui-toast-warning-border': string;
  '--ui-toast-info-bg': string;
  '--ui-toast-info-text': string;
  '--ui-toast-info-border': string;
  '--ui-toast-shadow': string;
  '--ui-toast-backdrop': string;
};

export type Theme = UiTheme;

export const lightTheme: UiTheme = {
  '--ui-primary': '#3b82f6',
  '--ui-primary-hover': '#2563eb',
  '--ui-primary-foreground': '#ffffff',
  '--ui-bg': '#ffffff',
  '--ui-text': '#111827',
  '--ui-text-on-primary': '#ffffff',
  '--ui-border': '#e4e4e7',
  '--ui-border-hover': '#d4d4d8',
  '--ui-border-color': '#cbd5e1',
  '--ui-border-radius': '6px',
  '--ui-secondary': '#f4f4f5',
  '--ui-secondary-foreground': '#18181b',
  '--ui-secondary-hover': '#e4e4e7',
  '--ui-secondary-hover-bg': 'rgba(17, 24, 39, 0.05)',
  '--ui-outline-hover-bg': 'rgba(59, 130, 246, 0.1)',
  '--ui-foreground': '#18181b',
  '--ui-accent': '#f4f4f5',
  '--ui-destructive': '#dc2626',
  '--ui-destructive-foreground': '#fafafa',
  '--ui-destructive-hover': '#b91c1c',
  '--ui-ring': '#3b82f6',
  '--ui-toggle-track-bg': '#414141',
  '--ui-toggle-track-checked-bg': '#006404',
  '--ui-toggle-track-disabled-bg': '#9d9d9d',
  '--ui-toggle-thumb-bg': '#ffffff',
  '--ui-toggle-icon-color': '#ffffff',
  '--ui-spinner-color': '#ffffff',
  '--ui-toast-bg': '#ffffff',
  '--ui-toast-text': '#111827',
  '--ui-toast-border': '#e5e7eb',
  '--ui-toast-success-bg': '#f0fdf4',
  '--ui-toast-success-text': '#166534',
  '--ui-toast-success-border': '#86efac',
  '--ui-toast-error-bg': '#fef2f2',
  '--ui-toast-error-text': '#991b1b',
  '--ui-toast-error-border': '#fca5a5',
  '--ui-toast-warning-bg': '#fffbeb',
  '--ui-toast-warning-text': '#92400e',
  '--ui-toast-warning-border': '#fcd34d',
  '--ui-toast-info-bg': '#eff6ff',
  '--ui-toast-info-text': '#1e40af',
  '--ui-toast-info-border': '#93c5fd',
  '--ui-toast-shadow': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '--ui-toast-backdrop': 'rgba(0, 0, 0, 0.08)',
};

export const darkTheme: UiTheme = {
  '--ui-primary': '#192a5b',
  '--ui-primary-hover': '#172554',
  '--ui-primary-foreground': '#ffffff',
  '--ui-bg': '#000000',
  '--ui-text': '#ffffff',
  '--ui-text-on-primary': '#ffffff',
  '--ui-border': '#000000',
  '--ui-border-hover': '#1a1a1a',
  '--ui-border-color': '#000000',
  '--ui-border-radius': '6px',
  '--ui-secondary': '#1a1a1a',
  '--ui-secondary-foreground': '#ffffff',
  '--ui-secondary-hover': '#262626',
  '--ui-secondary-hover-bg': 'rgba(255, 255, 255, 0.05)',
  '--ui-outline-hover-bg': 'rgba(30, 58, 138, 0.1)',
  '--ui-foreground': '#ffffff',
  '--ui-accent': '#1a1a1a',
  '--ui-destructive': '#dc2626',
  '--ui-destructive-foreground': '#ffffff',
  '--ui-destructive-hover': '#b91c1c',
  '--ui-ring': '#1e3a8a',
  '--ui-toggle-track-bg': '#1a1a1a',
  '--ui-toggle-track-checked-bg': '#1e3a8a',
  '--ui-toggle-track-disabled-bg': '#262626',
  '--ui-toggle-thumb-bg': '#ffffff',
  '--ui-toggle-icon-color': '#ffffff',
  '--ui-spinner-color': '#ffffff',
  '--ui-toast-bg': '#1a1a1a',
  '--ui-toast-text': '#ffffff',
  '--ui-toast-border': '#000000',
  '--ui-toast-success-bg': '#064e3b',
  '--ui-toast-success-text': '#86efac',
  '--ui-toast-success-border': '#000000',
  '--ui-toast-error-bg': '#7f1d1d',
  '--ui-toast-error-text': '#fca5a5',
  '--ui-toast-error-border': '#000000',
  '--ui-toast-warning-bg': '#78350f',
  '--ui-toast-warning-text': '#fcd34d',
  '--ui-toast-warning-border': '#000000',
  '--ui-toast-info-bg': '#1e3a8a',
  '--ui-toast-info-text': '#93c5fd',
  '--ui-toast-info-border': '#000000',
  '--ui-toast-shadow': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
  '--ui-toast-backdrop': 'rgba(0, 0, 0, 0.5)',
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

export function applyThemeToShadowRoot(theme: Partial<UiTheme>, shadowRoot: ShadowRoot) {
  const resolvedTheme = {
    ...defaultTheme,
    ...theme,
  };

  const styleElement = document.createElement('style');
  let cssText = ':host {';
  
  for (const [name, value] of Object.entries(resolvedTheme)) {
    if (typeof value === 'string') {
      cssText += `${name}: ${value};`;
    }
  }
  
  cssText += '}';
  
  styleElement.textContent = cssText;
  shadowRoot.appendChild(styleElement);
}

export function syncThemeToShadowRoot(shadowRoot: ShadowRoot, root?: HTMLElement) {
  const themeRoot = getThemeRoot(root);
  
  if (!themeRoot) {
    return;
  }

  const computedStyle = getComputedStyle(themeRoot);
  const styleElement = document.createElement('style');
  let cssText = ':host {';
  
  for (const name of Object.keys(defaultTheme)) {
    const value = computedStyle.getPropertyValue(name);
    if (value) {
      cssText += `${name}: ${value};`;
    }
  }
  
  cssText += '}';
  
  styleElement.textContent = cssText;
  shadowRoot.appendChild(styleElement);
}