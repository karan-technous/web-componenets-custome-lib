import { Component, ChangeDetectionStrategy, input, output, ElementRef, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'ui-badge-wrapper',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BadgeComponent,
      multi: true,
    },
  ],
})
export class BadgeComponent implements ControlValueAccessor {
  private hostElement = inject(ElementRef);

  // === INPUTS ===

  /** Visual style variant of the badge */
  variant = input<'solid' | 'soft' | 'outline'>('solid');

  /** Color theme of the badge */
  color = input<'primary' | 'success' | 'warning' | 'danger' | 'neutral'>('primary');

  /** Size of the badge */
  size = input<'sm' | 'md' | 'lg'>('md');

  /** Shape of the badge */
  shape = input<'rounded' | 'pill'>('rounded');

  /** Show as a dot indicator (status indicator) */
  dot = input(false);

  /** Show remove button */
  removable = input(false);

  /** Disable the badge */
  disabled = input(false);

  // === OUTPUTS ===

  /** Callback when remove button is clicked */
  remove = output<void>();

  // === CONTROL VALUE ACCESSOR ===

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private value: any = null;

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // The disabled input handles this via property binding
  }

  // === METHODS ===

  handleRemove(): void {
    this.remove.emit();
    this.onChange(null);
    this.onTouched();
  }
}
