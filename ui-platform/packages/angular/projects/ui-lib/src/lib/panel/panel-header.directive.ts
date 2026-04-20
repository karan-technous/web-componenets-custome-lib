import { Directive } from '@angular/core';

@Directive({
  selector: '[uiPanelHeader],[panel-header]',
  host: {
    slot: 'header',
  },
})
export class UiPanelHeaderDirective {}
