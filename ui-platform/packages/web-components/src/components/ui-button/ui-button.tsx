import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core';
import { BaseComponent } from '../base/base-component';
import type {
  ButtonVariant,
  ButtonSize,
  ButtonRounded,
  ButtonEventDetail,
  IconName,
} from '@karan9186/core';

/**
 * UI Button Component
 * Modern button component with shadcn/ui inspired variants
 * Supports multiple sizes, states, and animations
 *
 * @slot default - Button content/text
 * @slot icon-left - Left side icon
 * @slot icon-right - Right side icon
 *
 * @event uiClick - Emitted when button is clicked (not disabled/loading)
 * @event uiFocus - Emitted when button receives focus
 * @event uiBlur - Emitted when button loses focus
 */
@Component({
  tag: 'ui-button',
  styleUrl: 'ui-button.css',
  shadow: true,
})
export class UiButton extends BaseComponent {
  @Element() hostElement!: HTMLElement;

  // === PROPS ===

  /**
   * Visual style variant of the button
   * @default 'default'
   */
  @Prop({ reflect: true }) variant: ButtonVariant = 'default';

  /**
   * Size of the button
   * @default 'default'
   */
  @Prop({ reflect: true }) size: ButtonSize = 'default';

  /**
   * Whether the button is disabled
   * @default false
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * Whether the button is in loading state
   * @default false
   */
  @Prop({ reflect: true }) loading: boolean = false;

  /**
   * Whether the button should take full width
   * @default false
   */
  @Prop({ reflect: true }) fullWidth: boolean = false;

  /**
   * Whether to enable click animation (press effect)
   * @default false
   */
  @Prop({ reflect: true }) animated: boolean = false;

  /**
   * Border radius size
   * @default 'md'
   */
  @Prop({ reflect: true }) rounded: ButtonRounded = 'md';

  /**
   * Icon name for left side (from lucide icons)
   */
  @Prop() iconLeft?: IconName;

  /**
   * Icon name for right side (from lucide icons)
   */
  @Prop() iconRight?: IconName;

  /**
   * Icon name for center (for icon-only buttons)
   */
  @Prop() icon?: IconName;

  // === EVENTS ===

  /**
   * Emitted when button is clicked (when not disabled or loading)
   */
  @Event({ bubbles: true, composed: true }) uiClick!: EventEmitter<ButtonEventDetail>;

  /**
   * Emitted when button receives focus
   */
  @Event({ bubbles: true, composed: true }) uiFocus!: EventEmitter<void>;

  /**
   * Emitted when button loses focus
   */
  @Event({ bubbles: true, composed: true }) uiBlur!: EventEmitter<void>;

  // === STATE ===

  @State() isPressed = false;

  // === PRIVATE METHODS ===

  private handleClick = (e: MouseEvent) => {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const detail: ButtonEventDetail = {
      timestamp: Date.now(),
      variant: this.variant,
    };

    this.uiClick.emit(detail);
  };

  private handleFocus = () => {
    this.uiFocus.emit();
  };

  private handleBlur = () => {
    this.uiBlur.emit();
    this.isPressed = false;
  };

  private handleMouseDown = () => {
    if (this.animated && !this.disabled && !this.loading) {
      this.isPressed = true;
    }
  };

  private handleMouseUp = () => {
    this.isPressed = false;
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleClick(e as unknown as MouseEvent);
    }
  };

  // === COMPUTED CLASSES ===

  private getButtonClasses(): string {
    const baseClasses = [
      'ui-btn',
      `ui-btn--${this.variant}`,
      `ui-btn--${this.size}`,
      `ui-btn--rounded-${this.rounded}`,
    ];

    if (this.animated) {
      baseClasses.push('ui-btn--animated');
    }

    if (this.loading) {
      baseClasses.push('ui-btn--loading');
    }

    if (this.fullWidth) {
      baseClasses.push('ui-btn--full-width');
    }

    if (this.isPressed) {
      baseClasses.push('ui-btn--pressed');
    }

    return baseClasses.join(' ');
  }

  private getIconSize(): 'sm' | 'md' | 'lg' {
    const sizeMap: Record<ButtonSize, 'sm' | 'md' | 'lg'> = {
      'xs': 'sm',
      'sm': 'sm',
      'default': 'md',
      'lg': 'lg',
      'icon': 'md',
      'icon-xs': 'sm',
      'icon-sm': 'sm',
      'icon-lg': 'lg',
    };
    return sizeMap[this.size] || 'md';
  }

  // === RENDER ===

  render() {
    const buttonClasses = this.getButtonClasses();

    return (
      <Host class={{ 'ui-btn-host': true, 'ui-btn-host--full-width': this.fullWidth }}>
        <button
          class={buttonClasses}
          disabled={this.disabled || this.loading}
          aria-disabled={this.disabled}
          aria-busy={this.loading}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onKeyDown={this.handleKeyDown}
          part="button"
          type="button"
        >
          {/* Loading spinner using SVG */}
          {this.loading && (
            <span class="ui-btn__spinner" aria-hidden="true">
              <svg
                class="ui-btn__spinner-svg"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  class="ui-btn__spinner-track"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-linecap="round"
                  opacity="0.25"
                />
                <path
                  class="ui-btn__spinner-indicator"
                  d="M12 2C6.48 2 2 6.48 2 12"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </svg>
            </span>
          )}

          {/* Content container */}
          <span
            class={{
              'ui-btn__content': true,
              'ui-btn__content--hidden': this.loading,
            }}
          >
            {/* Center icon (for icon-only buttons) */}
            {this.icon && (
              <span class="ui-btn__icon ui-btn__icon--center">
                <ui-icon name={this.icon} size={this.getIconSize()} stroke={2} />
              </span>
            )}

            {/* Left icon from prop */}
            {!this.icon && this.iconLeft && (
              <span class="ui-btn__icon ui-btn__icon--left">
                <ui-icon name={this.iconLeft} size={this.getIconSize()} stroke={2} />
              </span>
            )}

            {/* Left icon slot (fallback) */}
            {!this.icon && !this.iconLeft && (
              <span class="ui-btn__icon ui-btn__icon--left">
                <slot name="icon-left"></slot>
              </span>
            )}

            {/* Main content */}
            {!this.icon && <span class="ui-btn__text">
              <slot></slot>
            </span>}

            {/* Right icon from prop */}
            {!this.icon && this.iconRight && (
              <span class="ui-btn__icon ui-btn__icon--right">
                <ui-icon name={this.iconRight} size={this.getIconSize()} stroke={2} />
              </span>
            )}

            {/* Right icon slot (fallback) */}
            {!this.icon && !this.iconRight && (
              <span class="ui-btn__icon ui-btn__icon--right">
                <slot name="icon-right"></slot>
              </span>
            )}
          </span>
        </button>
      </Host>
    );
  }
}
