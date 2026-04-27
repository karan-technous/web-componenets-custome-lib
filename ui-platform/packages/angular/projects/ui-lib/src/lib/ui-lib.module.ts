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
import { UiDatePickerComponent, UiDatePickerDirective } from './date-picker/date-picker.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { UiCheckboxDropdownWrapper } from './checkbox-dropdown/checkbox-dropdown.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { UiTooltipComponent, UiTooltipDirective } from './tooltip/tooltip.component';

@NgModule({
  imports: [ButtonComponent, ButtonGroupComponent, InputComponent, UiCheckboxComponent, UiToggleComponent, BadgeComponent, BadgeRemoveDirective, UiBreadcrumbComponent, UiPanelComponent, UiPanelHeaderDirective, UiPanelFooterDirective, UiPanelActionsDirective, UiDatePickerComponent, UiDatePickerDirective, DropdownComponent, UiCheckboxDropdownWrapper, SpinnerComponent, UiTooltipComponent, UiTooltipDirective],
  exports: [ButtonComponent, ButtonGroupComponent, InputComponent, UiCheckboxComponent, UiToggleComponent, BadgeComponent, BadgeRemoveDirective, UiBreadcrumbComponent, UiPanelComponent, UiPanelHeaderDirective, UiPanelFooterDirective, UiPanelActionsDirective, UiDatePickerComponent, UiDatePickerDirective, DropdownComponent, UiCheckboxDropdownWrapper, SpinnerComponent, UiTooltipComponent, UiTooltipDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiLibModule {}
