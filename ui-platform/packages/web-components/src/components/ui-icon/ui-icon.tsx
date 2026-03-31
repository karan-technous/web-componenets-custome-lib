import { Component, Prop, h } from '@stencil/core';
import { ICONS, IconName } from '../icons/icon.registry';

@Component({
  tag: 'ui-icon',
  shadow: true,
  styleUrl: 'ui-icon.css',
})
export class UiIcon {
  @Prop() name!: IconName;
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';
  @Prop() stroke: number = 2;
  @Prop() color: string = 'currentColor';

  private renderIcon() {
    const icon = ICONS[this.name];

    if (!icon) {
      return <span>⚠️ Icon not found</span>;
    }

    return icon.map(([tag, attrs]) => {
      return h(tag, { ...attrs });
    });
  }

  render() {
    return (
      <svg
        class={{
          'icon-svg': true,
          [`icon--${this.size}`]: true,
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={this.color}
        stroke-width={this.stroke}
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        {this.renderIcon()}
      </svg>
    );
  }
}
