import {
  Component,
  ElementRef,
  forwardRef,
  input,
  output,
  effect,
  signal,
  viewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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
export class UiToggleComponent implements ControlValueAccessor {
  wc = viewChild<ElementRef>('wc');

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

    effect(() => {
      const el = this.wc()?.nativeElement as any;
      if (!el) return;

      el.checked = this.checked();
      el.disabled = this.disabled();
      el.size = this.size();
    });

    effect(() => {
      const el = this.wc()?.nativeElement as any;
      if (!el) return;

      const handler = (e: any) => {
        const value = e.detail;

        this.checked.set(value);
        this.onChange(value);
        this.changed.emit(value);
        this.onTouched();
      };

      el.addEventListener('toggleChange', handler);

      return () => el.removeEventListener('toggleChange', handler);
    });
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
