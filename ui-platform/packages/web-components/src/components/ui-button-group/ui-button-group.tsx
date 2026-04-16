import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
  Listen,
  Watch,
} from '@stencil/core';
import { BaseComponent } from '../base/base-component';
import type {
  ButtonGroupOrientation,
  ButtonGroupSelectionMode,
  ButtonGroupVariant,
  ButtonGroupSize,
  ButtonGroupEventDetail,
  ButtonVariant,
  ButtonSize,
  ButtonRounded,
  IconName,
} from '@karan9186/core';
import {
  isButtonSelected,
  computeNewSelectedValue,
  BUTTON_GROUP_DEFAULTS,
} from '@karan9186/core';

/**
 * UI ButtonGroup Component
 * Groups buttons together with layout control and selection logic
 * Composes existing Button components without duplicating logic
 *
 * @slot default - Button elements to be grouped
 *
 * @event uiChange - Emitted when selection changes (if selectionMode is not 'none')
 * @event uiClick - Proxy for child button click events (optional)
 */
@Component({
  tag: 'ui-button-group',
  styleUrl: 'ui-button-group.css',
  shadow: true,
})
export class UiButtonGroup extends BaseComponent {
  @Element() hostElement!: HTMLElement;

  // === PROPS ===

  /**
   * Variant inheritance for child buttons
   * @default 'inherit'
   */
  @Prop({ reflect: true }) variant: ButtonGroupVariant = 'inherit';

  /**
   * Size inheritance for child buttons
   * @default 'inherit'
   */
  @Prop({ reflect: true }) size: ButtonGroupSize = 'inherit';

  /**
   * Whether buttons are segmented (no gaps, shared borders)
   * @default false
   */
  @Prop({ reflect: true }) segmented: boolean = false;

  /**
   * Orientation of the button group
   * @default 'horizontal'
   */
  @Prop({ reflect: true }) orientation: ButtonGroupOrientation = 'horizontal';

  /**
   * Gap between buttons
   * @default 'md'
   */
  @Prop({ reflect: true }) gap: 'xs' | 'sm' | 'md' | 'lg' | 'none' = 'md';

  /**
   * Whether the group takes full width
   * @default false
   */
  @Prop({ reflect: true }) fullWidth: boolean = false;

  /**
   * Whether the entire group is disabled
   * @default false
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * Border radius size for the button group
   * @default 'md'
   */
  @Prop({ reflect: true }) rounded: ButtonRounded = 'md';

  /**
   * JSON string array of button objects with value, label, and optional button props
   * If provided, buttons will be rendered automatically. Otherwise, use slot.
   */
  @Prop() buttons?: string;

  /**
   * Whether child buttons are in loading state
   * @default false
   */
  @Prop({ reflect: true }) buttonLoading: boolean = false;

  /**
   * Whether to enable click animation on child buttons (press effect)
   * @default false
   */
  @Prop({ reflect: true }) buttonAnimated: boolean = false;

  /**
   * Whether child buttons should take full width
   * @default false
   */
  @Prop({ reflect: true }) buttonFullWidth: boolean = false;

  /**
   * Selection mode for the button group
   * @default 'none'
   */
  @Prop({ reflect: true }) selectionMode: 'none' | 'single' | 'multiple' = 'none';

  /**
   * Current selected value(s)
   * - For single mode: string
   * - For multiple mode: string[]
   * - For none mode: undefined
   */
  @Prop({ mutable: true }) value?: string | string[];

  // === EVENTS ===

  /**
   * Emitted when value changes
   */
  @Event({ bubbles: true, composed: true }) valueChange!: EventEmitter<string | string[]>;

  /**
   * Emitted when selection changes (legacy event for backward compatibility)
   */
  @Event({ bubbles: true, composed: true }) uiChange!: EventEmitter<ButtonGroupEventDetail>;

  /**
   * Proxy for child button click events
   */
  @Event({ bubbles: true, composed: true }) uiClick!: EventEmitter<ButtonGroupEventDetail>;

  // === STATE ===

  @State() buttonElements: HTMLElement[] = [];
  @State() internalValue: string[] = [];

  // === PRIVATE METHODS ===

  private getButtonValue(button: HTMLElement): string | null {
    return button.getAttribute('value') || button.getAttribute('data-value') || null;
  }

