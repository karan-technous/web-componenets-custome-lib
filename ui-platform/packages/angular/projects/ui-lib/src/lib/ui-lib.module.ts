import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { InputComponent } from './input/input.component';
import { UiCheckboxComponent } from './checkbox/checkbox.component';
import { UiToggleComponent } from './toggle/toggle.component';
import { BadgeComponent } from './badge/badge.component';
import { BadgeRemoveDirective } from './badge/badge-remove.directive';
import { UiBreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { UiPanelComponent } from './panel/panel.component';
import { UiPanelHeaderDirective } from './panel/panel-header.directive';
import { UiPanelFooterDirective } from './panel/panel-footer.directive';
import { UiPanelActionsDirective } from './panel/panel-actions.directive';

@NgModule({
  imports: [ButtonComponent, ButtonGroupComponent, InputComponent, UiCheckboxComponent, UiToggleComponent, BadgeComponent, BadgeRemoveDirective, UiBreadcrumbComponent, UiPanelComponent, UiPanelHeaderDirective, UiPanelFooterDirective, UiPanelActionsDirective],
  exports: [ButtonComponent, ButtonGroupComponent, InputComponent, UiCheckboxComponent, UiToggleComponent, BadgeComponent, BadgeRemoveDirective, UiBreadcrumbComponent, UiPanelComponent, UiPanelHeaderDirective, UiPanelFooterDirective, UiPanelActionsDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiLibModule {}
