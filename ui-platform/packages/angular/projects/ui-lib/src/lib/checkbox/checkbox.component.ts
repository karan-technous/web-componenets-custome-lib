import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ensureCustomElements } from '../register-custom-elements';

ensureCustomElements();

@Component({
  selector: 'ui-checkbox-angular',
  standalone: true,
  templateUrl: './checkbox.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiCheckboxComponent),
      multi: true,
    },
  ],
})
export class UiCheckboxComponent implements ControlValueAccessor {
  size = input<'sm' | 'md' | 'lg'>('md');
  disabledInput = input(false);

  checked = signal(false);
  disabled = signal(false);

  changed = output<boolean>();

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  constructor() {
    effect(() => {
      this.disabled.set(this.disabledInput());
    });
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleCheckboxChange(event: CustomEvent<boolean>): void {
    const value = !!event.detail;
    this.checked.set(value);
    this.onChange(value);
    this.changed.emit(value);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
