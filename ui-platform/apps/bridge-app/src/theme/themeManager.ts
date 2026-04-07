import type { Framework } from '../state/frameworkStore';

export function applyTheme(framework: Framework) {
  const root = document.documentElement;
  const themeMap: Record<Framework, string> = {
    react: '#3b82f6',
    angular: '#f43f5e',
    wc: '#10b981',
  };

  root.style.setProperty('--bridge-ui-primary', themeMap[framework]);
}
