import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import '@ui-platform/web-components';
// import { defineCustomElements } from '@ui-platform/web-components/loader'; // this for production
import { defineCustomElements } from '../../../packages/web-components/dist/loader'; // for dev purpose
import { applyTheme, lightTheme } from '@ui-platform/core';
defineCustomElements();
applyTheme(lightTheme);
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
