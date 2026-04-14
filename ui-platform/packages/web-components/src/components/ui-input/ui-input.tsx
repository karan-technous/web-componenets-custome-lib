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
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) type: 'text' | 'number' = 'text';

  @Event() valueChange!: EventEmitter<string>;
  @Event() uiBlur!: EventEmitter<void>;

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

  render() {
    return (
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
    );
  }
}