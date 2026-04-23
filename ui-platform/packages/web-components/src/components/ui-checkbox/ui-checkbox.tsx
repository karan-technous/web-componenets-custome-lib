import { Component, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { BaseComponent } from '../base/base-component';

@Component({
  tag: 'ui-checkbox',
  shadow: true,
  styleUrl: 'ui-checkbox.css',
})
export class UiCheckbox extends BaseComponent {
  @Prop({ mutable: true, reflect: true }) checked: boolean = false;
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) indeterminate: boolean = false;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';
  @Prop() label: string = '';
  @Prop() controlled: boolean = false;

  @Event() uiChange!: EventEmitter<boolean>;
  @Event() uiBlur!: EventEmitter<void>;
  @Event() uiClick!: EventEmitter<MouseEvent>;

  @Watch('checked')
  onCheckedChange(value: boolean) {
    this.uiChange.emit(value);
  }

  private onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
  };

  private onBlurFun = () => {
    this.uiBlur.emit();
  };

  private onClick = (e: MouseEvent) => {
    if (this.controlled) {
      e.preventDefault();
    }
    this.uiClick.emit(e);
  };

  render() {
    return (
      <label
        class={{
          'checkbox': true,
          [`checkbox--${this.size}`]: true,
          'checkbox--disabled': this.disabled,
        }}
        onClick={this.onClick}
      >
        <input class="checkbox__input" type="checkbox" checked={this.checked} disabled={this.disabled} onInput={this.onInput} onBlur={this.onBlurFun} />
        <span class={{
          'checkbox__control': true,
          'checkbox__control--indeterminate': this.indeterminate,
        }} aria-hidden="true">
          {this.indeterminate ? (
            <span class="checkbox__icon">
              <ui-icon name="Minus" size={this.size}></ui-icon>
            </span>
          ) : this.checked ? (
            <span class="checkbox__icon">
              <ui-icon name="Check" size={this.size}></ui-icon>
            </span>
          ) : null}
        </span>
        <span class="checkbox__label">
          <slot>{this.label}</slot>
        </span>
      </label>
    );
  }
}
