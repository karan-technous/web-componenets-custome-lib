import { Element } from '@stencil/core';
import { syncThemeToShadowRoot } from '../../theme';

export abstract class BaseComponent {
  @Element() element: HTMLElement;

  componentWillLoad() {
    if (this.element && this.element.shadowRoot) {
      syncThemeToShadowRoot(this.element.shadowRoot);
    }
  }
}
