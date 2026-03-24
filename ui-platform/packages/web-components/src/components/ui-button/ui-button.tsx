import { Component, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'ui-button',
  shadow: true,
})
export class UiButton {
  @Event() clicked: EventEmitter<void>;

  render() {
    return (
      <button onClick={() => this.clicked.emit()}>
        <slot></slot>
      </button>
    );
  }
}
