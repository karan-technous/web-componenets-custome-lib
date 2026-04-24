import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { BaseComponent } from '../base/base-component';

@Component({
  tag: 'ui-toggle',
  shadow: true,
  styleUrl: 'ui-toggle.css',
})
export class UiToggle extends BaseComponent {
  @Prop({ mutable: true, reflect: true }) checked?: boolean;
  @Prop() defaultChecked: boolean = false;

  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';

  @Event() toggleChange!: EventEmitter<boolean>;

  private internalChecked = false;

  componentWillLoad() {
    super.componentWillLoad();
    this.internalChecked = this.checked ?? this.defaultChecked ?? false;
  }

  private isControlled() {
    return this.checked !== undefined;
  }

  private onToggle = () => {
    if (this.disabled) return;

    const currentValue = this.isControlled() ? this.checked : this.internalChecked;
    const newValue = !currentValue;

    if (!this.isControlled()) {
      this.internalChecked = newValue;
    } else {
      this.checked = newValue;
    }

    this.toggleChange.emit(newValue);
  };

  render() {
    const isChecked = this.isControlled()
      ? this.checked
      : this.internalChecked;

    return (
      <div
        class={{
          toggle: true,
          [`toggle--${this.size}`]: true,
          'toggle--checked': !!isChecked,
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