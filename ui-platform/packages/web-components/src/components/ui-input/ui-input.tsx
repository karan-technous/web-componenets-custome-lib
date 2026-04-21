import { Component, Prop, Event, EventEmitter, h, Watch } from '@stencil/core';
import { BaseComponent } from '../base/base-component';

@Component({
  tag: 'ui-input',
  shadow: true,
  styleUrl: 'ui-input.css',
})
export class UiInput extends BaseComponent {
  @Prop() value: string = '';
  @Prop({ reflect: true }) placeholder: string = '';
  @Prop({ reflect: true }) label?: string;
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) type: 'text' | 'number' = 'text';
  @Prop({ reflect: true }) rounded: 'xs' | 'sm' | 'md' | 'xl' = 'md';
  @Prop({ reflect: true }) icon?: string;
  @Prop() iconAriaLabel: string = 'Input icon action';

  @Event() valueChange!: EventEmitter<string>;
  @Event() uiBlur!: EventEmitter<void>;
  @Event() uiIconClick!: EventEmitter<void>;

  private inputEl!: HTMLInputElement;

  @Watch('value')
  handleValueChange(newValue: string) {
    if (this.inputEl && this.inputEl.value !== newValue) {
      this.inputEl.value = newValue || '';
    }
  }

  onInput = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;

    if (val !== this.value) {
      this.valueChange.emit(val);
    }
  };

  onIconClick = (e: MouseEvent) => {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.uiIconClick.emit();
    this.inputEl?.focus();
  };

  render() {
    return (
      <div
        class={{
          'input-wrap': true,
          'input-wrap--disabled': this.disabled,
          'input-wrap--with-icon': !!this.icon,
          [`input-wrap--rounded-${this.rounded}`]: true,
        }}
      >
        {this.label && <label class="input-label">{this.label}</label>}
        <input
          ref={(el) => (this.inputEl = el as HTMLInputElement)}
          class="input"
          type={this.type}
          value={this.value || ''}
          placeholder={this.placeholder || 'Type something...'}
          disabled={this.disabled}
          onInput={this.onInput}
          onBlur={() => this.uiBlur.emit()}
        />

        {this.icon && (
          <button
            type="button"
            class="icon-button"
            disabled={this.disabled}
            aria-label={this.iconAriaLabel}
            onClick={this.onIconClick}
          >
            <ui-icon name={this.icon as any} size="sm"></ui-icon>
          </button>
        )}
      </div>
    );
  }
}
