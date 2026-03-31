import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { initTheme } from './theme-init';

@NgModule({
  imports: [ButtonComponent, InputComponent],
  exports: [ButtonComponent, InputComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initTheme,
      multi: true,
    },
  ],
})
export class UiLibModule {}
