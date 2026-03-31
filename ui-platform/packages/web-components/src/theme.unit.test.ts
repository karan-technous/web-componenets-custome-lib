import { beforeEach, describe, expect, it } from 'vitest';
import { defaultTheme, initializeTheme } from './theme';

describe('initializeTheme', () => {
  beforeEach(() => {
    for (const name of Object.keys(defaultTheme)) {
      document.documentElement.style.removeProperty(name);
    }
  });

  it('applies variables to document.documentElement', () => {
    initializeTheme();

    expect(document.documentElement.style.getPropertyValue('--ui-bg')).toBe(
      defaultTheme['--ui-bg'],
    );
    expect(document.documentElement.style.getPropertyValue('--ui-primary')).toBe(
      defaultTheme['--ui-primary'],
    );
  });
});
