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

type DateRange = { start: Date; end: Date };
type DatePickerValue = Date | DateRange | null;

ensureCustomElements();

@Component({
  selector: 'ui-date-picker-angular',
  standalone: true,
  templateUrl: './date-picker.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiDatePickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UiDatePickerComponent),
      multi: true,
    },
  ],
  host: {
    '[class.ng-invalid]': 'isInvalid()',
    '[class.ng-touched]': 'isTouched()',
    '[class.ng-dirty]': 'isDirty()',
  },
})
export class UiDatePickerComponent implements ControlValueAccessor, Validator {
  constructor(@Optional() @Self() private readonly ngControl: NgControl | null) {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  value = signal<DatePickerValue>(null);
  disabledState = signal(false);
  touched = signal(false);

  mode = input<'single' | 'range'>('single');
  placeholder = input<string>('Enter date (e.g. 1 Jan 2020)');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  readonly = input<boolean>(false);
  open = input<boolean | undefined>(undefined);
  defaultOpen = input<boolean>(false);
  minDate = input<Date | undefined>(undefined);
  maxDate = input<Date | undefined>(undefined);
  minYear = input<number | undefined>(undefined);
  maxYear = input<number | undefined>(undefined);
  showIcon = input<boolean>(true);
  iconOnly = input<boolean>(false);
  icon = input<string | undefined>(undefined);
  label = input<string | undefined>(undefined);
  showActions = input<boolean>(false);
  search = input<boolean>(false);
  customParsers = input<any[] | undefined>(undefined);
  debounce = input<number>(220);

  uiInputChange = output<string>();
  uiOpenChange = output<boolean>();
  uiInvalidInput = output<string>();
  uiApply = output<Date | DateRange>();
  uiCancel = output<void>();
  uiFocus = output<void>();
  uiBlur = output<void>();
  changed = output<Date | DateRange>();

  private onChange: (value: DatePickerValue) => void = () => {};
  private onTouched: () => void = () => {};

  readonly isInvalid = computed(() => !!this.ngControl?.invalid);
  readonly isTouched = computed(() => this.touched() || !!this.ngControl?.touched);
  readonly isDirty = computed(() => !!this.ngControl?.dirty);

  writeValue(value: DatePickerValue): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: DatePickerValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    return null;
  }

  handleChange(event: Event): void {
    const detail = (event as CustomEvent<Date | DateRange>).detail;
    this.value.set(detail);
    this.onChange(detail);
    this.changed.emit(detail);
  }

  handleInputChange(event: Event): void {
    this.uiInputChange.emit((event as CustomEvent<string>).detail);
  }

  handleOpenChange(event: Event): void {
    this.uiOpenChange.emit(!!(event as CustomEvent<boolean>).detail);
  }

  handleApply(event: Event): void {
    this.uiApply.emit((event as CustomEvent<Date | DateRange>).detail);
  }

  handleCancel(): void {
    this.uiCancel.emit();
  }

  handleInvalidInput(event: Event): void {
    this.uiInvalidInput.emit((event as CustomEvent<string>).detail);
  }

  handleFocus(): void {
    this.uiFocus.emit();
  }

  handleBlur(): void {
    this.touched.set(true);
    this.onTouched();
    this.uiBlur.emit();
  }
}

@Directive({
  selector: '[uiDatePicker]',
  standalone: true,
  host: {
    '[attr.data-ui-date-picker]': '"true"',
  },
})
export class UiDatePickerDirective {}
