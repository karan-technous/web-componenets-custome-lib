import type { Framework } from '../state/frameworkStore';

export function applyTheme(framework: Framework) {
  const root = document.documentElement;

  if (framework === 'react') {
    root.style.setProperty('--bridge-ui-primary', '#3b82f6');
    root.style.setProperty('--bridge-ui-bg', '#f8fbff');
    root.style.setProperty('--bridge-ui-surface', '#ffffff');
    root.style.setProperty('--bridge-ui-sidebar', '#f5f9ff');
    root.style.setProperty('--bridge-ui-ring', 'rgba(59, 130, 246, 0.28)');
  }

  if (framework === 'angular') {
    root.style.setProperty('--bridge-ui-primary', '#e11d48');
    root.style.setProperty('--bridge-ui-bg', '#fff8f9');
    root.style.setProperty('--bridge-ui-surface', '#ffffff');
    root.style.setProperty('--bridge-ui-sidebar', '#fff4f6');
    root.style.setProperty('--bridge-ui-ring', 'rgba(225, 29, 72, 0.26)');
  }

  if (framework === 'wc') {
    root.style.setProperty('--bridge-ui-primary', '#111827');
    root.style.setProperty('--bridge-ui-bg', '#f8fafc');
    root.style.setProperty('--bridge-ui-surface', '#ffffff');
    root.style.setProperty('--bridge-ui-sidebar', '#f4f5f7');
    root.style.setProperty('--bridge-ui-ring', 'rgba(17, 24, 39, 0.24)');
  }
}
