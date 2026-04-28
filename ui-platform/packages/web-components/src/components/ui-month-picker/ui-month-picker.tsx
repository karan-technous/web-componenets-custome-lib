import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
  Element,
} from '@stencil/core';
import { BaseComponent } from '../base/base-component';

@Component({
  tag: 'ui-month-picker',
  styleUrl: 'ui-month-picker.css',
  shadow: true,
})
export class UiMonthPicker extends BaseComponent {
  @Element() el!: HTMLElement;

  // ========================
  // Props
  // ========================
  @Prop({ mutable: true, reflect: true }) value?: string;
  @Prop({ reflect: true }) placeholder: string = 'Select month';
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) required: boolean = false;
  @Prop({ reflect: true }) errorMessage?: string;
  @Prop({ reflect: true }) minYear: number = 2000;
  @Prop({ reflect: true }) maxYear: number = 2100;

  // ========================
  // State
  // ========================
  @State() isOpen: boolean = false;
  @State() selectedMonth: number | null = null;
  @State() selectedYear: number = new Date().getFullYear();

  // ========================
  // Refs
  // ========================
  private monthListRef?: HTMLElement;

  // ========================
  // Events
  // ========================
  @Event({ eventName: 'valueChange' }) valueChange!: EventEmitter<string>;

  // ========================
  // Constants
  // ========================
  private months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  private monthOptions = this.months.map((month, idx) => ({
    label: month,
    value: idx,
  }));

  private getYearOptions = () => {
    const years = [];
    for (let i = this.minYear; i <= this.maxYear; i++) {
      years.push({
        label: i.toString(),
        value: i,
      });
    }
    return years;
  };

  // ========================
  // Lifecycle
  // ========================
  componentDidLoad() {
    this.parseValue();
    document.addEventListener('click', this.handleClickOutside);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  // ========================
  // Logic
  // ========================
  private parseValue() {
    if (!this.value) return;

    const parts = this.value.split(' ');
    if (parts.length !== 2) return;

    const [monthName, yearStr] = parts;
    const year = parseInt(yearStr, 10);

    const monthIndex = this.months.findIndex(
      (m) =>
        m.substring(0, 3).toLowerCase() === monthName.toLowerCase(),
    );

    if (monthIndex !== -1 && !isNaN(year)) {
      this.selectedMonth = monthIndex;
      this.selectedYear = year;
    }
  }

  private scrollToSelectedMonth = () => {
    if (!this.monthListRef || this.selectedMonth === null) return;

    const items = this.monthListRef.querySelectorAll('.item');
    const selectedItem = items[this.selectedMonth] as HTMLElement;

    if (selectedItem) {
      requestAnimationFrame(() => {
        selectedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      });
    }
  };

  private handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!this.el.contains(target) && this.isOpen) {
      this.isOpen = false;
    }
  };

  private toggleDropdown = () => {
    if (this.disabled) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      requestAnimationFrame(this.scrollToSelectedMonth);
    }
  };

  private emitValue() {
    if (this.selectedMonth === null) return;

    const label = this.months[this.selectedMonth].substring(0, 3);
    this.value = `${label} ${this.selectedYear}`;
    this.valueChange.emit(this.value);
  }

  private handleMonthChange = (e: CustomEvent<number>) => {
    this.selectedMonth = e.detail;
    this.emitValue();
  };

  private handleYearChange = (e: CustomEvent<number>) => {
    this.selectedYear = e.detail;
    this.emitValue();
  };

  // ========================
  // Render
  // ========================
  render() {
    const displayValue = this.value;

    return (
      <Host class={{ disabled: this.disabled }}>
        <div class="container">
          <ui-input
            value={displayValue}
            placeholder={this.placeholder}
            disabled={this.disabled}
            readonly={true}
            error={!!this.errorMessage}
            onClick={this.toggleDropdown}
          />

          {this.isOpen && (
            <div class="dropdown">
              <div class="header">
                <ui-dropdown
                  options={this.monthOptions}
                  value={this.selectedMonth ?? undefined}
                  placeholder="Select month"
                  onValueChange={this.handleMonthChange}
                />

                <ui-dropdown
                  options={this.getYearOptions()}
                  value={this.selectedYear}
                  placeholder="Select year"
                  onValueChange={this.handleYearChange}
                />
              </div>
            </div>
          )}

          {this.errorMessage && (
            <div class="error-message">{this.errorMessage}</div>
          )}
        </div>
      </Host>
    );
  }
}