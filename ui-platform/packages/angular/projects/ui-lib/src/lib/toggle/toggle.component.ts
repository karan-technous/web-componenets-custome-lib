import {
  Component,
  ElementRef,
  forwardRef,
  input,
  output,
  signal,
  effect,
  viewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ensureCustomElements } from '../register-custom-elements';

ensureCustomElements();

@Component({
  selector: 'ui-toggle-angular',
  standalone: true,
  templateUrl: './toggle.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiToggleComponent),
      multi: true,
    },
  ],
})
export class UiToggleComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  wc = viewChild<ElementRef>('wc');

  checked = input<boolean | undefined>(undefined);
  defaultChecked = input(false);

  disabled = input(false);
  size = input<'sm' | 'md' | 'lg'>('md');

  protected checkedState = signal(false);
  protected disabledState = signal(false);

  toggleChange = output<boolean>();

  private onChange = (value: boolean) => {};
  private onTouched = () => {};
  private cleanup?: () => void;

  constructor() {
    // disabled sync
    effect(() => {
      this.disabledState.set(this.disabled());
    });

    // controlled/uncontrolled sync
    effect(() => {
      if (this.checked() !== undefined) {
        this.checkedState.set(!!this.checked());
      } else {
        this.checkedState.set(!!this.defaultChecked());
      }
    });

    // push to WC reactively
    effect(() => {
      const el = this.wc()?.nativeElement;
      if (!el) return;

      el.checked = this.checkedState();
      el.disabled = this.disabledState();
      el.size = this.size();
    });
  }

  // =========================
  // LIFECYCLE
  // =========================
  ngAfterViewInit() {
    const el = this.wc()?.nativeElement;
    if (!el) return;

    const handler = (e: any) => {
      const value = !!e.detail;

      this.checkedState.set(value);

      // CVA
      this.onChange(value);
      this.onTouched();

      // output (same name as WC)
      this.toggleChange.emit(value);
    };

    el.addEventListener('toggleChange', handler);

    this.cleanup = () => {
      el.removeEventListener('toggleChange', handler);
    };
  }

  ngOnDestroy() {
    this.cleanup?.();
  }

  // =========================
  // CVA
  // =========================
  writeValue(value: boolean): void {
    this.checkedState.set(!!value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }
}