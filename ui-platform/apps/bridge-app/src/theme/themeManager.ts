import type { Framework } from '../state/frameworkStore';

export type AppearanceMode = 'dark' | 'light';

type ThemeColors = {
  // Primary brand colors
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
  
  // Background colors
  bg: string;
  bgElevated: string;
  
  // Text colors
  text: string;
  textSoft: string;
  textMuted: string;
  
  // Border colors
  borderSubtle: string;
  borderStrong: string;
  
  // Glass effects
  glassSurface: string;
  glassDark: string;
  
  // UI elements
  ring: string;
  fieldBg: string;
  
  // Documentation colors
  docsAccent: string;
  docsAccentStrong: string;
  docsAccentBorder: string;
  docsAccentSurface: string;
  docsAccentSurfaceStrong: string;
  docsAccentGlow: string;
  docsPreviewBorder: string;
  docsPreviewBg: string;
  docsInlineCodeBg: string;
  docsCodeChipBg: string;
  docsCodeText: string;
  docsTokenName: string;
  docsTokenType: string;
  docsTokenDefault: string;
  docsHeading: string;
  docsBody: string;
  docsMuted: string;
  docsTableHead: string;
  docsTableDesc: string;
  docsRequired: string;
  
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
    bg: '#030711',
    bgElevated: '#060c1a',
    text: 'rgba(244, 247, 255, 0.96)',
    textSoft: 'rgba(219, 225, 241, 0.7)',
    textMuted: 'rgba(182, 193, 214, 0.48)',
    borderSubtle: 'rgba(255, 255, 255, 0.12)',
    borderStrong: 'color-mix(in srgb, #00e6c3 48%, rgba(255, 255, 255, 0.28))',
    glassSurface: 'linear-gradient(145deg, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.03) 32%, rgba(255, 255, 255, 0.02) 100%)',
    glassDark: 'linear-gradient(160deg, color-mix(in srgb, #00e6c3 12%, #070d1c), color-mix(in srgb, #14b8ff 8%, #050914))',
    ring: 'color-mix(in srgb, #00e6c3 58%, transparent)',
    fieldBg: 'rgba(7, 13, 24, 0.8)',
    docsAccent: '#00e6c3',
    docsAccentStrong: '#00f5d0',
    docsAccentBorder: 'rgba(0, 230, 195, 0.3)',
    docsAccentSurface: 'rgba(0, 230, 195, 0.1)',
    docsAccentSurfaceStrong: 'rgba(0, 230, 195, 0.14)',
    docsAccentGlow: 'rgba(0, 230, 195, 0.18)',
    docsPreviewBorder: 'rgba(16, 65, 63, 0.95)',
    docsPreviewBg: '#07101a',
    docsInlineCodeBg: '#041a1a',
    docsCodeChipBg: '#041917',
    docsCodeText: '#d8e2ff',
    docsTokenName: '#18f2df',
    docsTokenType: '#c789ff',
    docsTokenDefault: '#f2c94c',
    docsHeading: '#f8fbff',
    docsBody: 'rgba(255, 255, 255, 0.42)',
    docsMuted: 'rgba(255, 255, 255, 0.18)',
    docsTableHead: 'rgba(255, 255, 255, 0.26)',
    docsTableDesc: 'rgba(255, 255, 255, 0.38)',
    docsRequired: '#ff7272',
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
      bg: '#f3f6fb',
      bgElevated: '#ffffff',
      text: 'rgba(17, 27, 44, 0.94)',
      textSoft: 'rgba(40, 52, 74, 0.72)',
      textMuted: 'rgba(72, 86, 112, 0.62)',
      borderSubtle: 'rgba(25, 37, 64, 0.12)',
      borderStrong: 'color-mix(in srgb, #0f766e 38%, rgba(25, 37, 64, 0.2))',
      glassSurface: 'linear-gradient(145deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 255, 0.9) 42%, rgba(241, 246, 255, 0.94) 100%)',
      glassDark: 'linear-gradient(160deg, color-mix(in srgb, #0f766e 7%, #ffffff), color-mix(in srgb, #155e75 5%, #f5f8fd))',
      ring: 'color-mix(in srgb, #0f766e 52%, transparent)',
      fieldBg: 'rgba(245, 248, 253, 0.96)',
      docsAccent: '#0f766e',
      docsAccentStrong: '#0d9488',
      docsAccentBorder: 'rgba(15, 118, 110, 0.22)',
      docsAccentSurface: 'rgba(15, 118, 110, 0.08)',
      docsAccentSurfaceStrong: 'rgba(15, 118, 110, 0.12)',
      docsAccentGlow: 'rgba(15, 118, 110, 0.12)',
      docsPreviewBorder: 'color-mix(in srgb, #0f766e 24%, rgba(25, 37, 64, 0.12))',
      docsPreviewBg: 'color-mix(in srgb, #0f766e 3%, #ffffff)',
      docsInlineCodeBg: 'color-mix(in srgb, #0f766e 4%, #f8fcff)',
      docsCodeChipBg: 'color-mix(in srgb, #0f766e 5%, #f8fcff)',
      docsCodeText: '#243048',
      docsTokenName: '#0f766e',
      docsTokenType: '#c789ff',
      docsTokenDefault: '#f2c94c',
      docsHeading: '#111b2c',
      docsBody: 'rgba(37, 49, 72, 0.68)',
      docsMuted: 'rgba(64, 79, 108, 0.32)',
      docsTableHead: 'rgba(45, 58, 82, 0.42)',
      docsTableDesc: 'rgba(40, 53, 78, 0.62)',
      docsRequired: '#ff7272',
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
    bg: '#030711',
    bgElevated: '#060c1a',
    text: 'rgba(244, 247, 255, 0.96)',
    textSoft: 'rgba(219, 225, 241, 0.7)',
    textMuted: 'rgba(182, 193, 214, 0.48)',
    borderSubtle: 'rgba(255, 255, 255, 0.12)',
    borderStrong: 'color-mix(in srgb, #5b8cff 48%, rgba(255, 255, 255, 0.28))',
    glassSurface: 'linear-gradient(145deg, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.03) 32%, rgba(255, 255, 255, 0.02) 100%)',
    glassDark: 'linear-gradient(160deg, color-mix(in srgb, #5b8cff 12%, #070d1c), color-mix(in srgb, #89a8ff 8%, #050914))',
    ring: 'color-mix(in srgb, #5b8cff 58%, transparent)',
    fieldBg: 'rgba(7, 13, 24, 0.8)',
    docsAccent: '#5b8cff',
    docsAccentStrong: '#75a2ff',
    docsAccentBorder: 'rgba(91, 140, 255, 0.34)',
    docsAccentSurface: 'rgba(91, 140, 255, 0.1)',
    docsAccentSurfaceStrong: 'rgba(91, 140, 255, 0.14)',
    docsAccentGlow: 'rgba(91, 140, 255, 0.18)',
    docsPreviewBorder: 'rgba(34, 63, 114, 0.95)',
    docsPreviewBg: '#0a1020',
    docsInlineCodeBg: '#0c1830',
    docsCodeChipBg: '#0c1932',
    docsCodeText: '#d8e2ff',
    docsTokenName: '#78a9ff',
    docsTokenType: '#c789ff',
    docsTokenDefault: '#f2c94c',
    docsHeading: '#f8fbff',
    docsBody: 'rgba(255, 255, 255, 0.42)',
    docsMuted: 'rgba(255, 255, 255, 0.18)',
    docsTableHead: 'rgba(255, 255, 255, 0.26)',
    docsTableDesc: 'rgba(255, 255, 255, 0.38)',
    docsRequired: '#ff7272',
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
      bg: '#f3f6fb',
      bgElevated: '#ffffff',
      text: 'rgba(17, 27, 44, 0.94)',
      textSoft: 'rgba(40, 52, 74, 0.72)',
      textMuted: 'rgba(72, 86, 112, 0.62)',
      borderSubtle: 'rgba(25, 37, 64, 0.12)',
      borderStrong: 'color-mix(in srgb, #2563eb 38%, rgba(25, 37, 64, 0.2))',
      glassSurface: 'linear-gradient(145deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 255, 0.9) 42%, rgba(241, 246, 255, 0.94) 100%)',
      glassDark: 'linear-gradient(160deg, color-mix(in srgb, #2563eb 7%, #ffffff), color-mix(in srgb, #1d4ed8 5%, #f5f8fd))',
      ring: 'color-mix(in srgb, #2563eb 52%, transparent)',
      fieldBg: 'rgba(245, 248, 253, 0.96)',
      docsAccent: '#2563eb',
      docsAccentStrong: '#3b82f6',
      docsAccentBorder: 'rgba(37, 99, 235, 0.22)',
      docsAccentSurface: 'rgba(37, 99, 235, 0.08)',
      docsAccentSurfaceStrong: 'rgba(37, 99, 235, 0.12)',
      docsAccentGlow: 'rgba(37, 99, 235, 0.12)',
      docsPreviewBorder: 'color-mix(in srgb, #2563eb 24%, rgba(25, 37, 64, 0.12))',
      docsPreviewBg: 'color-mix(in srgb, #2563eb 3%, #ffffff)',
      docsInlineCodeBg: 'color-mix(in srgb, #2563eb 4%, #f8faff)',
      docsCodeChipBg: 'color-mix(in srgb, #2563eb 5%, #f8faff)',
      docsCodeText: '#243048',
      docsTokenName: '#2563eb',
      docsTokenType: '#c789ff',
      docsTokenDefault: '#f2c94c',
      docsHeading: '#111b2c',
      docsBody: 'rgba(37, 49, 72, 0.68)',
      docsMuted: 'rgba(64, 79, 108, 0.32)',
      docsTableHead: 'rgba(45, 58, 82, 0.42)',
      docsTableDesc: 'rgba(40, 53, 78, 0.62)',
      docsRequired: '#ff7272',
    },
  },
  angular: {
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
    name: 'Angular',
    bg: '#030711',
    bgElevated: '#060c1a',
    text: 'rgba(244, 247, 255, 0.96)',
    textSoft: 'rgba(219, 225, 241, 0.7)',
    textMuted: 'rgba(182, 193, 214, 0.48)',
    borderSubtle: 'rgba(255, 255, 255, 0.12)',
    borderStrong: 'color-mix(in srgb, #5b8cff 48%, rgba(255, 255, 255, 0.28))',
    glassSurface: 'linear-gradient(145deg, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.03) 32%, rgba(255, 255, 255, 0.02) 100%)',
    glassDark: 'linear-gradient(160deg, color-mix(in srgb, #5b8cff 12%, #070d1c), color-mix(in srgb, #89a8ff 8%, #050914))',
    ring: 'color-mix(in srgb, #5b8cff 58%, transparent)',
    fieldBg: 'rgba(7, 13, 24, 0.8)',
    docsAccent: '#5b8cff',
    docsAccentStrong: '#75a2ff',
    docsAccentBorder: 'rgba(91, 140, 255, 0.34)',
    docsAccentSurface: 'rgba(91, 140, 255, 0.1)',
    docsAccentSurfaceStrong: 'rgba(91, 140, 255, 0.14)',
    docsAccentGlow: 'rgba(91, 140, 255, 0.18)',
    docsPreviewBorder: 'rgba(34, 63, 114, 0.95)',
    docsPreviewBg: '#0a1020',
    docsInlineCodeBg: '#0c1830',
    docsCodeChipBg: '#0c1932',
    docsCodeText: '#d8e2ff',
    docsTokenName: '#78a9ff',
    docsTokenType: '#c789ff',
    docsTokenDefault: '#f2c94c',
    docsHeading: '#f8fbff',
    docsBody: 'rgba(255, 255, 255, 0.42)',
    docsMuted: 'rgba(255, 255, 255, 0.18)',
    docsTableHead: 'rgba(255, 255, 255, 0.26)',
    docsTableDesc: 'rgba(255, 255, 255, 0.38)',
    docsRequired: '#ff7272',
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
      bg: '#f3f6fb',
      bgElevated: '#ffffff',
      text: 'rgba(17, 27, 44, 0.94)',
      textSoft: 'rgba(40, 52, 74, 0.72)',
      textMuted: 'rgba(72, 86, 112, 0.62)',
      borderSubtle: 'rgba(25, 37, 64, 0.12)',
      borderStrong: 'color-mix(in srgb, #2563eb 38%, rgba(25, 37, 64, 0.2))',
      glassSurface: 'linear-gradient(145deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 255, 0.9) 42%, rgba(241, 246, 255, 0.94) 100%)',
      glassDark: 'linear-gradient(160deg, color-mix(in srgb, #2563eb 7%, #ffffff), color-mix(in srgb, #1d4ed8 5%, #f5f8fd))',
      ring: 'color-mix(in srgb, #2563eb 52%, transparent)',
      fieldBg: 'rgba(245, 248, 253, 0.96)',
      docsAccent: '#2563eb',
      docsAccentStrong: '#3b82f6',
      docsAccentBorder: 'rgba(37, 99, 235, 0.22)',
      docsAccentSurface: 'rgba(37, 99, 235, 0.08)',
      docsAccentSurfaceStrong: 'rgba(37, 99, 235, 0.12)',
      docsAccentGlow: 'rgba(37, 99, 235, 0.12)',
      docsPreviewBorder: 'color-mix(in srgb, #2563eb 24%, rgba(25, 37, 64, 0.12))',
      docsPreviewBg: 'color-mix(in srgb, #2563eb 3%, #ffffff)',
      docsInlineCodeBg: 'color-mix(in srgb, #2563eb 4%, #f8faff)',
      docsCodeChipBg: 'color-mix(in srgb, #2563eb 5%, #f8faff)',
      docsCodeText: '#243048',
      docsTokenName: '#2563eb',
      docsTokenType: '#c789ff',
      docsTokenDefault: '#f2c94c',
      docsHeading: '#111b2c',
      docsBody: 'rgba(37, 49, 72, 0.68)',
      docsMuted: 'rgba(64, 79, 108, 0.32)',
      docsTableHead: 'rgba(45, 58, 82, 0.42)',
      docsTableDesc: 'rgba(40, 53, 78, 0.62)',
      docsRequired: '#ff7272',
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

  // Primary brand colors
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
  
  // Background colors
  root.style.setProperty('--bride-bg', palette.bg);
  root.style.setProperty('--bride-bg-elevated', palette.bgElevated);
  
  // Text colors
  root.style.setProperty('--bride-text', palette.text);
  root.style.setProperty('--bride-text-soft', palette.textSoft);
  root.style.setProperty('--bride-text-muted', palette.textMuted);
  
  // Border colors
  root.style.setProperty('--bride-border-subtle', palette.borderSubtle);
  root.style.setProperty('--bride-border-strong', palette.borderStrong);
  
  // Glass effects
  root.style.setProperty('--bride-glass-surface', palette.glassSurface);
  root.style.setProperty('--bride-glass-dark', palette.glassDark);
  
  // UI elements
  root.style.setProperty('--bride-ring', palette.ring);
  root.style.setProperty('--bride-field-bg', palette.fieldBg);
  
  // Documentation colors
  root.style.setProperty('--docs-accent', palette.docsAccent);
  root.style.setProperty('--docs-accent-strong', palette.docsAccentStrong);
  root.style.setProperty('--docs-accent-border', palette.docsAccentBorder);
  root.style.setProperty('--docs-accent-surface', palette.docsAccentSurface);
  root.style.setProperty('--docs-accent-surface-strong', palette.docsAccentSurfaceStrong);
  root.style.setProperty('--docs-accent-glow', palette.docsAccentGlow);
  root.style.setProperty('--docs-preview-border', palette.docsPreviewBorder);
  root.style.setProperty('--docs-preview-bg', palette.docsPreviewBg);
  root.style.setProperty('--docs-inline-code-bg', palette.docsInlineCodeBg);
  root.style.setProperty('--docs-code-chip-bg', palette.docsCodeChipBg);
  root.style.setProperty('--docs-code-text', palette.docsCodeText);
  root.style.setProperty('--docs-token-name', palette.docsTokenName);
  root.style.setProperty('--docs-token-type', palette.docsTokenType);
  root.style.setProperty('--docs-token-default', palette.docsTokenDefault);
  root.style.setProperty('--docs-heading', palette.docsHeading);
  root.style.setProperty('--docs-body', palette.docsBody);
  root.style.setProperty('--docs-muted', palette.docsMuted);
  root.style.setProperty('--docs-table-head', palette.docsTableHead);
  root.style.setProperty('--docs-table-desc', palette.docsTableDesc);
  root.style.setProperty('--docs-required', palette.docsRequired);
  
  root.style.setProperty('--bride-framework-name', `"${palette.name}"`);
  root.dataset.framework = framework;
  root.dataset.appearance = appearance;
}
