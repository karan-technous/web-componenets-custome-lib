import type { Framework } from '../state/frameworkStore';

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
  },
};

const frameworkToTheme: Record<Framework, keyof typeof themeConfig> = {
  angular: 'angular',
  react: 'react',
  wc: 'webcomponents',
};

export function applyTheme(framework: Framework) {
  const root = document.documentElement;
  const palette = themeConfig[frameworkToTheme[framework]];

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
}
