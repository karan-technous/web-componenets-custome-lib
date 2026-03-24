import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { InputComponent } from '@ui-platform/angular';

@Component({
  selector: 'app-root',
  imports: [FormsModule, InputComponent, JsonPipe],
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
