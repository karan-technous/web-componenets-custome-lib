import {
  Component,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Watch,
  Element,
  Host,
  Listen,
} from '@stencil/core';

export interface DropdownOption {
  label: string;
  value: string;
  avatar?: string;
  disabled?: boolean;
  hidden?: boolean;
  supportingText?: string;
}

@Component({
  tag: 'ui-checkbox-dropdown',
  styleUrl: 'ui-checkbox-dropdown.css',
  shadow: true,
})
export class UiCheckboxDropdown {
  @Element() el: HTMLElement;

  // ========================
  // Props
  // ========================
  @Prop() label: string;
  @Prop() supportingText?: string;
  @Prop() placeholder: string = 'Select...';

  @Prop() options: DropdownOption[] = [];

  @Prop({ mutable: true }) value: string[] = [];

  @Prop() disabled: boolean = false;
  @Prop() required: boolean = false;
  @Prop() errorMessage?: string;

  @Prop() loading: boolean = false;

  @Prop() showAvatar: boolean = false;

  @Prop() showSelectAll: boolean = true;

  // ========================
  // State
  // ========================
  @State() isOpen: boolean = false;
  @State() parsedOptions: DropdownOption[] = [];

  // ========================
  // Events
  // ========================
  @Event({ eventName: 'valueChange' }) valueChange: EventEmitter<string[]>;
  @Event({ eventName: 'uiBlur' }) uiBlur: EventEmitter<void>;

  // ========================
  // Watch
  // ========================
  @Watch('value')
  handleValueChange(newVal: string[]) {
    this.valueChange.emit(newVal);
  }

  @Watch('options')
  handleOptionsChange(newOptions: any) {
    this.parsedOptions = this.parseOptions(newOptions);
  }

  // ========================
  // Lifecycle
  // ========================
  componentWillLoad() {
    this.parsedOptions = this.parseOptions(this.options);
  }

  // ========================
  // Methods
  // ========================
  private parseOptions(options: any): DropdownOption[] {
    if (typeof options === 'string') {
      try {
        return JSON.parse(options);
      } catch {
        return [];
      }
    }
    if (Array.isArray(options)) {
      return options;
    }
    return [];
  }

  // ========================
  // Methods
  // ========================
  private toggleDropdown = () => {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  };

  private closeDropdown = () => {
    this.isOpen = false;
  };

  private isSelected = (val: string) => {
    return this.value.includes(val);
  };

  private toggleOption = (val: string, event?: Event) => {
    if (this.disabled) return;
    event?.stopPropagation();

    let newValue = [...this.value];

    if (newValue.includes(val)) {
      newValue = newValue.filter(v => v !== val);
    } else {
      newValue.push(val);
    }

    this.value = newValue;
  };

  private toggleAll = (event?: Event) => {
    event?.stopPropagation();
    const visibleOptions = this.parsedOptions.filter(o => !o.hidden && !o.disabled);

    if (visibleOptions.length === 0) return;

    const selectedCount = visibleOptions.filter(o => this.value.includes(o.value)).length;
    const isAllSelected = selectedCount === visibleOptions.length;

    this.value = isAllSelected
      ? []
      : visibleOptions.map(o => o.value);
  };

  private getSelectedOptions() {
    return this.parsedOptions.filter(o => this.value.includes(o.value));
  }

  private handleBlur = () => {
    this.uiBlur.emit();
  };

  // ========================
  // Outside Click Handler
  // ========================
  @Listen('click', { target: 'document' })
  handleOutsideClick(e: MouseEvent) {
    if (!this.isOpen) return;
    if (!e.composedPath().includes(this.el)) {
      this.isOpen = false;
    }
  }

  // ========================
  // Render Helpers
  // ========================
  private renderAvatarGroup() {
    const selected = this.getSelectedOptions();

    return selected.map(opt => (
      <img src={opt.avatar} class="avatar" alt={opt.label} slot="prefix" />
    ));
  }

  private renderInputValue() {
    const selected = this.getSelectedOptions();

    if (!selected.length) {
      return '';
    }

    if (this.showAvatar) {
      return ' '; // Return space to prevent placeholder from showing when avatars are displayed
    }

    return selected.map(s => s.label).join(', ');
  }

  // ========================
  // Render
  // ========================
  render() {
    const hasError = !!this.errorMessage;
    const selectedOptions = this.getSelectedOptions();
    const inputValue = this.renderInputValue();
    const options = this.parsedOptions;

    // Select All state
    const visibleOptions = options.filter(o => !o.hidden && !o.disabled);
    const selectedCount = visibleOptions.filter(o => this.value.includes(o.value)).length;
    const isAllSelected = visibleOptions.length > 0 && selectedCount === visibleOptions.length;
    const isIndeterminate = selectedCount > 0 && selectedCount < visibleOptions.length;
    const isNoneSelected = selectedCount === 0;

    return (
      <Host>
        <div class="wrapper">
          {/* Input Trigger */}
          <div class="trigger-wrapper" onClick={this.toggleDropdown}>
            <ui-input
              placeholder={this.placeholder}
              disabled={this.disabled}
              label={this.label}
              showAvatar={this.showAvatar && selectedOptions.length > 0}
              value={inputValue}
              icon={this.isOpen ? 'ChevronUp' : 'ChevronDown'}
              iconAriaLabel={this.isOpen ? 'Close dropdown' : 'Open dropdown'}
              onBlur={this.handleBlur}
            >
              {this.showAvatar && selectedOptions.length > 0 && this.renderAvatarGroup()}
            </ui-input>
          </div>

          {/* Dropdown */}
          <div
            class={{
              dropdown: true,
              'dropdown--visible': this.isOpen,
            }}
            role="listbox"
            aria-multiselectable="true"
          >
            {this.loading ? (
              <div class="loading">
                <ui-spinner variant="circular" size="sm" />
              </div>
            ) : (
              <div class="list">
                {/* Select All */}
                {this.showSelectAll && visibleOptions.length > 0 && (
                  <div
                    class={{
                      item: true,
                      'item--disabled': visibleOptions.length === 0,
                      'item--select-all': true,
                    }}
                    role="option"
                    aria-checked={isIndeterminate ? 'mixed' : isAllSelected}
                    onClick={this.toggleAll}
                  >
                    <ui-checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      disabled={visibleOptions.length === 0}
                    />
                    <span>All funds</span>
                  </div>
                )}

                {/* Options */}
                {options.map(option => {
                  if (option.hidden) return null;

                  return (
                    <div
                      class={{
                        item: true,
                        'item--disabled': option.disabled,
                      }}
                      role="option"
                      aria-selected={this.isSelected(option.value)}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('ui-checkbox')) return;
                        if (!option.disabled) {
                          this.toggleOption(option.value, e);
                        }
                      }}
                    >
                      <ui-checkbox
                        checked={this.isSelected(option.value)}
                        disabled={option.disabled}
                        controlled={true}
                        onUiClick={(e: CustomEvent<MouseEvent>) => {
                          e.stopPropagation();
                          if (!option.disabled) {
                            this.toggleOption(option.value);
                          }
                        }}
                      />
                      <div class="option-wrapper">
                        {option.avatar && (
                          <img
                            src={option.avatar}
                            class="avatar small"
                            alt={option.label}
                          />
                        )}

                        <div class="option-content">
                          <span class="label">{option.label}</span>
                          {option.supportingText && (
                            <span class="supporting-text">
                              {option.supportingText}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error */}
          {hasError && (
            <div class="error-text">{this.errorMessage}</div>
          )}
        </div>
      </Host>
    );
  }
}
