import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { UiCheckboxComponent } from './checkbox/checkbox.component';
import { UiToggleComponent } from './toggle/toggle.component';

@NgModule({
  imports: [ButtonComponent, InputComponent, UiCheckboxComponent, UiToggleComponent],
  exports: [ButtonComponent, InputComponent, UiCheckboxComponent, UiToggleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiLibModule {}
