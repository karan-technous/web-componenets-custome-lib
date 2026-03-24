export type Theme = {
  '--ui-primary': string;
  '--ui-primary-hover': string;
  '--ui-bg': string;
  '--ui-text': string;
  '--ui-border-radius': string;
};

export const lightTheme: Theme = {
  '--ui-primary': '#3b82f6',
  '--ui-primary-hover': '#2563eb',
  '--ui-bg': '#ffffff',
  '--ui-text': '#111827',
  '--ui-border-radius': '6px',
};

export const darkTheme: Theme = {
  '--ui-primary': '#60a5fa',
  '--ui-primary-hover': '#3b82f6',
  '--ui-bg': '#1f2937',
  '--ui-text': '#f9fafb',
  '--ui-border-radius': '6px',
};