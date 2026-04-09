import type { Framework } from '../state/frameworkStore';

export type AppearanceMode = 'dark' | 'light';

type ThemeColors = {
  primary: string;
  primaryRgb: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryRgb: string;
  glow: string;
  glowStrong: string;
  gradient: string;
  gradientFrom: string;
  gradientTo: string;
  name: string;
  light?: Partial<Omit<ThemeColors, 'name' | 'light'>>;
};

const themeConfig: Record<'webcomponents' | 'react' | 'angular', ThemeColors> = {
  webcomponents: {
    primary: '#00e6c3',
    primaryRgb: '0, 230, 195',
    primaryLight: '#00f5d0',
    primaryDark: '#00b596',
    secondary: '#14b8ff',
    secondaryRgb: '20, 184, 255',
    glow: 'rgba(0, 230, 195, 0.22)',
    glowStrong: 'rgba(0, 245, 208, 0.45)',
    gradient: 'linear-gradient(135deg, #00f5d0 0%, #14b8ff 100%)',
    gradientFrom: '#00f5d0',
    gradientTo: '#14b8ff',
    name: 'Web Components',
    light: {
      primary: '#0f766e',
      primaryRgb: '15, 118, 110',
      primaryLight: '#0d9488',
      primaryDark: '#115e59',
      secondary: '#155e75',
      secondaryRgb: '21, 94, 117',
      glow: 'rgba(15, 118, 110, 0.16)',
      glowStrong: 'rgba(13, 148, 136, 0.28)',
      gradient: 'linear-gradient(135deg, #0d9488 0%, #155e75 100%)',
      gradientFrom: '#0d9488',
      gradientTo: '#155e75',
    },
  },
  react: {
    primary: '#5b8cff',
    primaryRgb: '91, 140, 255',
    primaryLight: '#75a2ff',
    primaryDark: '#3e6fe0',
    secondary: '#89a8ff',
    secondaryRgb: '137, 168, 255',
    glow: 'rgba(91, 140, 255, 0.22)',
    glowStrong: 'rgba(117, 162, 255, 0.45)',
    gradient: 'linear-gradient(135deg, #75a2ff 0%, #5b8cff 100%)',
    gradientFrom: '#75a2ff',
    gradientTo: '#5b8cff',
    name: 'React',
    light: {
      primary: '#2563eb',
      primaryRgb: '37, 99, 235',
      primaryLight: '#3b82f6',
      primaryDark: '#1d4ed8',
      secondary: '#1d4ed8',
      secondaryRgb: '29, 78, 216',
      glow: 'rgba(37, 99, 235, 0.16)',
      glowStrong: 'rgba(59, 130, 246, 0.28)',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      gradientFrom: '#3b82f6',
      gradientTo: '#1d4ed8',
    },
  },
  angular: {
    primary: '#ff5d63',
    primaryRgb: '255, 93, 99',
    primaryLight: '#ff7a7f',
    primaryDark: '#e0454d',
    secondary: '#ff7b8b',
    secondaryRgb: '255, 123, 139',
    glow: 'rgba(255, 93, 99, 0.22)',
    glowStrong: 'rgba(255, 122, 127, 0.45)',
    gradient: 'linear-gradient(135deg, #ff7a7f 0%, #ff5d63 100%)',
    gradientFrom: '#ff7a7f',
    gradientTo: '#ff5d63',
    name: 'Angular',
    light: {
      primary: '#dc2626',
      primaryRgb: '220, 38, 38',
      primaryLight: '#ef4444',
      primaryDark: '#b91c1c',
      secondary: '#be123c',
      secondaryRgb: '190, 18, 60',
      glow: 'rgba(220, 38, 38, 0.16)',
      glowStrong: 'rgba(239, 68, 68, 0.28)',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #be123c 100%)',
      gradientFrom: '#ef4444',
      gradientTo: '#be123c',
    },
  },
};

const frameworkToTheme: Record<Framework, keyof typeof themeConfig> = {
  angular: 'angular',
  react: 'react',
  wc: 'webcomponents',
};

const APPEARANCE_STORAGE_KEY = 'bridge-appearance';

export function getAppearance(): AppearanceMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

export function setAppearance(mode: AppearanceMode) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(APPEARANCE_STORAGE_KEY, mode);
}

export function applyTheme(framework: Framework, appearance: AppearanceMode) {
  const root = document.documentElement;
  const theme = themeConfig[frameworkToTheme[framework]];
  const palette =
    appearance === 'light' && theme.light ? { ...theme, ...theme.light } : theme;

  root.style.setProperty('--bride-primary', palette.primary);
  root.style.setProperty('--bride-primary-rgb', palette.primaryRgb);
  root.style.setProperty('--bride-primary-light', palette.primaryLight);
  root.style.setProperty('--bride-primary-dark', palette.primaryDark);
  root.style.setProperty('--bride-secondary', palette.secondary);
  root.style.setProperty('--bride-secondary-rgb', palette.secondaryRgb);
  root.style.setProperty('--bride-gradient', palette.gradient);
  root.style.setProperty('--bride-gradient-from', palette.gradientFrom);
  root.style.setProperty('--bride-gradient-to', palette.gradientTo);
  root.style.setProperty('--bride-glow', palette.glow);
  root.style.setProperty('--bride-glow-strong', palette.glowStrong);
  root.style.setProperty('--bride-framework-name', `"${palette.name}"`);
  root.dataset.framework = framework;
  root.dataset.appearance = appearance;
}
