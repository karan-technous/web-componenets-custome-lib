import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { applyTheme, lightTheme, darkTheme } from '@karan9186/core';

// Apply core theme based on appearance from URL
const params = new URLSearchParams(window.location.search);
const appearance = params.get('appearance') === 'light' ? 'light' : 'dark';
const coreTheme = appearance === 'light' ? lightTheme : darkTheme;
applyTheme(coreTheme);

const rootStyle = document.documentElement.style;
rootStyle.setProperty('--bridge-ui-primary', '#f43f5e');
rootStyle.setProperty('--bridge-ui-bg', appearance === 'light' ? '#ffffff' : '#0b1020');
rootStyle.setProperty('--bridge-ui-surface', appearance === 'light' ? '#ffffff' : '#12182a');
rootStyle.setProperty('--bridge-ui-ring', 'rgba(244, 63, 94, 0.3)');

// Listen for theme changes from parent
window.addEventListener('message', (event) => {
  if (event.data?.type === 'UPDATE_THEME') {
    const newAppearance = event.data.appearance === 'light' ? 'light' : 'dark';
    const newTheme = newAppearance === 'light' ? lightTheme : darkTheme;
    applyTheme(newTheme);
    rootStyle.setProperty('--bridge-ui-bg', newAppearance === 'light' ? '#ffffff' : '#0b1020');
    rootStyle.setProperty('--bridge-ui-surface', newAppearance === 'light' ? '#ffffff' : '#12182a');
  }
});

bootstrapApplication(AppComponent).catch((err) => console.error(err));
