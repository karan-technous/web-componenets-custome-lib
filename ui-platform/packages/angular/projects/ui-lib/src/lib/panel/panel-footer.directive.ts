import { Directive } from '@angular/core';

@Directive({
  selector: '[uiPanelFooter]',
  host: {
    slot: 'footer',
  },
})
export class UiPanelFooterDirective {}
