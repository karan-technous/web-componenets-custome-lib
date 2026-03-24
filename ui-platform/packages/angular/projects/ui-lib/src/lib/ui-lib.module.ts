import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';

@NgModule({
  imports: [ButtonComponent, InputComponent],
  exports: [ButtonComponent, InputComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiLibModule {}