  private updateButtons(): void {
    // Query all ui-button children
    const buttonElements = Array.from(
      this.hostElement.querySelectorAll(':scope > ui-button')
    ) as HTMLElement[];

    this.buttonElements = buttonElements;
    this.applyButtonProps();
  }

  private applyButtonProps(): void {
    this.buttonElements.forEach((button, index) => {
      // Apply variant if not inherit
      if (this.variant !== 'inherit') {
        button.setAttribute('variant', this.variant);
      }

      // Apply size if not inherit
      if (this.size !== 'inherit') {
        button.setAttribute('size', this.size);
      }

      // Apply disabled state
      if (this.disabled) {
        button.setAttribute('disabled', 'true');
      }

      // Apply button component props for inheritance
      if (this.buttonLoading) {
        button.setAttribute('loading', 'true');
      }
      if (this.buttonAnimated) {
        button.setAttribute('animated', 'true');
      }
      if (this.buttonFullWidth) {
        button.setAttribute('full-width', 'true');
      }

      // Apply segmented styling via data attributes
      if (this.segmented) {
        this.applyAttachedStyles(button, index);
      }

      // Add click event listener for selection
      button.addEventListener('click', () => {
        const buttonValue = this.getButtonValue(button);
        if (buttonValue) {
          this.onButtonClick(buttonValue);
        }
      });
    });
  }

  private applyAttachedStyles(button: HTMLElement, index: number): void {
    const isFirst = index === 0;
    const isLast = index === this.buttonElements.length - 1;
    const total = this.buttonElements.length;

    if (total > 1) {
      if (isFirst) {
        button.setAttribute('data-position', 'first');
      } else if (isLast) {
        button.setAttribute('data-position', 'last');
      } else {
        button.setAttribute('data-position', 'middle');
      }
    }
  }

  private onButtonClick(val: string): void {
    if (this.selectionMode === 'none') {
      return;
    }

    let newValue: string[] = [];

    if (this.selectionMode === 'single') {
      newValue = [val];
    } else if (this.selectionMode === 'multiple') {
      if (this.internalValue.includes(val)) {
        newValue = this.internalValue.filter(v => v !== val);
      } else {
        newValue = [...this.internalValue, val];
      }
    }

    this.internalValue = newValue;

    const emitValue = this.selectionMode === 'single' ? newValue[0] : newValue;
    this.value = emitValue;

    this.valueChange.emit(emitValue);
    this.uiChange.emit({ value: emitValue, selectionMode: this.selectionMode });

    this.updateButtonSelection();
  }

  private updateButtonSelection(): void {
    this.buttonElements.forEach((button) => {
      const buttonValue = this.getButtonValue(button);
      if (!buttonValue) {
        return;
      }

      const isSelected = this.internalValue.includes(buttonValue);

      if (isSelected) {
        button.setAttribute('selected', 'true');
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('aria-checked', 'true');
      } else {
        button.removeAttribute('selected');
        button.removeAttribute('aria-pressed');
        button.setAttribute('aria-checked', 'false');
      }

      // Set accessibility role based on selection mode
      if (this.selectionMode === 'single') {
        button.setAttribute('role', 'radio');
      } else if (this.selectionMode === 'multiple') {
        button.setAttribute('role', 'checkbox');
      } else {
        button.removeAttribute('role');
      }
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.selectionMode === 'none') {
      return;
    }

    const buttons = this.buttonElements;
    if (buttons.length === 0) {
      return;
    }

    const currentIndex = buttons.findIndex((btn) => btn === document.activeElement);
    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % buttons.length;
        buttons[nextIndex].focus();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        buttons[nextIndex].focus();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        const buttonValue = this.getButtonValue(buttons[currentIndex]);
        if (buttonValue) {
          this.onButtonClick(buttonValue);
        }
        break;
    }
  }

  // === LIFECYCLE ===

