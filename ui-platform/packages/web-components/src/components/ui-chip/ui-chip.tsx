import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
} from '@stencil/core';
import { BaseComponent } from '../base/base-component';
import type { ChipEventDetail, IconName } from '@karan9186/core';

@Component({
  tag: 'ui-chip',
  styleUrl: 'ui-chip.css',
  shadow: true,
})
export class UiChip extends BaseComponent {
  @Prop({ reflect: true }) label!: string;
  @Prop({ reflect: true }) value!: string;
  @Prop({ mutable: true, reflect: true }) active: boolean = false;
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true, attribute: 'icon-name' }) iconName?: IconName;
  @Prop({ reflect: true, attribute: 'badge-counter' }) badgeCounter?: number;
  @Prop({ reflect: true }) removable: boolean = false;
  @Prop({ reflect: true }) size: string = 'md';

  @Event() chipClick!: EventEmitter<ChipEventDetail>;
  @Event() chipRemove!: EventEmitter<ChipEventDetail>;
  @Event() chipIconClick!: EventEmitter<ChipEventDetail>;

  private toggleActive() {
    if (this.disabled) {
      return;
    }

    this.active = !this.active;
    this.chipClick.emit(this.value);
  }

  private handleClick = () => {
    this.toggleActive();
  };

  private handleRemove = (event: MouseEvent) => {
    event.stopPropagation();

    if (this.disabled) {
      return;
    }

    this.chipRemove.emit(this.value);
  };

  private handleIconClick = (event: MouseEvent) => {
    event.stopPropagation();

    if (this.disabled || !this.iconName) {
      return;
    }

    this.chipIconClick.emit(this.value);
  };

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    if (this.disabled) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleActive();
    }

    if ((event.key === 'Backspace' || event.key === 'Delete') && this.removable) {
      event.preventDefault();
      this.chipRemove.emit(this.value);
    }
  }

  render() {
    const hasBadge = typeof this.badgeCounter === 'number';

    return (
      <Host
        role="button"
        tabindex={this.disabled ? -1 : 0}
        aria-pressed={this.active ? 'true' : 'false'}
        aria-disabled={this.disabled ? 'true' : 'false'}
        onClick={this.handleClick}
      >
        <div
          class={{
            chip: true,
            active: this.active,
            disabled: this.disabled,
            [this.size]: true,
          }}
        >
          {this.iconName ? (
            <button
              class="chip__icon-button"
              type="button"
              aria-label={`${this.label} icon action`}
              disabled={this.disabled}
              onClick={this.handleIconClick}
            >
              <ui-icon class="chip__icon" name={this.iconName} size="sm" />
            </button>
          ) : null}

          <span class="chip__label">{this.label}</span>

          {hasBadge ? (
            <span class="chip__badge" aria-label={`${this.badgeCounter} notifications`}>
              {this.badgeCounter}
            </span>
          ) : null}

          {this.removable ? (
            <button
              class="chip__remove"
              type="button"
              aria-label={`Remove ${this.label}`}
              disabled={this.disabled}
              onClick={this.handleRemove}
            >
              <ui-icon name="X" size="sm" />
            </button>
          ) : null}
        </div>
      </Host>
    );
  }
}
