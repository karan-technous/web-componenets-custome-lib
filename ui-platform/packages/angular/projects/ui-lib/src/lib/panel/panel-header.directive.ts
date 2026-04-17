import { Directive } from '@angular/core';

@Directive({
  selector: '[uiPanelHeader]',
  host: {
    slot: 'header',
  },
})
export class UiPanelHeaderDirective {}
