import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  Optional,
  Self,
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
  selector: 'ui-chips-input-angular',
  standalone: true,
  templateUrl: './chips-input.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiChipsInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UiChipsInputComponent),
      multi: true,
    },
  ],
  host: {
    '[class.ng-invalid]': 'isInvalid()',
    '[class.ng-touched]': 'isTouched()',
    '[class.ng-dirty]': 'isDirty()',
  },
})
export class UiChipsInputComponent implements ControlValueAccessor, Validator {
  constructor(@Optional() @Self() private readonly ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  value = signal<string[]>([]);
  disabledState = signal(false);
  touched = signal(false);

  placeholder = input<string>('Type and press Enter');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  errorMessage = input<string | undefined>(undefined);
  maxChips = input<number | undefined>(undefined);
  separator = input<string>(',');

  valueChange = output<string[]>();
  chipAdd = output<string>();
  chipRemove = output<string>();
  uiBlur = output<void>();

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  readonly isInvalid = computed(() => !!this.ngControl?.invalid);
  readonly isTouched = computed(() => this.touched() || !!this.ngControl?.touched);
  readonly isDirty = computed(() => !!this.ngControl?.dirty);
  readonly resolvedDisabled = computed(() => this.disabled() || this.disabledState());

  writeValue(value: string[] | null): void {
    this.value.set(value ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    if (this.required() && this.value().length === 0) {
      return { required: true };
    }

    return null;
  }

  handleValueChange(event: Event): void {
    const detail = (event as CustomEvent<string[]>).detail ?? [];

    this.value.set(detail);
    this.onChange(detail);
    this.valueChange.emit(detail);
  }

  handleChipAdd(event: Event): void {
    this.chipAdd.emit((event as CustomEvent<string>).detail);
  }

  handleChipRemove(event: Event): void {
    this.chipRemove.emit((event as CustomEvent<string>).detail);
  }

  handleBlur(): void {
    this.touched.set(true);
    this.onTouched();
    this.uiBlur.emit();
  }
}

@Directive({
  selector: '[uiChipsInput]',
  standalone: true,
  host: {
    '[attr.data-ui-chips-input]': '"true"',
  },
})
export class UiChipsInputDirective {}
