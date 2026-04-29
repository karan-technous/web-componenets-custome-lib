import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  ElementRef,
  Optional,
  Self,
  ViewChild,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { ensureCustomElements } from '../register-custom-elements';
import type { TabIconClickDetail, TabItem } from '@karan9186/core/dist/types/tabs.types';

ensureCustomElements();

@Component({
  selector: 'ui-tabs-angular',
  standalone: true,
  templateUrl: './tabs.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTabsComponent),
      multi: true,
    },
  ],
})
export class UiTabsComponent implements ControlValueAccessor {
  constructor(@Optional() @Self() private readonly ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  @ViewChild('tabsEl', { static: true }) tabsEl!: ElementRef<HTMLElement & {
    changeTab?: (index: number) => Promise<void>;
    getHeader?: () => Promise<HTMLElement>;
  }>;

  tabs = input<TabItem[]>([]);
  activeIndex = input<number | undefined>(undefined);
  defaultActiveIndex = input<number>(0);
  scrollable = input<boolean>(false);
  customTooltipClass = input<string | undefined>(undefined);
  tagColor = input<string | undefined>(undefined);

  controlValue = signal<number | null>(null);
  disabledState = signal(false);

  getSelectedTab = output<TabItem>();
  getTabIndex = output<number>();
  tabIconClicked = output<TabIconClickDetail>();

  readonly resolvedActiveIndex = computed(() => {
    const explicit = this.activeIndex();
    if (typeof explicit === 'number') {
      return explicit;
    }

    const fromControl = this.controlValue();
    return typeof fromControl === 'number' ? fromControl : undefined;
  });

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    this.controlValue.set(typeof value === 'number' ? value : null);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  handleSelectedTab(event: Event): void {
    this.getSelectedTab.emit((event as CustomEvent<TabItem>).detail);
  }

  handleTabIndex(event: Event): void {
    const detail = (event as CustomEvent<number>).detail ?? 0;
    this.controlValue.set(detail);
    this.onChange(detail);
    this.onTouched();
    this.getTabIndex.emit(detail);
  }

  handleTabIconClicked(event: Event): void {
    this.tabIconClicked.emit((event as CustomEvent<TabIconClickDetail>).detail);
  }

  async changeTab(index: number): Promise<void> {
    await this.tabsEl?.nativeElement?.changeTab?.(index);
  }

  async getHeader(): Promise<HTMLElement | null> {
    return (await this.tabsEl?.nativeElement?.getHeader?.()) ?? null;
  }
}

@Directive({
  selector: '[uiTabs]',
  standalone: true,
  host: {
    '[attr.data-ui-tabs]': '"true"',
  },
})
export class UiTabsDirective {}
