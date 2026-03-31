import { beforeEach, describe, expect, it } from 'vitest';
import { defaultTheme, getThemeVariables, initializeTheme } from './theme';

describe('theme variables in browser', () => {
  beforeEach(() => {
    for (const name of Object.keys(defaultTheme)) {
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
});
