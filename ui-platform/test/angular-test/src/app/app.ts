import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@karan9186/angular';
import { UiCheckboxComponent } from '@karan9186/angular';
import { UiToggleComponent } from '@karan9186/angular';
import { ButtonTestComponent } from './test/button-test/button-test';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    InputComponent,
    UiCheckboxComponent,
    ButtonTestComponent,
    UiToggleComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-test');
  name: string = '';
  checkboxValue = true;
  checkboxDisabled = false;

  onChange(e: Event | any) {
    console.log(e.detail, 'event===');
  }
}
