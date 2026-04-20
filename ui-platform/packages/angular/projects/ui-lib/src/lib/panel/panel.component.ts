import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Optional, Self, computed, forwardRef, input, model, output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, ValidationErrors, Validator } from '@angular/forms';
import { ensureCustomElements } from '../register-custom-elements';

export type PanelVariant = 'default' | 'outlined' | 'elevated';
export type PanelSize = 'sm' | 'md' | 'lg';
export type PanelRounded = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

ensureCustomElements();

const PANEL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UiPanelComponent),
  multi: true,
};

const PANEL_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => UiPanelComponent),
  multi: true,
};

@Component({
  selector: 'ui-panel',
  standalone: true,
  template: `
    <ng-content select="[uiPanelHeader],[panel-header],[slot='header']"></ng-content>
    <ng-content select="[uiPanelActions],[panel-actions],[slot='actions']"></ng-content>
    <ng-content></ng-content>
    <ng-content select="[uiPanelFooter],[panel-footer],[slot='footer']"></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PANEL_VALUE_ACCESSOR, PANEL_VALIDATORS],
  host: {
    '[variant]': 'variant()',
    '[size]': 'size()',
    '[rounded]': 'rounded()',
    '[collapsible]': 'collapsible()',
    '[expanded]': 'expanded()',
    '[attr.data-controlled]': 'expanded() === undefined ? null : "true"',
    '[loading]': 'loading()',
    '[disabled]': 'disabled() || cvaDisabled',
    '[class.ng-invalid]': 'isInvalid()',
    '[class.ng-touched]': 'isTouched()',
    '[class.ng-dirty]': 'isDirty()',
    '(toggle)': 'handleToggle($event)',
    '(uiToggle)': 'handleLegacyToggle($event)',
  },
})
export class UiPanelComponent implements ControlValueAccessor, Validator {
  constructor(@Optional() @Self() private readonly ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // === INPUTS ===

  /** Visual variant of the panel */
  variant = input<PanelVariant>('default');

  /** Size of the panel */
  size = input<PanelSize>('md');

  /** Border radius scale */
  rounded = input<PanelRounded>('md');

  /** Whether the panel is collapsible */
  collapsible = input(false);

  /** Controlled expanded state (two-way binding) */
  expanded = model<boolean | undefined>(undefined);

  /** Whether the panel is in loading state */
  loading = input(false);

  /** Whether the panel is disabled */
  disabled = input(false);

  // === OUTPUTS ===

  /** Callback when panel is expanded/collapsed */
  panelUiToggle = output<{ expanded: boolean }>();
  panelToggle = output<boolean>();

  // === CVA INTERNALS ===

  public cvaDisabled = false;
  private _value = true;
  private _onChange: (value: boolean) => void = () => {};
  private _onTouched: () => void = () => {};
  private touched = false;

  readonly isInvalid = computed(() => !!this.ngControl?.invalid);
  readonly isTouched = computed(() => this.touched || !!this.ngControl?.touched);
  readonly isDirty = computed(() => !!this.ngControl?.dirty);

  // === CVA METHODS ===

  writeValue(value: boolean): void {
    this._value = value ?? true;
    if (typeof this.expanded() !== 'boolean') {
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
    this.cvaDisabled = isDisabled;
  }

  // === VALIDATOR METHOD ===

  validate(control: AbstractControl): ValidationErrors | null {
    // No validation by default
    return null;
  }

  // === EVENT HANDLERS ===

  handleToggle(event: Event): void {
    this.applyExpanded((event as CustomEvent<boolean>).detail);
  }

  private applyExpanded(nextExpanded: boolean): void {
    this._value = nextExpanded;
    this.expanded.set(nextExpanded);
    this._onChange(nextExpanded);
    this._onTouched();
    this.touched = true;
    this.panelToggle.emit(nextExpanded);
    this.panelUiToggle.emit({ expanded: nextExpanded });
  }

  handleLegacyToggle(event: Event): void {
    const nextExpanded = (event as CustomEvent<{ expanded: boolean }>).detail?.expanded;
    if (typeof nextExpanded !== 'boolean') {
      return;
    }
    this.applyExpanded(nextExpanded);
  }
}
