import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootStyle = document.documentElement.style;
rootStyle.setProperty('--bridge-ui-primary', '#3b82f6');
rootStyle.setProperty('--bridge-ui-bg', '#ffffff');
rootStyle.setProperty('--bridge-ui-surface', '#ffffff');
rootStyle.setProperty('--bridge-ui-ring', 'rgba(59, 130, 246, 0.3)');

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
