import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import '@ui-platform/web-components';
import { defineCustomElements } from '@ui-platform/web-components/loader';

defineCustomElements();
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
