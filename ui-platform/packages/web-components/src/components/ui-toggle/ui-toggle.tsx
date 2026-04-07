import { Component, h, Prop, Event, EventEmitter, Watch } from '@stencil/core';

@Component({
  tag: 'ui-toggle',
  shadow: true,
  styleUrl: 'ui-toggle.css',
})
export class UiToggle {
  @Prop({ mutable: true, reflect: true }) checked: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @Event() toggleChange!: EventEmitter<boolean>;

  @Watch('checked')
  handleChange(newValue: boolean) {
    this.toggleChange.emit(newValue);
  }

  private onToggle = () => {
    if (this.disabled) return;
    this.checked = !this.checked;
  };

  render() {
    return (
      <div
        class={{
          'toggle': true,
          [`toggle--${this.size}`]: true,
          'toggle--checked': this.checked,
          'toggle--disabled': this.disabled,
        }}
        onClick={this.onToggle}
      >
        <div class="checked-icon">
          <ui-icon name="Check" size={this.size}></ui-icon>
        </div>

        <div class="toggle__thumb" />
      </div>
    );
  }
}
