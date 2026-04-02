import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
// import { applyTheme, darkTheme } from 'karan9186/web-components';
// applyTheme(darkTheme);
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
