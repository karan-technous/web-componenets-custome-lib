import { Component, ChangeDetectionStrategy, input, output, CUSTOM_ELEMENTS_SCHEMA, forwardRef, model, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';

export type PanelVariant = 'default' | 'outlined' | 'elevated';
export type PanelSize = 'sm' | 'md' | 'lg';

export interface PanelToggleEventDetail {
  expanded: boolean;
}

const PANEL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UiPanelComponent),
  multi: true,
};

const PANEL_VALIDATORS: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => UiPanelComponent),
  multi: true,
};

@Component({
  selector: 'ui-panel',
  standalone: true,
  template: `
    <ng-content select="[slot='header']"></ng-content>
    <ng-content select="[slot='actions']"></ng-content>
    <ng-content></ng-content>
    <ng-content select="[slot='footer']"></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PANEL_VALUE_ACCESSOR, PANEL_VALIDATORS],
  host: {
    '[variant]': 'variant()',
    '[size]': 'size()',
    '[collapsible]': 'collapsible()',
    '[expanded]': 'expanded()',
    '[loading]': 'loading()',
    '[disabled]': 'disabled() || _disabled',
    '(uiToggle)': 'handleUiToggle($event)',
  },
})
export class UiPanelComponent implements ControlValueAccessor, Validator {

  // === INPUTS ===

  /** Visual variant of the panel */
  variant = input<PanelVariant>('default');

  /** Size of the panel */
  size = input<PanelSize>('md');

  /** Whether the panel is collapsible */
  collapsible = input(false);

  /** Controlled expanded state (two-way binding) */
  expanded = model<boolean | undefined>(undefined);

  /** Default expanded state (uncontrolled) */
  defaultExpanded = input(true);

  /** Whether the panel is in loading state */
  loading = input(false);

  /** Whether the panel is disabled */
  disabled = input(false);

  // === OUTPUTS ===

  /** Callback when panel is expanded/collapsed */
  uiToggle = output<PanelToggleEventDetail>();

  // === CVA INTERNALS ===

  public _disabled = false;
  private _value: boolean = true;
  private _onChange: (value: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  // === CVA METHODS ===

  writeValue(value: boolean): void {
    this._value = value ?? true;
    if (this.expanded() === undefined) {
      this.expanded.set(this._value);
    }
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  // === VALIDATOR METHOD ===

  validate(control: AbstractControl): ValidationErrors | null {
    // No validation by default
    return null;
  }

  // === EVENT HANDLERS ===

  handleUiToggle(event: any): void {
    const { expanded } = event.detail;
    this._value = expanded;
    this.expanded.set(expanded);
    this._onChange(expanded);
    this.uiToggle.emit(event.detail);
  }
}
