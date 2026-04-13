import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
// import { defineCustomElements } from '@karan9186/web-components/loader';
// import { applyTheme, darkTheme } from 'karan9186/web-components';
// applyTheme(darkTheme);
// defineCustomElements();
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
