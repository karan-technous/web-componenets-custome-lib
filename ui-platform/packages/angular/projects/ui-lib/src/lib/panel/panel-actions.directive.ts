import { Directive } from '@angular/core';

@Directive({
  selector: '[uiPanelActions],[panel-actions]',
  host: {
    slot: 'actions',
  },
})
export class UiPanelActionsDirective {}
