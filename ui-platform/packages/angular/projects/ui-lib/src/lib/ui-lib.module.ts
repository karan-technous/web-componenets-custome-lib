import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { UiToggleComponent } from './toggle/toggle.component';

@NgModule({
  imports: [ButtonComponent, InputComponent, UiToggleComponent],
  exports: [ButtonComponent, InputComponent, UiToggleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiLibModule {}
