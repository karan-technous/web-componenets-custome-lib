import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { BaseComponent } from '../base/base-component';

@Component({
  tag: 'ui-chips-input',
  shadow: true,
  styleUrl: 'ui-chips-input.css',
})
export class UiChipsInput extends BaseComponent {
  @Prop({ mutable: true }) value: string[] = [];
  @Prop() placeholder: string = 'Type and press Enter';
  @Prop() disabled: boolean = false;
  @Prop() required: boolean = false;
  @Prop() errorMessage?: string;
  @Prop() maxChips?: number;
  @Prop() separator: string = ',';

  @State() inputValue: string = '';
  @State() isFocused: boolean = false;

  @Event() valueChange!: EventEmitter<string[]>;
  @Event() chipAdd!: EventEmitter<string>;
  @Event() chipRemove!: EventEmitter<string>;
  @Event() uiFocus!: EventEmitter<void>;
  @Event() uiBlur!: EventEmitter<void>;

  private inputEl?: HTMLInputElement;

  componentWillLoad() {
    this.value = this.normalizeValues(this.value);
  }

  @Watch('value')
  handleValueChanged(nextValue: string[]) {
    const normalized = this.normalizeValues(nextValue);

    if (!this.areValuesEqual(normalized, nextValue)) {
      this.value = normalized;
    }
  }

  @Method()
  async setFocus() {
    this.focusInput();
  }

  private normalizeValues(values?: string[]) {
    if (!Array.isArray(values)) {
      return [];
    }

    const normalized: string[] = [];

    values.forEach((entry) => {
      const value = `${entry ?? ''}`.trim();

      if (!value || normalized.includes(value)) {
        return;
      }

      normalized.push(value);
    });

    return normalized;
  }

  private areValuesEqual(left: string[], right: string[]) {
    if (left.length !== right.length) {
      return false;
    }

    return left.every((value, index) => value === right[index]);
  }

  private focusInput = () => {
    if (this.disabled) {
      return;
    }

    this.inputEl?.focus();
  };

  private handleInput = (event: Event) => {
    this.inputValue = (event.target as HTMLInputElement).value;
  };

  private handleFocus = () => {
    this.isFocused = true;
    this.uiFocus.emit();
  };

  private handleBlur = () => {
    this.isFocused = false;
    this.uiBlur.emit();
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    if (event.key === 'Enter' || (this.separator && event.key === this.separator)) {
      event.preventDefault();
      this.addChip();
      return;
    }

    if (event.key === 'Backspace' && !this.inputValue) {
      event.preventDefault();
      this.removeLastChip();
    }
  };

  private handleChipClick = (event: Event) => {
    const chip = event.target as HTMLElement & { active?: boolean };

    if (chip) {
      chip.active = false;
    }

    this.focusInput();
  };

  private addChip() {
    const value = this.inputValue.trim();

    if (!value) {
      return;
    }

    if (this.maxChips && this.value.length >= this.maxChips) {
      return;
    }

    if (this.value.includes(value)) {
      this.inputValue = '';
      return;
    }

    this.value = [...this.value, value];
    this.valueChange.emit(this.value);
    this.chipAdd.emit(value);
    this.inputValue = '';
  }

  private removeChip(value: string) {
    const nextValue = this.value.filter((entry) => entry !== value);

    if (nextValue.length === this.value.length) {
      return;
    }

    this.value = nextValue;
    this.valueChange.emit(this.value);
    this.chipRemove.emit(value);
    this.focusInput();
  }

  private removeLastChip() {
    const lastValue = this.value[this.value.length - 1];

    if (lastValue) {
      this.removeChip(lastValue);
    }
  }

  render() {
    const showPlaceholder = this.value.length === 0 ? this.placeholder : '';

    return (
      <Host>
        <div class="wrapper">
          <ui-input
            {...({ customInput: true } as any)}
            class={{
              field: true,
              'field--focused': this.isFocused,
            }}
            disabled={this.disabled}
            error={!!this.errorMessage}
          >
            <div
              slot="control"
              class={{
                control: true,
                'control--disabled': this.disabled,
              }}
              onClick={this.focusInput}
            >
              {!!this.value.length && (
                <div class="chips">
                  {this.value.map((chipValue) => (
                    <ui-chip
                      label={chipValue}
                      value={chipValue}
                      removable
                      size="sm"
                      disabled={this.disabled}
                      onChipClick={this.handleChipClick}
                      onChipRemove={() => this.removeChip(chipValue)}
                    />
                  ))}
                </div>
              )}

              <input
                ref={(element) => (this.inputEl = element as HTMLInputElement)}
                class="input"
                type="text"
                value={this.inputValue}
                placeholder={showPlaceholder}
                disabled={this.disabled}
                required={this.required}
                aria-invalid={this.errorMessage ? 'true' : 'false'}
                aria-required={this.required ? 'true' : 'false'}
                onInput={this.handleInput}
                onKeyDown={this.handleKeyDown}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
              />
            </div>
          </ui-input>

          {this.errorMessage ? <div class="error">{this.errorMessage}</div> : null}
        </div>
      </Host>
    );
  }
}
