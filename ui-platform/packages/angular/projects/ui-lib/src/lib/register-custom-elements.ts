import { initializeTheme } from '@ui-platform/web-components';
import { defineCustomElements } from '@ui-platform/web-components/loader';

let customElementsRegistered = false;

export function ensureCustomElements() {
  initializeTheme();

  if (
    customElementsRegistered ||
    typeof window === 'undefined' ||
    typeof customElements === 'undefined'
  ) {
    return;
  }

  customElementsRegistered = true;
  void defineCustomElements();
}
