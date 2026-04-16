import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  output,
  computed,
  contentChildren,
  afterNextRender,
  DestroyRef,
  forwardRef,
  Provider,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ensureCustomElements } from '../register-custom-elements';
import type {
  ButtonGroupOrientation,
  ButtonGroupSelectionMode,
  ButtonGroupVariant,
  ButtonGroupSize,
  ButtonGroupEventDetail,
  IconName,
  ButtonRounded,
} from '@karan9186/core';
import { ButtonComponent } from '../button/button.component';

ensureCustomElements();

/**
 * Modern Angular ButtonGroup Component
 * Standalone component with signals-based inputs/outputs
 * Wraps ui-button-group web component
 *
 * @usage
 * <ui-button-group-angular
 *   orientation="horizontal"
 *   selectionMode="single"
 *   [(value)]="selectedValue"
 *   (uiChange)="handleChange($event)"
 * >
 *   <ui-button-angular value="option1">Option 1</ui-button-angular>
 *   <ui-button-angular value="option2">Option 2</ui-button-angular>
 *   <ui-button-angular value="option3">Option 3</ui-button-angular>
 * </ui-button-group-angular>
 */
const BUTTON_GROUP_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ButtonGroupComponent),
  multi: true,
};

@Component({
  selector: 'ui-button-group-angular',
  templateUrl: 'button-group.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BUTTON_GROUP_VALUE_ACCESSOR],
  host: {
    '[attr.aria-disabled]': 'disabled()',
    '[class.ui-button-group-ng]': 'true',
    '[class.ui-button-group-ng--full-width]': 'fullWidth()',
    '[class.ui-button-group-ng--disabled]': 'disabled()',
  },
})
export class ButtonGroupComponent implements ControlValueAccessor {
  private el = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);

  // === CONTROL VALUE ACCESSOR ===

  private onChange: (value: string | string[] | null) => void = () => {};
  private onTouched: () => void = () => {};
  private isDisabled = false;

  // === SIGNAL INPUTS ===

  /** Variant inheritance for child buttons */
  variant = input<ButtonGroupVariant>('inherit');

  /** Size inheritance for child buttons */
  size = input<ButtonGroupSize>('inherit');

  /** Whether buttons are segmented */
  segmented = input<boolean>(false);

  /** Orientation of the button group */
  orientation = input<ButtonGroupOrientation>('horizontal');

  /** Gap between buttons */
  gap = input<'xs' | 'sm' | 'md' | 'lg' | 'none'>('md');

  /** Whether the group takes full width */
  fullWidth = input<boolean>(false);

  /** Whether the entire group is disabled */
  disabled = model<boolean>(false);

  /** Border radius size for the button group */
  rounded = input<ButtonRounded>('md');

  /** JSON string array of button objects with value, label, and optional button props */
  buttons = input<string>('');

  /** Selection mode for the button group */
  selectionMode = input<ButtonGroupSelectionMode>('none');

  // === BUTTON COMPONENT PROPS FOR INHERITANCE ===

  /** Whether child buttons are in loading state */
  buttonLoading = input<boolean>(false);

  /** Whether to enable click animation on child buttons (press effect) */
  buttonAnimated = input<boolean>(false);

  /** Whether child buttons should take full width */
  buttonFullWidth = input<boolean>(false);

  // === MODEL INPUT/OUTPUT ===

  /** Controlled value (selected button value(s)) */
  value = model<string | string[] | null>(null);

  // === OUTPUTS ===

  /** Emitted when selection changes */
  uiChange = output<ButtonGroupEventDetail>();

  /** Proxy for child button click events */
  uiClick = output<ButtonGroupEventDetail>();

  // === CONTENT CHILDREN ===

  /** Child button components */
  private buttonComponents = contentChildren(ButtonComponent);

  // === STATE ===

  private eventListeners: Array<{ event: string; handler: EventListener }> = [];

  // === LIFECYCLE ===

  constructor() {
    afterNextRender(() => {
      this.setupEventListeners();
    });

    inject(DestroyRef).onDestroy(() => {
      this.cleanupEventListeners();
    });
  }

  // === CONTROL VALUE ACCESSOR METHODS ===

  writeValue(value: string | string[] | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string | string[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.disabled.set(isDisabled);
  }

  // === PRIVATE METHODS ===

  private setupEventListeners(): void {
    const buttonGroup = this.el.nativeElement.querySelector('ui-button-group');
    if (!buttonGroup) return;

    // Change event
    const changeHandler = (e: CustomEvent<ButtonGroupEventDetail>) => {
      this.uiChange.emit(e.detail);
      this.value.set(e.detail.value);
      this.onChange(e.detail.value);
      this.onTouched();
    };
    buttonGroup.addEventListener('uiChange', changeHandler as EventListener);

    // Click event
    const clickHandler = (e: CustomEvent<ButtonGroupEventDetail>) => {
      this.uiClick.emit(e.detail);
    };
    buttonGroup.addEventListener('uiClick', clickHandler as EventListener);

    // Cleanup on destroy using DestroyRef
    this.destroyRef.onDestroy(() => {
      buttonGroup.removeEventListener('uiChange', changeHandler as EventListener);
      buttonGroup.removeEventListener('uiClick', clickHandler as EventListener);
    });
  }

  private cleanupEventListeners = (): void => {
    const buttonGroup = this.el.nativeElement as HTMLElement & {
      removeEventListener: (
        event: string,
        handler: EventListener,
        options?: EventListenerOptions,
      ) => void;
    };

    this.eventListeners.forEach(({ event, handler }) => {
      buttonGroup.removeEventListener(event, handler);
    });

    this.eventListeners = [];
  };

  private syncPropsToWebComponent(): void {
    // Props are synced via template binding in button-group.component.html
  }

  private applyButtonProps(): void {
    const currentButtons = this.buttonComponents();

    currentButtons.forEach((button: ButtonComponent, index: number) => {
      // Get button value from element
      const buttonElement = button['el']?.nativeElement;
      if (!buttonElement) return;

      const buttonValue = buttonElement.getAttribute('value');

      // Apply size if not inherit
      if (this.size() !== 'inherit') {
        buttonElement.setAttribute('size', this.size());
      }

      // Apply disabled state
      if (this.disabled()) {
        buttonElement.setAttribute('disabled', 'true');
      }

      // Apply segmented styling
      if (this.segmented()) {
        this.applyAttachedStyles(buttonElement, index);
      }
    });
  }

  private applyAttachedStyles(buttonElement: HTMLElement, index: number): void {
    const total = this.buttonComponents().length;
    const isFirst = index === 0;
    const isLast = index === total - 1;

    if (total > 1) {
      if (isFirst) {
        buttonElement.setAttribute('data-position', 'first');
      } else if (isLast) {
        buttonElement.setAttribute('data-position', 'last');
      } else {
        buttonElement.setAttribute('data-position', 'middle');
      }
    }
  }

  // === COMPUTED CLASSES ===

  getGroupClasses(): string {
    const classes = [
      'ui-button-group',
    ];

    classes.push(`ui-button-group--${this.orientation()}`);

    if (this.fullWidth()) {
      classes.push('ui-button-group--full-width');
    }

    if (this.segmented()) {
      classes.push('ui-button-group--segmented');
    }

    classes.push(`ui-button-group--gap-${this.gap()}`);

    classes.push(`ui-button-group--rounded-${this.rounded()}`);

    return classes.join(' ');
  }

  getGroupRole(): string {
    return 'group';
  }

  getGroupAriaProps(): Record<string, string> {
    return {};
  }
}

/**
 * Directive for using ui-button-group on native elements
 * @usage <div uiButtonGroup orientation="horizontal" selectionMode="single">
 *   <button uiButton value="option1">Option 1</button>
 *   <button uiButton value="option2">Option 2</button>
 * </div>
 */
@Directive({
  selector: '[uiButtonGroup]',
  standalone: true,
  host: {
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-segmented]': 'segmented()',
    '[attr.data-attached]': 'attached()',
    '[attr.data-full-width]': 'fullWidth()',
    '[attr.data-disabled]': 'disabled()',
    '[attr.data-selection-mode]': 'selectionMode()',
  },
})
export class UiButtonGroupDirective {
  orientation = input<ButtonGroupOrientation>('horizontal');
  variant = input<ButtonGroupVariant>('inherit');
  size = input<ButtonGroupSize>('inherit');
  segmented = input<boolean>(false);
  attached = input<boolean>(false);
  fullWidth = input<boolean>(false);
  disabled = input<boolean>(false);
  selectionMode = input<ButtonGroupSelectionMode>('none');
}
