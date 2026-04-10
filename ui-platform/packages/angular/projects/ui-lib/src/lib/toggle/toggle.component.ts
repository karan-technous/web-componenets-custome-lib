import {
  Component,
  ElementRef,
  forwardRef,
  input,
  output,
  signal,
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

  size = input<'sm' | 'md' | 'lg'>('md');
  disabledInput = input(false);
  defaultChecked = input(false);

  checked = signal(false);
  disabled = signal(false);

  changed = output<boolean>();

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  private cleanup?: () => void;

  ngAfterViewInit() {
    const el = this.wc()?.nativeElement as any;
    if (!el) return;

    // initial
    el.checked = this.checked() ?? this.defaultChecked();
    el.disabled = this.disabledInput();
    el.size = this.size();

    // listener (ONLY ONCE)
    const handler = (e: any) => {
      const value = e.detail;

      this.checked.set(value);
      this.onChange(value);
      this.changed.emit(value);
      this.onTouched();
    };

    el.addEventListener('toggleChange', handler);

    this.cleanup = () => {
      el.removeEventListener('toggleChange', handler);
    };
  }

  ngOnDestroy() {
    this.cleanup?.();
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}