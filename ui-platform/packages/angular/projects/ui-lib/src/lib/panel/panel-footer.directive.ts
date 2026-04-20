import { Directive } from '@angular/core';

@Directive({
  selector: '[uiPanelFooter],[panel-footer]',
  host: {
    slot: 'footer',
  },
})
export class UiPanelFooterDirective {}
