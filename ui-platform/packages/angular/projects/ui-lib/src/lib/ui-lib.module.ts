import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { InputComponent } from './input/input.component';
import { UiCheckboxComponent } from './checkbox/checkbox.component';
import { UiToggleComponent } from './toggle/toggle.component';
import { BadgeComponent } from './badge/badge.component';
import { BadgeRemoveDirective } from './badge/badge-remove.directive';

@NgModule({
  imports: [ButtonComponent, ButtonGroupComponent, InputComponent, UiCheckboxComponent, UiToggleComponent, BadgeComponent, BadgeRemoveDirective],
  exports: [ButtonComponent, ButtonGroupComponent, InputComponent, UiCheckboxComponent, UiToggleComponent, BadgeComponent, BadgeRemoveDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiLibModule {}
