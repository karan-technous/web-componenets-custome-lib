import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { BaseComponent } from '../base/base-component';

@Component({
  tag: 'ui-radio',
  shadow: true,
  styleUrl: 'ui-radio.css',
})
export class UiRadio extends BaseComponent {
  @Element() hostEl!: HTMLElement;

  @Prop({ reflect: true }) value: string = '';
  @Prop({ mutable: true, reflect: true }) checked: boolean = false;
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) required: boolean = false;
  @Prop({ reflect: true }) name?: string;
  @Prop({ reflect: true }) error: boolean = false;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @Prop() label?: string;
  @Prop() supportingText?: string;

  @Event({ eventName: 'uiChange' }) uiChange!: EventEmitter<string>;
  @Event({ eventName: 'uiFocus' }) uiFocus!: EventEmitter<void>;
  @Event({ eventName: 'uiBlur' }) uiBlur!: EventEmitter<void>;

  @State() internalChecked = false;
  @State() isFocused = false;

  private isControlled = false;

  componentWillLoad() {
    this.isControlled = this.hostEl.hasAttribute('checked');
    this.internalChecked = this.checked;
  }

  @Watch('checked')
  handleCheckedChange(newValue: boolean) {
    this.isControlled = true;
    this.internalChecked = newValue;
  }

  @Watch('error')
  handleErrorChange() {
    // Error state is handled via CSS
  }

  private handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.checked && !this.isControlled) {
      this.internalChecked = true;
    }
    this.uiChange.emit(this.value);
  };

  private handleFocus = () => {
    this.isFocused = true;
    this.uiFocus.emit();
  };

  private handleBlur = () => {
    this.isFocused = false;
    this.uiBlur.emit();
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!this.disabled && !this.internalChecked) {
        this.internalChecked = true;
        this.uiChange.emit(this.value);
      }
    }
  };

  render() {
    const hasLabel = this.label || this.hostEl.querySelector('[slot="label"]');
    const hasSupporting = this.supportingText || this.hostEl.querySelector('[slot="supporting"]');

    return (
      <Host>
        <label
          class={{
            'radio': true,
            'radio--checked': this.internalChecked,
            'radio--disabled': this.disabled,
            'radio--error': this.error,
            [`radio--${this.size}`]: true,
            'radio--focused': this.isFocused,
          }}
        >
          <input
            type="radio"
            class="radio__input"
            name={this.name}
            value={this.value}
            checked={this.internalChecked}
            disabled={this.disabled}
            required={this.required}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
            aria-checked={String(this.internalChecked)}
            aria-disabled={String(this.disabled)}
            aria-invalid={String(this.error)}
          />
          <span class="radio__control" aria-hidden="true">
            <span class="radio__outer-ring"></span>
            <span class="radio__inner-dot"></span>
          </span>
          {(hasLabel || hasSupporting) && (
            <span class="radio__label-container">
              {hasLabel && (
                <span class="radio__label">
                  <slot name="label">{this.label}</slot>
                </span>
              )}
              {hasSupporting && (
                <span class="radio__supporting">
                  <slot name="supporting">{this.supportingText}</slot>
                </span>
              )}
            </span>
          )}
        </label>
      </Host>
    );
  }
}
