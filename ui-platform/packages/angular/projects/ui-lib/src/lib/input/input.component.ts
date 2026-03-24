import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-input-angular',
  templateUrl: './input.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  isDisabled: boolean = false;

  value: string = '';

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleInput(event: any) {
    const value = event.detail;
    this.value = value;
    this.onChange(value);
  }

  handleBlur() {
    this.onTouched();
  }
}
