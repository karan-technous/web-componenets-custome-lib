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
  // Inputs (same API)
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  label = input<string>('');

  // Internal state
  checked = signal(false);
  internalDisabled = signal(false);

  // Outputs (normalized API)
  onChangeEvent = output<boolean>();
  onBlurEvent = output<void>();

  // CVA callbacks
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  constructor() {
    // Sync disabled input
    effect(() => {
      this.internalDisabled.set(this.disabled());
    });
  }

  // CVA methods
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
    this.internalDisabled.set(isDisabled);
  }

  // Event handlers
  handleCheckboxChange(event: Event): void {
    const value = !!(event as CustomEvent<boolean>).detail;

    this.checked.set(value);
    this.onChange(value);
    this.onChangeEvent.emit(value);
  }

  handleBlur(): void {
    this.onTouched();
    this.onBlurEvent.emit();
  }
}
