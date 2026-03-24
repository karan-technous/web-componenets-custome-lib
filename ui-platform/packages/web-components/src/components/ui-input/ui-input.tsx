import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'ui-input',
  shadow: true,
})
export class UiInput {
  @Prop() value: string;
  @Prop({ reflect: true }) placeholder: string;
  @Prop({ reflect: true }) disabled: boolean = false;
  @Event() valueChange: EventEmitter<string>;
  @Event() uiBlur: EventEmitter<void>;

  onInput = (e: any) => {
    this.valueChange.emit(e.target.value);
  };

  render() {
    return <input value={this.value || ''} placeholder={this.placeholder || ''} disabled={this.disabled} onInput={this.onInput} onBlur={() => this.uiBlur.emit()} />;
  }
}
