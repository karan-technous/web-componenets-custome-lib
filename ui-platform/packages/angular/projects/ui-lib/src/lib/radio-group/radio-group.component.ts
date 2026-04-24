import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  Optional,
  Self,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { ensureCustomElements } from '../register-custom-elements';

ensureCustomElements();

@Component({
  selector: 'ui-radio-group-angular',
  standalone: true,
  templateUrl: './radio-group.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiRadioGroupComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UiRadioGroupComponent),
      multi: true,
    },
  ],
  host: {
    '[class.ng-invalid]': 'isInvalid()',
    '[class.ng-touched]': 'isTouched()',
    '[class.ng-dirty]': 'isDirty()',
  },
})
export class UiRadioGroupComponent implements ControlValueAccessor, Validator {
  constructor(@Optional() @Self() private readonly ngControl: NgControl | null) {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  value = signal<string>('');
  disabledState = signal(false);
  touched = signal(false);

  name = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  label = input<string | undefined>(undefined);
  orientation = input<'horizontal' | 'vertical'>('vertical');
  size = input<'sm' | 'md' | 'lg'>('md');
  radios = input<string | undefined>(undefined);

  uiChange = output<string>();
  changed = output<string>();

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  readonly isInvalid = computed(() => !!this.ngControl?.invalid);
  readonly isTouched = computed(() => this.touched() || !!this.ngControl?.touched);
  readonly isDirty = computed(() => !!this.ngControl?.dirty);

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required() && !control.value) {
      return { required: true };
    }
    return null;
  }

  handleChange(event: Event): void {
    const detail = (event as CustomEvent<string>).detail;
    this.value.set(detail);
    this.onChange(detail);
    this.changed.emit(detail);
  }

  handleBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}

@Directive({
  selector: '[uiRadioGroup]',
  standalone: true,
  host: {
    '[attr.data-ui-radio-group]': '"true"',
  },
})
export class UiRadioGroupDirective {}
