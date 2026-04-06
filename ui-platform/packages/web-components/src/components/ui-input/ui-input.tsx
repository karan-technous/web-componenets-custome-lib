import { Component, Prop, Event, EventEmitter, h, Element } from '@stencil/core';

@Component({
  tag: 'ui-input',
  shadow: true,
  styleUrl: 'ui-input.css',
})
export class UiInput {
  @Element() el: HTMLElement;

  @Prop() value: string;
  @Prop({ reflect: true }) placeholder: string;
  @Prop({ reflect: true }) disabled: boolean = false;

  @Event() valueChange: EventEmitter<string>;
  @Event() uiBlur: EventEmitter<void>;

  private inputEl!: HTMLInputElement;

  componentDidLoad() {
    this.inputEl = this.el.shadowRoot.querySelector('input')!;
    this.inputEl.value = this.value || '';
    this.inputEl.disabled = this.disabled;
  }

  // Only update DOM when prop changes
  componentDidUpdate() {
    if (this.inputEl) {
      // value sync
      if (this.inputEl.value !== this.value) {
        this.inputEl.value = this.value || '';
      }

      // disabled sync
      this.inputEl.disabled = this.disabled;
    }
  }

  onInput = (e: any) => {
    const val = e.target.value;
    // prevent unnecessary emits
    if (val !== this.value) {
      this.valueChange.emit(val);
    }
  };

  render() {
    return (
      <input
        class="input"
        value={this.value || ''}
        placeholder={this.placeholder === undefined || this.placeholder === null || this.placeholder == '' ? 'Type something...' : this.placeholder}
        disabled={this.disabled}
        onInput={this.onInput}
        onBlur={() => this.uiBlur.emit()}
        
      />
    );
  }
}
