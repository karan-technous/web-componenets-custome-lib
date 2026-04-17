import { Directive } from '@angular/core';

@Directive({
  selector: '[uiPanelActions]',
  host: {
    slot: 'actions',
  },
})
export class UiPanelActionsDirective {}
