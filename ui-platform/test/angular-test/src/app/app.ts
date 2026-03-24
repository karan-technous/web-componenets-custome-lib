import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { InputComponent } from '@ui-platform/angular';
import { InputTest } from './test/input-test/input-test';

@Component({
  selector: 'app-root',
  imports: [FormsModule, InputComponent, JsonPipe, InputTest],
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
