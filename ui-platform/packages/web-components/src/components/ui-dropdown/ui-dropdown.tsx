import { Component, Prop, Event, EventEmitter, h, State, Listen, Element, Watch, Host } from '@stencil/core';
import { BaseComponent } from '../base/base-component';

export type DropdownOption = {
  label: string;
  value: any;
  disabled?: boolean;
  group?: string;
};

export type DropdownMode = 'single' | 'multiple';
export type DropdownVariant = 'input' | 'button' | 'icon-only';

@Component({
  tag: 'ui-dropdown',
  shadow: true,
  styleUrl: 'ui-dropdown.css',
})
export class UiDropdown extends BaseComponent {
  @Element() el!: HTMLElement;

  // Props
  @Prop({ reflect: true }) value: any = undefined;
  @Prop({ reflect: true }) defaultValue: any = null;
  @Prop({ reflect: true }) options: DropdownOption[] = [];
  @Prop({ reflect: true }) mode: DropdownMode = 'single';
  @Prop({ reflect: true }) variant: DropdownVariant = 'input';
  @Prop({ reflect: true }) placeholder: string = 'Select...';
  @Prop({ reflect: true }) label?: string;
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) loading: boolean = false;
  @Prop({ reflect: true }) searchable: boolean = false;
  @Prop({ reflect: true }) clearable: boolean = false;
  @Prop({ reflect: true }) open: boolean = undefined;
  @Prop({ reflect: true }) minWidth: string = '200px';
  @Prop({ reflect: true }) maxWidth: string = 'none';
  @Prop({ reflect: true }) maxHeight: string = '300px';
  @Prop({ reflect: true }) selectAll: boolean = false;

  // Events
  @Event() valueChange!: EventEmitter<any>;
  @Event() openChange!: EventEmitter<boolean>;
  @Event() search!: EventEmitter<string>;

  // Internal state
  @State() internalOpen: boolean = false;
  @State() internalValue: any = null;
  @State() searchQuery: string = '';
  @State() highlightedIndex: number = -1;
  @State() filteredOptions: DropdownOption[] = [];

  private triggerRef!: HTMLElement;
  private dropdownRef!: HTMLElement;
  private searchInputRef!: HTMLInputElement;
  private debounceTimer: any = null;

  // Lifecycle
  componentWillLoad() {
    this.internalValue = this.value !== undefined ? this.value : this.defaultValue;
    this.internalOpen = this.open !== undefined ? this.open : false;
    this.filteredOptions = this.parseOptions(this.options);
  }

  @Watch('value')
  watchValue(newValue: any) {
    if (newValue !== undefined) {
      this.internalValue = newValue;
    }
  }

  @Watch('open')
  watchOpen(newOpen: boolean | undefined) {
    if (newOpen !== undefined && newOpen !== this.internalOpen) {
      this.internalOpen = newOpen;
    }
  }

  @Watch('options')
  watchOptions() {
    this.filteredOptions = this.parseOptions(this.options);
    this.filterOptions();
  }

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

  // Computed
  get isControlled() {
    return this.value !== undefined;
  }

  get isOpenControlled() {
    return this.open !== undefined;
  }

  get selectedOptions(): DropdownOption[] {
    const options = this.filteredOptions;
    if (this.mode === 'single') {
      return options.filter(opt => opt.value === this.internalValue);
    }
    return options.filter(opt =>
      Array.isArray(this.internalValue) && this.internalValue.includes(opt.value)
    );
  }

  get displayValue(): string {
    if (this.mode === 'single') {
      const selected = this.selectedOptions[0];
      return selected ? selected.label : '';
    }
    const count = this.selectedOptions.length;
    if (count === 0) return '';
    if (count <= 3) {
      return this.selectedOptions.map(opt => opt.label).join(', ');
    }
    return `${this.selectedOptions.slice(0, 3).map(opt => opt.label).join(', ')} +${count - 3} more`;
  }

  // Methods
  setOpen = (isOpen: boolean) => {
    this.internalOpen = isOpen;
    this.openChange.emit(isOpen);
    if (isOpen) {
      this.highlightedIndex = -1;
    }
  };

  toggle = () => {
    this.setOpen(!this.internalOpen);
  };

  selectOption = (option: DropdownOption) => {
    if (option.disabled) return;

    let newValue: any;
    if (this.mode === 'single') {
      newValue = option.value;
      this.setOpen(false);
    } else {
      const currentValues = Array.isArray(this.internalValue) ? this.internalValue : [];
      if (currentValues.includes(option.value)) {
        newValue = currentValues.filter(v => v !== option.value);
      } else {
        newValue = [...currentValues, option.value];
      }
    }

    if (this.isControlled) {
      this.valueChange.emit(newValue);
    } else {
      this.internalValue = newValue;
      this.valueChange.emit(newValue);
    }
  };

  clear = (e: MouseEvent) => {
    e.stopPropagation();
    const newValue = this.mode === 'single' ? null : [];
    if (this.isControlled) {
      this.valueChange.emit(newValue);
    } else {
      this.internalValue = newValue;
      this.valueChange.emit(newValue);
    }
  };

  selectAllOptions = () => {
    const enabledOptions = this.options.filter(opt => !opt.disabled);
    const values = enabledOptions.map(opt => opt.value);
    if (this.isControlled) {
      this.valueChange.emit(values);
    } else {
      this.internalValue = values;
      this.valueChange.emit(values);
    }
  };

  clearAllOptions = () => {
    const newValue: any = [];
    if (this.isControlled) {
      this.valueChange.emit(newValue);
    } else {
      this.internalValue = newValue;
      this.valueChange.emit(newValue);
    }
  };

  handleSearch = (e: Event) => {
    const query = (e.target as HTMLInputElement).value;
    this.searchQuery = query;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.search.emit(query);
    }, 300);
  };

  filterOptions = () => {
    if (!this.searchQuery) {
      this.filteredOptions = this.options;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredOptions = this.options.filter(opt =>
      opt.label.toLowerCase().includes(query)
    );
  };

  @Watch('searchQuery')
  watchSearchQuery() {
    this.filterOptions();
  }

  disconnectedCallback() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  // Keyboard navigation
  handleKeyDown = (e: KeyboardEvent) => {
    if (!this.internalOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        this.setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.highlightedIndex = Math.min(
          this.highlightedIndex + 1,
          this.filteredOptions.length - 1
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (this.highlightedIndex >= 0 && this.filteredOptions[this.highlightedIndex]) {
          this.selectOption(this.filteredOptions[this.highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.setOpen(false);
        this.triggerRef?.focus();
        break;
      case 'Tab':
        e.preventDefault();
        this.setOpen(false);
        break;
    }

    this.scrollToHighlighted();
  };

  scrollToHighlighted = () => {
    const highlightedOption = this.dropdownRef?.querySelector(
      `[data-index="${this.highlightedIndex}"]`
    ) as HTMLElement;
    if (highlightedOption) {
      highlightedOption.scrollIntoView({ block: 'nearest' });
    }
  };

  // Outside click
  @Listen('click', { target: 'document' })
  handleOutsideClick(e: MouseEvent) {
    if (!this.internalOpen) return;
    if (!e.composedPath().includes(this.el)) {
      this.setOpen(false);
    }
  };

  // Focus trap
  @Listen('keydown')
  handleFocusTrap(e: KeyboardEvent) {
    if (!this.internalOpen || e.key !== 'Tab') return;
    e.preventDefault();
  }

  render() {
    const hasSelection = this.mode === 'single' 
      ? this.internalValue !== null 
      : Array.isArray(this.internalValue) && this.internalValue.length > 0;

    const groupedOptions = this.filteredOptions.reduce((acc, opt) => {
      const group = opt.group || 'default';
      if (!acc[group]) acc[group] = [];
      acc[group].push(opt);
      return acc;
    }, {} as Record<string, DropdownOption[]>);

    return (
      <Host>
        <div
          class={{
            'dropdown': true,
            'dropdown--open': this.internalOpen,
            'dropdown--disabled': this.disabled,
            'dropdown--loading': this.loading,
          }}
          style={{ '--ui-dropdown-min-width': this.minWidth, '--ui-dropdown-max-width': this.maxWidth }}
        >
          {/* Trigger */}
          {this.variant === 'input' && (
            <div
              class="dropdown-trigger"
              ref={(el) => (this.triggerRef = el as HTMLElement)}
              onClick={() => !this.disabled && this.toggle()}
              onKeyDown={this.handleKeyDown}
              tabIndex={this.disabled ? -1 : 0}
              role="combobox"
              aria-expanded={this.internalOpen}
              aria-haspopup="listbox"
              aria-disabled={this.disabled}
            >
              {this.label && <label class="dropdown-label">{this.label}</label>}
              <div class="dropdown-input">
                <span class="dropdown-value">
                  {hasSelection ? this.displayValue : this.placeholder}
                </span>
                {this.clearable && hasSelection && (
                  <button
                    class="dropdown-clear"
                    onClick={this.clear}
                    aria-label="Clear selection"
                  >
                    <ui-icon name="X" size="sm"></ui-icon>
                  </button>
                )}
                <span class="dropdown-chevron">
                  {this.loading ? (
                    <ui-icon name="Loader2" size="sm" class="spin"></ui-icon>
                  ) : (
                    <ui-icon name="ChevronDown" size="sm"></ui-icon>
                  )}
                </span>
              </div>
            </div>
          )}

          {this.variant === 'button' && (
            <button
              class="dropdown-button"
              part="button"
              ref={(el) => (this.triggerRef = el as HTMLElement)}
              onClick={() => !this.disabled && this.toggle()}
              onKeyDown={this.handleKeyDown}
              disabled={this.disabled}
              role="combobox"
              aria-expanded={this.internalOpen}
              aria-haspopup="listbox"
            >
              {hasSelection ? this.displayValue : this.placeholder}
              {this.loading ? (
                <ui-icon name="Loader2" size="sm" class="spin"></ui-icon>
              ) : (
                <ui-icon name="ChevronDown" size="sm"></ui-icon>
              )}
            </button>
          )}

          {this.variant === 'icon-only' && (
            <button
              class="dropdown-icon-trigger"
              ref={(el) => (this.triggerRef = el as HTMLElement)}
              onClick={() => !this.disabled && this.toggle()}
              onKeyDown={this.handleKeyDown}
              disabled={this.disabled}
              role="combobox"
              aria-expanded={this.internalOpen}
              aria-haspopup="listbox"
              aria-label="Open dropdown"
            >
              <ui-icon name="MoreHorizontal" size="md"></ui-icon>
            </button>
          )}

          {/* Dropdown */}
          <div
            class={{
              'dropdown-menu': true,
              'dropdown-menu--open': this.internalOpen,
            }}
            ref={(el) => (this.dropdownRef = el as HTMLElement)}
            style={{ '--ui-dropdown-max-height': this.maxHeight }}
            role="listbox"
            aria-orientation="vertical"
          >
              {/* Search */}
              {this.searchable && (
                <div class="dropdown-search">
                  <ui-input
                    ref={(el) => (this.searchInputRef = el as any)}
                    value={this.searchQuery}
                    placeholder="Search..."
                    onValueChange={this.handleSearch}
                    icon="Search"
                  ></ui-input>
                </div>
              )}

              {/* Select All / Clear All (multi-select) */}
              {this.mode === 'multiple' && (this.selectAll || this.clearable) && (
                <div class="dropdown-actions">
                  {this.selectAll && (
                    <button class="dropdown-action-btn" onClick={this.selectAllOptions}>
                      Select All
                    </button>
                  )}
                  {this.clearable && hasSelection && (
                    <button class="dropdown-action-btn" onClick={this.clearAllOptions}>
                      Clear All
                    </button>
                  )}
                </div>
              )}

              {/* Options */}
              {Object.keys(groupedOptions).length === 0 && (
                <div class="dropdown-empty">No options available</div>
              )}

              {Object.entries(groupedOptions).map(([group, options]) => (
                <div key={group} class="dropdown-group">
                  {group !== 'default' && (
                    <div class="dropdown-group-label">{group}</div>
                  )}
                  {options.map((option, index) => {
                    const isSelected = this.mode === 'single'
                      ? this.internalValue === option.value
                      : Array.isArray(this.internalValue) && this.internalValue.includes(option.value);
                    const globalIndex = this.filteredOptions.indexOf(option);

                    return (
                      <div
                        key={option.value}
                        class={{
                          'dropdown-option': true,
                          'dropdown-option--selected': isSelected,
                          'dropdown-option--disabled': option.disabled,
                          'dropdown-option--highlighted': globalIndex === this.highlightedIndex,
                        }}
                        data-index={globalIndex}
                        onClick={() => this.selectOption(option)}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={option.disabled}
                      >
                        {this.mode === 'multiple' && (
                          <ui-checkbox
                            checked={isSelected}
                            disabled={option.disabled}
                            size="md"
                          ></ui-checkbox>
                        )}
                        <span class="dropdown-option-label">{option.label}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
        </div>
      </Host>
    );
  }
}
