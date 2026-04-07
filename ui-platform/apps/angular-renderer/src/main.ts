import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

const rootStyle = document.documentElement.style;
rootStyle.setProperty('--bridge-ui-primary', '#f43f5e');
rootStyle.setProperty('--bridge-ui-bg', '#ffffff');
rootStyle.setProperty('--bridge-ui-surface', '#ffffff');
rootStyle.setProperty('--bridge-ui-ring', 'rgba(244, 63, 94, 0.3)');

bootstrapApplication(AppComponent).catch((err) => console.error(err));
