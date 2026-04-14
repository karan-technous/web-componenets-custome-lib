import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { BaseComponent } from '../base/base-component';

@Component({
  tag: 'ui-button',
  styleUrl: 'ui-button.css',
  shadow: true,
})
export class UiButton extends BaseComponent {
  
  @Prop() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';

  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop() loading: boolean = false;
  @Prop({ reflect: true }) fullWidth: boolean = false;

  @Event() uiClick!: EventEmitter<void>;

  
  private handleClick = (e: MouseEvent) => {
    if (!this.disabled && !this.loading) {
      this.uiClick.emit();
    }
  };

  render() {
    return (
      <button class={`btn ${this.variant} ${this.size}`} disabled={this.disabled || this.loading} onClick={this.handleClick} aria-disabled={this.disabled} aria-busy={this.loading}>
        {this.loading ? <span class="loader"></span> : [<slot name="start"></slot>, <slot></slot>, <slot name="end"></slot>]}
      </button>
    );
  }
}
