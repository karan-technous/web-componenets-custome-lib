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

type DateRangeValue = { start: Date; end: Date };
type DatePickerValue = Date | DateRangeValue | null | undefined;
type DatePickerMode = 'single' | 'range';

export interface DatePickerParser {
  regex: RegExp;
  parse: (match: RegExpMatchArray) => Date | DateRangeValue;
}

type ParseSource = 'main' | 'search';

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

@Component({
  tag: 'ui-date-picker',
  shadow: true,
  styleUrl: 'ui-date-picker.css',
})
export class UiDatePicker extends BaseComponent {
  @Element() hostEl!: HTMLElement;

  @Prop() value?: Date | DateRangeValue | null;
  @Prop() defaultValue?: Date | DateRangeValue | null;
  @Prop({ reflect: true }) mode: DatePickerMode = 'single';
  @Prop({ reflect: true }) placeholder: string = 'Enter date (e.g. 1 Jan 2020)';
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) loading: boolean = false;
  @Prop({ reflect: true }) readonly: boolean = false;
  @Prop({ reflect: true }) open?: boolean;
  @Prop() defaultOpen: boolean = false;
  @Prop() minDate?: Date;
  @Prop() maxDate?: Date;
  @Prop({ reflect: true }) showIcon: boolean = true;
  @Prop({ reflect: true }) iconOnly: boolean = false;
  @Prop({ reflect: true }) showActions: boolean = false;
  @Prop({ reflect: true }) search: boolean = false;
  @Prop() icon?: string | HTMLElement;
  @Prop() customParsers?: DatePickerParser[];
  @Prop() debounce: number = 220;

  @Event({ eventName: 'onChange' }) onChange!: EventEmitter<Date | DateRangeValue>;
  @Event({ eventName: 'onApply' }) onApply!: EventEmitter<Date | DateRangeValue>;
  @Event({ eventName: 'onCancel' }) onCancel!: EventEmitter<void>;
  @Event({ eventName: 'onInputChange' }) onInputChange!: EventEmitter<string>;
  @Event({ eventName: 'onOpenChange' }) onOpenChange!: EventEmitter<boolean>;
  @Event({ eventName: 'onInvalidInput' }) onInvalidInput!: EventEmitter<string>;
  @Event({ eventName: 'onFocus' }) onFocus!: EventEmitter<void>;
  @Event({ eventName: 'onBlur' }) onBlur!: EventEmitter<void>;

  @State() internalOpen = false;
  @State() inputValue = '';
  @State() searchValue = '';
  @State() currentMonth = this.startOfMonth(new Date());
  @State() lazyReady = false;
  @State() hasInputError = false;
  @State() hasSearchError = false;
  @State() focusedDay?: Date;
  @State() selectingRangeStart?: Date;
  @State() monthDirection: 'left' | 'right' = 'right';
  @State() shake = false;

  private inputEl?: HTMLInputElement;
  private searchInputEl?: HTMLInputElement;
  private parseTimerMain?: ReturnType<typeof setTimeout>;
  private parseTimerSearch?: ReturnType<typeof setTimeout>;
  private shakeTimer?: ReturnType<typeof setTimeout>;
  private isOpenControlled = false;
  private isValueControlled = false;
  private committedValue?: Date | DateRangeValue;
  private draftValue?: Date | DateRangeValue;

  componentWillLoad() {
    this.isValueControlled = this.hostEl.hasAttribute('value');
    this.isOpenControlled = typeof this.open === 'boolean';
    this.internalOpen = this.isOpenControlled ? !!this.open : !!this.defaultOpen;
    const initialValue = this.isValueControlled ? this.value : this.defaultValue;
    this.committedValue = this.normalizeSelection(initialValue);
    this.draftValue = this.cloneSelection(this.committedValue);
    this.syncUiFromSelection(this.activeSelection());
  }

  disconnectedCallback() {
    if (this.parseTimerMain) clearTimeout(this.parseTimerMain);
    if (this.parseTimerSearch) clearTimeout(this.parseTimerSearch);
    if (this.shakeTimer) clearTimeout(this.shakeTimer);
  }

  @Watch('value')
  handleValueChanged() {
    this.isValueControlled = true;
    this.committedValue = this.normalizeSelection(this.value);
    this.draftValue = this.cloneSelection(this.committedValue);
    this.syncUiFromSelection(this.activeSelection());
  }

  @Watch('open')
  handleOpenChanged(nextOpen: boolean | undefined) {
    if (typeof nextOpen !== 'boolean') return;
    this.internalOpen = nextOpen;
    if (nextOpen) this.lazyReady = true;
  }

  @Watch('mode')
  handleModeChanged() {
    this.committedValue = this.normalizeSelection(this.committedValue);
    this.draftValue = this.cloneSelection(this.committedValue);
    this.syncUiFromSelection(this.activeSelection());
  }

  @Listen('mousedown', { target: 'document' })
  handleClickOutside(event: MouseEvent) {
    if (!this.internalOpen) return;
    if (!this.hostEl.contains(event.target as Node)) {
      this.setOpen(false);
    }
  }

  private setOpen(nextOpen: boolean) {
    if (this.disabled) return;
    if (!this.isOpenControlled) {
      this.internalOpen = nextOpen;
    }
    if (nextOpen) {
      this.lazyReady = true;
      this.draftValue = this.cloneSelection(this.committedValue);
      this.syncUiFromSelection(this.activeSelection());
      this.hasSearchError = false;
    } else {
      this.selectingRangeStart = undefined;
    }
    this.onOpenChange.emit(nextOpen);
  }

  private activeSelection() {
    return this.showActions ? this.draftValue : this.committedValue;
  }

  private cloneSelection(value?: Date | DateRangeValue) {
    if (!value) return undefined;
    if (value instanceof Date) return new Date(value);
    return { start: new Date(value.start), end: new Date(value.end) };
  }

  private normalizeSelection(nextValue: DatePickerValue): Date | DateRangeValue | undefined {
    if (!nextValue) return undefined;
    if (this.mode === 'single') {
      const nextDate = this.isValidDate(nextValue) ? (nextValue as Date) : undefined;
      return nextDate ? this.normalizeDate(nextDate) : undefined;
    }
    const range = this.asRange(nextValue);
    return range;
  }

  private syncUiFromSelection(nextValue?: Date | DateRangeValue) {
    if (this.mode === 'single') {
      const nextDate = this.isValidDate(nextValue) ? this.normalizeDate(nextValue as Date) : undefined;
      this.inputValue = nextDate ? this.formatDate(nextDate) : '';
      this.searchValue = this.inputValue;
      this.focusedDay = nextDate;
      this.currentMonth = this.startOfMonth(nextDate ?? new Date());
      return;
    }

    const range = this.asRange(nextValue);
    if (!range) {
      this.inputValue = '';
      this.searchValue = '';
      this.focusedDay = undefined;
      this.selectingRangeStart = undefined;
      this.currentMonth = this.startOfMonth(new Date());
      return;
    }

    this.inputValue = `${this.formatDate(range.start)} - ${this.formatDate(range.end)}`;
    this.searchValue = this.inputValue;
    this.focusedDay = range.end;
    this.currentMonth = this.startOfMonth(range.start);
    this.selectingRangeStart = undefined;
  }

  private normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private isValidDate(value: unknown): value is Date {
    return value instanceof Date && !Number.isNaN(value.getTime());
  }

  private asRange(value: DatePickerValue): DateRangeValue | undefined {
    if (!value || value instanceof Date) return undefined;
    if (!this.isValidDate(value.start) || !this.isValidDate(value.end)) return undefined;
    const start = this.normalizeDate(value.start);
    const end = this.normalizeDate(value.end);
    return start.getTime() <= end.getTime() ? { start, end } : { start: end, end: start };
  }

  private startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private compareDay(a?: Date, b?: Date): boolean {
    if (!a || !b) return false;
    return this.normalizeDate(a).getTime() === this.normalizeDate(b).getTime();
  }

  private inRange(day: Date, range?: DateRangeValue): boolean {
    if (!range) return false;
    const value = this.normalizeDate(day).getTime();
    return value >= range.start.getTime() && value <= range.end.getTime();
  }

  private isDisabledDate(date: Date) {
    const normalized = this.normalizeDate(date);
    const min = this.minDate ? this.normalizeDate(this.minDate).getTime() : undefined;
    const max = this.maxDate ? this.normalizeDate(this.maxDate).getTime() : undefined;
    if (typeof min === 'number' && normalized.getTime() < min) return true;
    if (typeof max === 'number' && normalized.getTime() > max) return true;
    return false;
  }

  private formatDate(date: Date): string {
    return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
  }

  private parseBuiltInSingle(raw: string): Date | undefined {
    const input = raw.trim().toLowerCase().replace(/,/g, ' ');
    const monthMap: Record<string, number> = {
      jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
      may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7,
      sep: 8, sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10,
      dec: 11, december: 11,
    };

    const normalizeDay = (v: string) => Number(v.replace(/(st|nd|rd|th)$/i, ''));

    const m1 = input.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)\s+(\d{4})$/i);
    if (m1) {
      const day = normalizeDay(m1[1]);
      const month = monthMap[m1[2]];
      const year = Number(m1[3]);
      return this.safeDate(year, month, day);
    }

    const m2 = input.match(/^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\d{4})$/i);
    if (m2) {
      const month = monthMap[m2[1]];
      const day = normalizeDay(m2[2]);
      const year = Number(m2[3]);
      return this.safeDate(year, month, day);
    }

    const m3 = input.match(/^(\d{4})\s+([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?$/i);
    if (m3) {
      const year = Number(m3[1]);
      const month = monthMap[m3[2]];
      const day = normalizeDay(m3[3]);
      return this.safeDate(year, month, day);
    }

    const m4 = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m4) {
      const day = Number(m4[1]);
      const month = Number(m4[2]) - 1;
      const year = Number(m4[3]);
      return this.safeDate(year, month, day);
    }

    const m5 = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m5) {
      const year = Number(m5[1]);
      const month = Number(m5[2]) - 1;
      const day = Number(m5[3]);
      return this.safeDate(year, month, day);
    }

    return undefined;
  }

  private parseBuiltInRange(raw: string): DateRangeValue | undefined {
    const parts = raw.split(/\s*-\s*/);
    if (parts.length !== 2) return undefined;
    const start = this.parseBuiltInSingle(parts[0]);
    const end = this.parseBuiltInSingle(parts[1]);
    if (!start || !end) return undefined;
    return start.getTime() <= end.getTime() ? { start, end } : { start: end, end: start };
  }

  private safeDate(year: number, month: number, day: number): Date | undefined {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return undefined;
    if (month < 0 || month > 11 || day < 1 || day > 31) return undefined;
    const out = new Date(year, month, day);
    if (out.getFullYear() !== year || out.getMonth() !== month || out.getDate() !== day) return undefined;
    return this.isDisabledDate(out) ? undefined : out;
  }

  private triggerInvalid(source: ParseSource, raw: string) {
    if (source === 'main') {
      this.hasInputError = true;
      this.searchValue = raw;
    } else {
      this.hasSearchError = true;
    }
    this.onInvalidInput.emit(raw);
    this.shake = true;
    if (this.shakeTimer) clearTimeout(this.shakeTimer);
    this.shakeTimer = setTimeout(() => {
      this.shake = false;
    }, 260);
  }

  private updateSelection(next: Date | DateRangeValue, source: ParseSource) {
    this.hasInputError = false;
    this.hasSearchError = false;
    const normalized = this.normalizeSelection(next);
    if (!normalized) return;
    this.draftValue = this.cloneSelection(normalized);
    this.syncUiFromSelection(this.activeSelection());
    this.searchValue = this.inputValue;
    if (!this.showActions) {
      this.commitDraft(true);
      if (source !== 'search') {
        this.setOpen(false);
      }
    }
  }

  private commitDraft(emitApply = false) {
    if (!this.draftValue) return;
    const normalized = this.normalizeSelection(this.draftValue);
    if (!normalized) return;
    this.committedValue = this.cloneSelection(normalized);
    if (!this.isValueControlled) {
      this.value = this.cloneSelection(normalized);
    }
    this.onChange.emit(normalized);
    if (emitApply) {
      this.onApply.emit(normalized);
    }
  }

  private cancelDraft() {
    this.draftValue = this.cloneSelection(this.committedValue);
    this.syncUiFromSelection(this.activeSelection());
    this.onCancel.emit();
    this.setOpen(false);
  }

  private onInput = (event: Event) => {
    if (this.readonly || this.loading) return;
    const raw = (event.target as HTMLInputElement).value;
    this.inputValue = raw;
    this.searchValue = raw;
    this.onInputChange.emit(raw);
    if (this.parseTimerMain) clearTimeout(this.parseTimerMain);
    const wait = Number.isFinite(this.debounce) && this.debounce >= 0 ? this.debounce : 200;
    this.parseTimerMain = setTimeout(() => {
      this.tryParseInput(raw, 'main');
    }, wait);
  };

  private onSearchInput = (event: Event) => {
    const raw = (event.target as HTMLInputElement).value;
    this.searchValue = raw;
    this.onInputChange.emit(raw);
    if (this.parseTimerSearch) clearTimeout(this.parseTimerSearch);
    const wait = Number.isFinite(this.debounce) && this.debounce >= 0 ? this.debounce : 200;
    this.parseTimerSearch = setTimeout(() => {
      this.tryParseInput(raw, 'search');
    }, wait);
  };

  private tryParseInput(raw: string, source: ParseSource) {
    const input = raw.trim();
    if (!input) {
      this.hasInputError = false;
      this.hasSearchError = false;
      return;
    }

    let parsed: Date | DateRangeValue | undefined =
      this.mode === 'single' ? this.parseBuiltInSingle(input) : this.parseBuiltInRange(input);

    if (!parsed && this.customParsers?.length) {
      for (const parser of this.customParsers) {
        try {
          const match = input.match(parser.regex);
          if (!match) continue;
          const custom = parser.parse(match);
          if (custom instanceof Date && this.isValidDate(custom) && !this.isDisabledDate(custom)) {
            parsed = this.normalizeDate(custom);
            break;
          }
          const range = this.asRange(custom as DateRangeValue);
          if (range && !this.isDisabledDate(range.start) && !this.isDisabledDate(range.end)) {
            parsed = range;
            break;
          }
        } catch {
          // Ignore parser errors and continue with remaining parsers.
        }
      }
    }

    if (!parsed) {
      this.triggerInvalid(source, raw);
      return;
    }

    if (parsed instanceof Date) {
      const normalized = this.normalizeDate(parsed);
      this.focusedDay = normalized;
      this.currentMonth = this.startOfMonth(normalized);
      this.updateSelection(normalized, source);
      return;
    }

    const range = this.asRange(parsed);
    if (!range) {
      this.triggerInvalid(source, raw);
      return;
    }

    this.currentMonth = this.startOfMonth(range.start);
    this.focusedDay = range.end;
    this.updateSelection(range, source);
  }

  private handleDaySelect(day: Date) {
    if (this.isDisabledDate(day)) return;
    const normalized = this.normalizeDate(day);

    if (this.mode === 'single') {
      this.updateSelection(normalized, 'main');
      this.focusedDay = normalized;
      return;
    }

    const currentRange = this.asRange(this.activeSelection());
    if (!this.selectingRangeStart || currentRange) {
      this.selectingRangeStart = normalized;
      this.inputValue = `${this.formatDate(normalized)} - `;
      this.searchValue = this.inputValue;
      return;
    }

    const start = this.selectingRangeStart.getTime() <= normalized.getTime() ? this.selectingRangeStart : normalized;
    const end = this.selectingRangeStart.getTime() <= normalized.getTime() ? normalized : this.selectingRangeStart;
    this.selectingRangeStart = undefined;
    this.updateSelection({ start, end }, 'main');
  }

  private shiftFocusedDay(days: number) {
    const active = this.activeSelection();
    const base = this.focusedDay ?? (this.mode === 'single' && this.isValidDate(active) ? (active as Date) : new Date());
    const next = this.normalizeDate(new Date(base.getTime() + days * DAY_MS));
    if (this.isDisabledDate(next)) return;
    this.focusedDay = next;
    this.currentMonth = this.startOfMonth(next);
  }

  private onInputKeyDown = (event: KeyboardEvent) => {
    if (!this.internalOpen && ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
      event.preventDefault();
      this.setOpen(true);
      return;
    }

    if (!this.internalOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.setOpen(false);
      this.inputEl?.focus();
      return;
    }

    const keyMap: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: 7,
      ArrowUp: -7,
    };
    if (keyMap[event.key]) {
      event.preventDefault();
      this.shiftFocusedDay(keyMap[event.key]);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleDaySelect(this.focusedDay ?? new Date());
    }
  };

  private goToMonth(offset: number) {
    this.monthDirection = offset < 0 ? 'left' : 'right';
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + offset, 1);
  }

  private renderCalendarGrid() {
    const start = new Date(this.currentMonth);
    start.setDate(1 - start.getDay());
    const cells: Date[] = [];
    for (let i = 0; i < 42; i += 1) {
      cells.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
    }

    const active = this.activeSelection();
    const selectedDate = this.mode === 'single' && this.isValidDate(active) ? this.normalizeDate(active as Date) : undefined;
    const selectedRange = this.mode === 'range' ? this.asRange(active) : undefined;
    const today = this.normalizeDate(new Date());

    return (
      <div class="calendar-grid" role="grid" aria-label="Calendar dates">
        {WEEKDAYS.map((day) => (
          <div class="weekday" role="columnheader">
            {day}
          </div>
        ))}
        {cells.map((day) => {
          const normalized = this.normalizeDate(day);
          const outOfMonth = normalized.getMonth() !== this.currentMonth.getMonth();
          const disabled = this.isDisabledDate(normalized);
          const selectedSingle = this.compareDay(selectedDate, normalized);
          const inSelectedRange = this.inRange(normalized, selectedRange);
          const selectedStart = this.compareDay(selectedRange?.start, normalized);
          const selectedEnd = this.compareDay(selectedRange?.end, normalized);
          const rangeDraft = this.selectingRangeStart
            ? this.asRange({ start: this.selectingRangeStart, end: this.focusedDay ?? this.selectingRangeStart })
            : undefined;
          const inDraftRange = this.mode === 'range' && !selectedRange && this.inRange(normalized, rangeDraft);
          const isFocused = this.compareDay(this.focusedDay, normalized);

          return (
            <button
              class={{
                day: true,
                'day--out': outOfMonth,
                'day--disabled': disabled,
                'day--today': this.compareDay(today, normalized),
                'day--selected': selectedSingle || selectedStart || selectedEnd,
                'day--in-range': inSelectedRange || inDraftRange,
                'day--focused': isFocused,
              }}
              type="button"
              role="gridcell"
              aria-selected={selectedSingle || selectedStart || selectedEnd ? 'true' : 'false'}
              aria-disabled={disabled ? 'true' : 'false'}
              disabled={disabled}
              onClick={() => this.handleDaySelect(normalized)}
              onMouseEnter={() => (this.focusedDay = normalized)}
            >
              {normalized.getDate()}
            </button>
          );
        })}
      </div>
    );
  }

  private renderIcon() {
    if (!this.showIcon) return null;
    if (typeof this.icon === 'string') {
      return <span class="icon-slot" innerHTML={this.icon}></span>;
    }
    return (
      <span class="icon-slot" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="5" width="18" height="16" rx="2"></rect>
          <line x1="16" y1="3" x2="16" y2="7"></line>
          <line x1="8" y1="3" x2="8" y2="7"></line>
          <line x1="3" y1="11" x2="21" y2="11"></line>
        </svg>
      </span>
    );
  }

  render() {
    const monthLabel = `${MONTHS[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
    const isReadonlyInput = this.readonly || this.loading;

    return (
      <Host>
        <div
          class={{
            root: true,
            'root--open': this.internalOpen,
            'root--error': this.hasInputError,
            'root--disabled': this.disabled,
            'root--shake': this.shake,
            'root--icon-only': this.iconOnly,
          }}
        >
          <div class="trigger">
            {!this.iconOnly && (
              <input
                ref={(el) => (this.inputEl = el as HTMLInputElement)}
                class="input"
                type="text"
                value={this.inputValue}
                placeholder={this.placeholder}
                disabled={this.disabled}
                readonly={isReadonlyInput}
                onInput={this.onInput}
                onFocus={() => this.onFocus.emit()}
                onBlur={() => this.onBlur.emit()}
                onClick={() => this.setOpen(true)}
                onKeyDown={this.onInputKeyDown}
                aria-expanded={this.internalOpen ? 'true' : 'false'}
                aria-haspopup="grid"
              />
            )}
            {(this.showIcon || this.iconOnly) && (
              <button
                class="icon-button"
                type="button"
                disabled={this.disabled}
                aria-label="Toggle calendar"
                onClick={() => this.setOpen(!this.internalOpen)}
              >
                {this.renderIcon()}
              </button>
            )}
          </div>

          {this.internalOpen && this.lazyReady && (
            <div class="popover" role="dialog" aria-label="Date picker" onKeyDown={this.onInputKeyDown}>
              {this.search && (
                <div class="search-wrap">
                  <input
                    ref={(el) => (this.searchInputEl = el as HTMLInputElement)}
                    class={{ 'search-input': true, 'search-input--error': this.hasSearchError }}
                    type="text"
                    value={this.searchValue}
                    placeholder="Search date (e.g. 1 Jan 2020 or today)"
                    onInput={this.onSearchInput}
                  />
                </div>
              )}
              <div class="calendar-header">
                <button
                  type="button"
                  class="nav-btn"
                  aria-label="Previous month"
                  onClick={() => this.goToMonth(-1)}
                >
                  <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                    <path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </button>
                <span class="month-label">{monthLabel}</span>
                <button
                  type="button"
                  class="nav-btn"
                  aria-label="Next month"
                  onClick={() => this.goToMonth(1)}
                >
                  <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                    <path d="M8 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </button>
              </div>
              <div class={{ 'calendar-body': true, [`calendar-body--${this.monthDirection}`]: true }}>
                {this.renderCalendarGrid()}
              </div>
              {this.showActions && (
                <div class="actions">
                  <button type="button" class="action-btn action-btn--ghost" onClick={() => this.cancelDraft()}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="action-btn action-btn--primary"
                    onClick={() => {
                      this.commitDraft(true);
                      this.setOpen(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
