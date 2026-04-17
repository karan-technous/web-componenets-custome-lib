import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
} from '@stencil/core';
import { BaseComponent } from '../base/base-component';
import type {
  BadgeVariant,
  BadgeColor,
  BadgeSize,
  BadgeShape,
  BadgeEventDetail,
} from '@karan9186/core';

/**
 * UI Badge Component
 * Modern badge component with multiple variants, colors, and sizes
 * Supports icon slot, dot mode, and removable functionality
 *
 * @slot icon - Icon slot for badge icon
 * @slot default - Badge content/text
 *
 * @event remove - Emitted when the remove button is clicked
 */
@Component({
  tag: 'ui-badge',
  styleUrl: 'ui-badge.css',
  shadow: true,
})
export class UiBadge extends BaseComponent {
  @Element() hostElement!: HTMLElement;

  // === PROPS ===

  /**
   * Visual style variant of the badge
   * @default 'solid'
   */
  @Prop({ reflect: true }) variant: BadgeVariant = 'solid';

  /**
   * Color theme of the badge
   * @default 'primary'
   */
  @Prop({ reflect: true }) color: BadgeColor = 'primary';

  /**
   * Size of the badge
   * @default 'md'
   */
  @Prop({ reflect: true }) size: BadgeSize = 'md';

  /**
   * Shape of the badge
   * @default 'rounded'
   */
  @Prop({ reflect: true }) shape: BadgeShape = 'rounded';

  /**
   * Show as a dot indicator (status indicator)
   * @default false
   */
  @Prop({ reflect: true }) dot: boolean = false;

  /**
   * Show remove button
   * @default false
   */
  @Prop({ reflect: true }) removable: boolean = false;

  /**
   * Disable the badge
   * @default false
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  // === EVENTS ===

  /**
   * Emitted when the remove button is clicked
   */
  @Event() remove: EventEmitter<void>;

  // === METHODS ===

  private handleRemoveClick(event: MouseEvent) {
    event.stopPropagation();
    if (!this.disabled) {
      this.remove.emit();
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.remove.emit();
    }
  }

  // === RENDER ===

  render() {
    const hasIcon = this.hostElement.querySelector('[slot="icon"]') !== null;
    const hasContent = this.hostElement.textContent.trim() !== '';

    return (
      <Host
        role="status"
        aria-label={this.dot ? 'Status indicator' : this.hostElement.textContent.trim() || 'Badge'}
        class={{
          'ui-badge': true,
          [`ui-badge--${this.variant}`]: true,
          [`ui-badge--${this.color}`]: true,
          [`ui-badge--${this.size}`]: true,
          [`ui-badge--${this.shape}`]: true,
          'ui-badge--dot': this.dot,
          'ui-badge--removable': this.removable,
          'ui-badge--disabled': this.disabled,
        }}
      >
        <div class="ui-badge__content" part="base">
          {hasIcon && (
            <span class="ui-badge__icon" part="icon">
              <slot name="icon" />
            </span>
          )}

          {!this.dot && hasContent && (
            <span class="ui-badge__text">
              <slot />
            </span>
          )}

          {this.removable && (
            <button
              class="ui-badge__remove"
              part="close"
              type="button"
              aria-label="Remove badge"
              disabled={this.disabled}
              onClick={(e) => this.handleRemoveClick(e)}
              onKeyDown={(e) => this.handleKeyDown(e)}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </Host>
    );
  }
}
