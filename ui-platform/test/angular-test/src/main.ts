import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { defineCustomElements } from '@ui-platform/web-components/loader';
// import { applyTheme, lightTheme } from '@ui-platform/core';
defineCustomElements();
// applyTheme(lightTheme);
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
