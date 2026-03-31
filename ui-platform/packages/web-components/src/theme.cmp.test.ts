import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyTheme,
  darkTheme,
  defaultTheme,
  getThemeVariables,
  initializeTheme,
} from './theme';

const themeKeys = Object.keys(defaultTheme);

describe('theme variables in browser', () => {
  beforeEach(() => {
    for (const name of themeKeys) {
      document.documentElement.style.removeProperty(name);
    }
  });

  it('are exposed through getComputedStyle(document.documentElement)', () => {
    initializeTheme();

    const styles = getThemeVariables();

    expect(styles).not.toBeNull();
    expect(styles?.getPropertyValue('--ui-bg').trim()).toBe(defaultTheme['--ui-bg']);
    expect(styles?.getPropertyValue('--ui-primary').trim()).toBe(
      defaultTheme['--ui-primary'],
    );
  });

  it('reflect applied preset themes in computed styles', () => {
    applyTheme(darkTheme);

    const styles = getThemeVariables();

    expect(styles).not.toBeNull();
    expect(styles?.getPropertyValue('--ui-bg').trim()).toBe(darkTheme['--ui-bg']);
    expect(styles?.getPropertyValue('--ui-primary').trim()).toBe(
      darkTheme['--ui-primary'],
    );
  });
});
