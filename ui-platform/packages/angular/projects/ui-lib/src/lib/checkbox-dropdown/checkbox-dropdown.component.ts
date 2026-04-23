import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  computed,
  effect,
  input,
  output,
  AfterViewInit,
  forwardRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'ui-checkbox-dropdown-angular',
  templateUrl: './checkbox-dropdown.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiCheckboxDropdownWrapper),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCheckboxDropdownWrapper
  implements ControlValueAccessor, AfterViewInit
{
  @ViewChild('wc', { static: true }) wc!: ElementRef;

  // =====================
  // Signal Inputs (Angular v21)
  // =====================
  label = input<string>();
  placeholder = input('Select...');
  supportingText = input<string>();

  disabled = input(false);
  required = input(false);
  loading = input(false);
  showAvatar = input(false);
  private cvaDisabled = signal(false);
  disabledSig = computed(() => this.disabled() || this.cvaDisabled());
  errorMessage = input<string>();
  options = input<any[]>([]);
  showSelectAll = input(true);
  // =====================
  // Signal Output
  // =====================
  valueChange = output<string[]>();

  // =====================
  // Internal State
  // =====================
  private valueSig = signal<string[]>([]);

  // =====================
  // CVA bridge
  // =====================
  private onChange = (v: string[]) => {};
  private onTouched = () => {};

  writeValue(value: string[]): void {
    this.valueSig.set(value || []);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  // =====================
  // Lifecycle
  // =====================
  constructor(private cd: ChangeDetectorRef) {
    // sync value → web component
    effect(() => {
      if (this.wc) {
        this.wc.nativeElement.value = this.valueSig();
      }
    });
  }

  ngAfterViewInit() {
    const el = this.wc.nativeElement;

    // WC → Angular
    el.addEventListener('valueChange', (e: any) => {
      const val = e.detail;

      this.valueSig.set(val);

      // CVA
      this.onChange(val);

      // Signal Output
      this.valueChange.emit(val);

      this.cd.markForCheck();
    });

    el.addEventListener('blur', () => {
      this.onTouched();
    });
  }
}