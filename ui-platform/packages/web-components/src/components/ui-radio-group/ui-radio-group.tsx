import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { BaseComponent } from '../base/base-component';

@Component({
  tag: 'ui-radio-group',
  shadow: false,
  styleUrl: 'ui-radio-group.css',
})
export class UiRadioGroup extends BaseComponent {
  @Element() hostEl!: HTMLElement;

  @Prop({ mutable: true, reflect: true }) value: string = '';
  @Prop({ reflect: true }) name: string = '';
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) required: boolean = false;
  @Prop() defaultValue: string = '';
  @Prop() label?: string;
  @Prop() orientation: 'horizontal' | 'vertical' = 'vertical';
  @Prop({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';
  @Prop() radios?: string;

  @Event({ eventName: 'uiChange' }) uiChange!: EventEmitter<string>;

  @State() internalValue = '';
  @State() radioElements: any[] = [];
  @State() parsedRadios: any[] = [];

  private isControlled = false;

  componentWillLoad() {
    this.isControlled = this.hostEl.hasAttribute('value');
    this.internalValue = this.isControlled ? this.value : this.defaultValue;
    this.parseRadios();
    this.updateRadios();
  }

  @Watch('radios')
  handleRadiosChange() {
    this.parseRadios();
  }

  @Watch('value')
  handleValueChange(newValue: string) {
    this.isControlled = true;
    this.internalValue = newValue;
    this.updateRadios();
  }

  @Watch('disabled')
  handleDisabledChange() {
    this.updateRadios();
  }

  @Watch('name')
  handleNameChange() {
    this.updateRadios();
  }

  @Watch('size')
  handleSizeChange() {
    this.updateRadios();
  }

  private parseRadios() {
    if (this.radios) {
      try {
        this.parsedRadios = JSON.parse(this.radios);
      } catch (e) {
        this.parsedRadios = [];
      }
    } else {
      this.parsedRadios = [];
    }
  }

  @Listen('uiChange', { target: 'body', capture: true })
  handleRadioChange(event: CustomEvent<string>) {
    const radio = event.target as HTMLElement;
    if (!this.radioElements.includes(radio)) return;

    event.stopPropagation();
    const newValue = event.detail;

    if (!this.isControlled) {
      this.internalValue = newValue;
    }
    this.uiChange.emit(newValue);
    this.updateRadios();
  }

  private updateRadios() {
    this.radioElements = Array.from(
      this.hostEl.querySelectorAll('ui-radio')
    );

    this.radioElements.forEach((radio: any) => {
      radio.name = this.name;
      radio.disabled = this.disabled;
      radio.size = this.size;
      radio.checked = radio.value === this.internalValue;
    });
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const currentIndex = this.radioElements.findIndex(
      (radio: any) => radio.value === this.internalValue
    );
    
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % this.radioElements.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex =
          (currentIndex - 1 + this.radioElements.length) %
          this.radioElements.length;
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        this.selectRadio(this.radioElements[currentIndex].value);
        return;
      default:
        return;
    }

    (this.radioElements[nextIndex] as any).focus();
    this.selectRadio(this.radioElements[nextIndex].value);
  };

  private selectRadio(value: string) {
    if (!this.isControlled) {
      this.internalValue = value;
    }
    this.uiChange.emit(value);
    this.updateRadios();
  }

  render() {
    const hasLabel = this.label || this.hostEl.querySelector('[slot="label"]');
    const shouldRenderFromProp = this.parsedRadios.length > 0;

    return (
      <Host>
        <div
          class={{
            'radio-group': true,
            'radio-group--horizontal': this.orientation === 'horizontal',
            'radio-group--vertical': this.orientation === 'vertical',
            'radio-group--disabled': this.disabled,
          }}
          role="radiogroup"
          aria-disabled={String(this.disabled)}
          aria-required={String(this.required)}
          onKeyDown={this.handleKeyDown}
        >
          {hasLabel && (
            <div class="radio-group__label">
              <slot name="label">{this.label}</slot>
              {this.required && <span class="radio-group__required">*</span>}
            </div>
          )}
          <div class="radio-group__items">
            {shouldRenderFromProp ? (
              this.parsedRadios.map((radio) => (
                <ui-radio
                  value={radio.value}
                  label={radio.label}
                  supportingText={radio.supportingText}
                  name={this.name}
                  disabled={this.disabled}
                  size={this.size}
                  checked={radio.value === this.internalValue}
                />
              ))
            ) : (
              <slot></slot>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
