import { Component, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'ui-checkbox',
  shadow: true,
  styleUrl: 'ui-checkbox.css',
})
export class UiCheckbox {
  @Prop({ mutable: true, reflect: true }) checked: boolean = false;
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';
  @Prop() label: string = '';

  @Event() checkboxChange!: EventEmitter<boolean>;
  @Event() uiBlur!: EventEmitter<void>;

  @Watch('checked')
  onCheckedChange(value: boolean) {
    this.checkboxChange.emit(value);
  }

  private onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
  };

  private onBlur = () => {
    this.uiBlur.emit();
  };

  render() {
    return (
      <label
        class={{
          'checkbox': true,
          [`checkbox--${this.size}`]: true,
          'checkbox--disabled': this.disabled,
        }}
      >
        <input class="checkbox__input" type="checkbox" checked={this.checked} disabled={this.disabled} onInput={this.onInput} onBlur={this.onBlur} />
        <span class="checkbox__control" aria-hidden="true">
          {this.checked ? (
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
