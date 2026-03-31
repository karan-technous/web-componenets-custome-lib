import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyTheme,
  darkTheme,
  defaultTheme,
  initializeTheme,
  lightTheme,
} from './theme';

const themeKeys = Object.keys(defaultTheme);

describe('initializeTheme', () => {
  beforeEach(() => {
    for (const name of themeKeys) {
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

  it('applies preset themes through applyTheme', () => {
    applyTheme(darkTheme);

    expect(document.documentElement.style.getPropertyValue('--ui-bg')).toBe(
      darkTheme['--ui-bg'],
    );
    expect(document.documentElement.style.getPropertyValue('--ui-primary')).toBe(
      darkTheme['--ui-primary'],
    );
  });

  it('reapplies the default theme after custom variables were cleared', () => {
    applyTheme(darkTheme);

    for (const name of themeKeys) {
      document.documentElement.style.removeProperty(name);
    }

    initializeTheme();

    expect(document.documentElement.style.getPropertyValue('--ui-bg')).toBe(
      lightTheme['--ui-bg'],
    );
    expect(document.documentElement.style.getPropertyValue('--ui-primary')).toBe(
      lightTheme['--ui-primary'],
    );
  });
});
