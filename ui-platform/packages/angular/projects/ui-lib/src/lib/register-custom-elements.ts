import { initializeTheme } from '@karan9186/web-components';
import { defineCustomElements } from '@karan9186/web-components/loader';

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