  connectedCallback() {
    // Use MutationObserver to detect dynamic children
    this.observer = new MutationObserver(() => {
      this.updateButtons();
    });

    this.observer.observe(this.hostElement, {
      childList: true,
      subtree: false,
    });

    // Add keyboard event listener
    this.hostElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  componentWillLoad() {
    this.initializeSelectionState();
    this.updateButtons();
  }

  private initializeSelectionState(): void {
    if (this.selectionMode === 'multiple') {
      if (Array.isArray(this.value)) {
        this.internalValue = this.value;
      } else if (typeof this.value === 'string' && this.value.startsWith('[')) {
        try {
          this.internalValue = JSON.parse(this.value);
        } catch {
          this.internalValue = [];
        }
      } else {
        this.internalValue = [];
      }
    } else if (this.selectionMode === 'single' && this.value) {
      this.internalValue = [this.value as string];
    } else {
      this.internalValue = [];
    }
  }

  @Watch('value')
  watchValue(newVal: string | string[] | undefined): void {
    if (this.selectionMode === 'multiple') {
      if (Array.isArray(newVal)) {
        this.internalValue = newVal;
      } else if (typeof newVal === 'string' && newVal.startsWith('[')) {
        try {
          this.internalValue = JSON.parse(newVal);
        } catch {
          this.internalValue = [];
        }
      } else {
        this.internalValue = [];
      }
    } else if (this.selectionMode === 'single') {
      this.internalValue = newVal ? [newVal as string] : [];
    } else {
      this.internalValue = [];
    }
    this.updateButtonSelection();
  }

  @Watch('selectionMode')
  watchSelectionMode(newMode: 'none' | 'single' | 'multiple'): void {
    this.initializeSelectionState();
    this.updateButtonSelection();
  }

  componentDidLoad() {
    this.updateButtons();
    this.updateButtonSelection();
    // Convert data-value to value attributes for dynamically rendered buttons
    this.normalizeButtonValues();
  }

  private normalizeButtonValues(): void {
    const buttons = Array.from(
      this.hostElement.querySelectorAll(':scope > ui-button')
    ) as HTMLElement[];

    buttons.forEach((button) => {
      const dataValue = button.getAttribute('data-value');
      if (dataValue && !button.getAttribute('value')) {
        button.setAttribute('value', dataValue);
      }
    });
  }

  // === COMPUTED CLASSES ===

  private getGroupClasses(): string {
    const classes = [
      'ui-button-group',
    ];

    classes.push(`ui-button-group--${this.orientation}`);

    if (this.fullWidth) {
      classes.push('ui-button-group--full-width');
    }

    if (this.segmented) {
      classes.push('ui-button-group--segmented');
    }

    classes.push(`ui-button-group--gap-${this.gap}`);

    classes.push(`ui-button-group--rounded-${this.rounded}`);

    return classes.join(' ');
  }

  private getGroupRole(): string {
    if (this.selectionMode === 'single') {
      return 'radiogroup';
    } else if (this.selectionMode === 'multiple') {
      return 'group';
    }
    return 'group';
  }

  getGroupAriaProps(): Record<string, string> {
    return {};
  }

  // === RENDER ===

  render() {
    const groupClasses = this.getGroupClasses();
    const groupRole = this.getGroupRole();
    const ariaProps = this.getGroupAriaProps();

    // Render buttons directly if buttons prop is provided
    if (this.buttons) {
      try {
        const buttonsData = JSON.parse(this.buttons);
        if (Array.isArray(buttonsData)) {
          return (
            <Host class={groupClasses} role={groupRole} {...ariaProps}>
              {buttonsData.map((btn: any) => (
                <ui-button
                  variant={btn.variant || (this.variant !== 'inherit' ? this.variant : undefined)}
                  size={btn.size || (this.size !== 'inherit' ? this.size : undefined)}
                  iconLeft={btn.iconLeft}
                  iconRight={btn.iconRight}
                  icon={btn.icon}
                  fullWidth={btn.fullWidth || this.buttonFullWidth}
                  loading={btn.loading || this.buttonLoading}
                  animated={btn.animated || this.buttonAnimated}
                  data-value={btn.value}
                >
                  {btn.label}
                </ui-button>
              ))}
            </Host>
          );
        }
      } catch (e) {
        console.error('Failed to parse buttons JSON:', e);
      }
    }

    // Fallback to slot if buttons prop is not provided or parsing failed
    return (
      <Host class={groupClasses} role={groupRole} {...ariaProps}>
        <slot></slot>
      </Host>
    );
  }

  private observer: MutationObserver | null = null;
}
