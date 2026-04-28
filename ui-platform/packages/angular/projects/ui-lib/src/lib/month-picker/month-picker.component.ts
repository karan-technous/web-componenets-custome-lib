import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  Provider,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ensureCustomElements } from '../register-custom-elements';

ensureCustomElements();

const MONTH_PICKER_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UiMonthPickerComponent),
  multi: true,
};

@Component({
  selector: 'ui-month-picker-angular',
  templateUrl: './month-picker.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MONTH_PICKER_VALUE_ACCESSOR],
  host: {
    '[class.ui-month-picker-ng]': 'true',
  },
})
export class UiMonthPickerComponent implements ControlValueAccessor {
  @ViewChild('wc') wcRef!: ElementRef<HTMLElement>;

  private readonly destroyRef = inject(DestroyRef);

  placeholder = input('Select month');
  disabled = input(false);
  required = input(false);
  minYear = input(2000);
  maxYear = input(2100);
  errorMessage = input<string | undefined>(undefined);

  valueChange = output<string>();

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    afterNextRender(() => {
      this.setupEventListeners();
    });
  }

  writeValue(value: string | null): void {
    if (this.wcRef) {
      (this.wcRef.nativeElement as any).value = value || '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.wcRef) {
      (this.wcRef.nativeElement as any).disabled = isDisabled;
    }
  }

  private setupEventListeners(): void {
    const el = this.wcRef?.nativeElement;

    if (!el) {
      return;
    }

    const valueChangeHandler = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      this.onChange(detail);
      this.valueChange.emit(detail);
    };

    const blurHandler = () => {
      this.onTouched();
    };

    el.addEventListener('valueChange', valueChangeHandler);
    el.addEventListener('blur', blurHandler);

    this.destroyRef.onDestroy(() => {
      el.removeEventListener('valueChange', valueChangeHandler);
      el.removeEventListener('blur', blurHandler);
    });
  }
}
