import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { InputComponent } from '@ui-platform/angular';
import { UiToggleComponent } from '@ui-platform/angular';
import { ButtonTestComponent } from './test/button-test/button-test';

@Component({
  selector: 'app-root',
  imports: [InputComponent, ButtonTestComponent, UiToggleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-test');
  name: string = '';

  onChange(e: Event | any) {
    console.log(e.detail, 'event===');
  }
}
