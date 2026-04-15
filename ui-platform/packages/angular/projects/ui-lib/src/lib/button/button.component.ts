import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  Provider,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ensureCustomElements } from '../register-custom-elements';
import type {
  ButtonVariant,
  ButtonSize,
  ButtonRounded,
  ButtonEventDetail,
  IconName,
} from '@karan9186/core';

ensureCustomElements();

// === PROVIDER FACTORY ===
export const UI_BUTTON_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ButtonComponent),
  multi: true,
};

/**
 * Modern Angular Button Component
 * Standalone component with signals-based inputs/outputs
 * Wraps ui-button web component
 *
 * @usage
 * <ui-button-angular
 *   variant="default"
 *   size="md"
 *   [disabled]="isDisabled"
 *   [loading]="isLoading"
 *   [animated]="true"
 *   rounded="lg"
 *   (uiClick)="handleClick($event)"
 * >
 *   <span icon-left><lucide-icon name="plus"></lucide-icon></span>
 *   Click Me
 *   <span icon-right><lucide-icon name="arrow-right"></lucide-icon></span>
 * </ui-button-angular>
 */
@Component({
  selector: 'ui-button-angular',
  templateUrl: './button.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UI_BUTTON_VALUE_ACCESSOR],
  host: {
    '[attr.aria-disabled]': 'disabled()',
    '[class.ui-button-ng]': 'true',
    '[class.ui-button-ng--full-width]': 'fullWidth()',
    '[class.ui-button-ng--loading]': 'loading()',
    '[class.ui-button-ng--disabled]': 'disabled()',
  },
})
export class ButtonComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};
  private eventListeners: (() => void)[] = [];

  // === SIGNAL INPUTS ===

  /** Visual style variant */
  variant = input<ButtonVariant>('default');

  /** Size of the button */
  size = input<ButtonSize>('default');

  /** Whether the button is disabled */
  disabled = model<boolean>(false);

  /** Whether the button is in loading state */
  loading = model<boolean>(false);

  /** Whether the button should take full width */
  fullWidth = input<boolean>(false);

  /** Whether to enable click animation */
  animated = input<boolean>(false);

  /** Border radius size */
  rounded = input<ButtonRounded>('md');

  /** Icon name for left side (from lucide icons) */
  iconLeft = input<IconName | undefined>(undefined);

  /** Icon name for right side (from lucide icons) */
  iconRight = input<IconName | undefined>(undefined);

  /** Icon name for center (for icon-only buttons) */
  icon = input<IconName | undefined>(undefined);

  // === OUTPUTS ===

  /** Emitted when button is clicked */
  uiClick = output<ButtonEventDetail>();

  /** Emitted when button receives focus */
  uiFocus = output<void>();

  /** Emitted when button loses focus */
  uiBlur = output<void>();

  // === LIFECYCLE ===

  ngOnInit(): void {
    this.setupEventListeners();
    this.syncPropsToWebComponent();
  }

  ngOnDestroy(): void {
    this.eventListeners.forEach((remove) => remove());
  }

  // === CONTROL VALUE ACCESSOR ===

  writeValue(value: unknown): void {
    // Button doesn't have a value, but we implement this for form integration
    // Could be used for toggle buttons in the future
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // === PRIVATE METHODS ===

  private setupEventListeners(): void {
    const button = this.el.nativeElement.querySelector('ui-button');
    if (!button) return;

    // Click event
    const clickHandler = (e: CustomEvent<ButtonEventDetail>) => {
      this.onTouched();
      this.uiClick.emit(e.detail);
      this.onChange(true); // Signal that button was clicked
    };
    button.addEventListener('uiClick', clickHandler as EventListener);
    this.eventListeners.push(() =>
      button.removeEventListener('uiClick', clickHandler as EventListener)
    );

    // Focus event
    const focusHandler = () => this.uiFocus.emit();
    button.addEventListener('uiFocus', focusHandler);
    this.eventListeners.push(() =>
      button.removeEventListener('uiFocus', focusHandler)
    );

    // Blur event
    const blurHandler = () => {
      this.onTouched();
      this.uiBlur.emit();
    };
    button.addEventListener('uiBlur', blurHandler);
    this.eventListeners.push(() =>
      button.removeEventListener('uiBlur', blurHandler)
    );
  }

  private syncPropsToWebComponent(): void {
    // Props are synced via template binding in button.component.html
  }
}

/**
 * Directive for using ui-button on native button elements
 * @usage <button uiButton variant="default" size="md">Click Me</button>
 */
@Directive({
  selector: 'button[uiButton], a[uiButton]',
  standalone: true,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-disabled]': 'disabled()',
    '[attr.data-loading]': 'loading()',
    '[attr.data-animated]': 'animated()',
    '[attr.data-rounded]': 'rounded()',
  },
})
export class UiButtonDirective {
  variant = input<ButtonVariant>('default');
  size = input<ButtonSize>('default');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  animated = input<boolean>(false);
  rounded = input<ButtonRounded>('md');
  iconLeft = input<IconName | undefined>(undefined);
  iconRight = input<IconName | undefined>(undefined);
  icon = input<IconName | undefined>(undefined);
}
