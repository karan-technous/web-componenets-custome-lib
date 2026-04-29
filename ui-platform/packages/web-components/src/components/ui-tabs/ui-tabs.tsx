import {
  Component,
  Element,
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
import type { TabIconClickDetail, TabItem } from '@karan9186/core/dist/types/tabs.types';

@Component({
  tag: 'ui-tabs',
  shadow: true,
  styleUrl: 'ui-tabs.css',
})
export class UiTabs extends BaseComponent {
  @Element() hostEl!: HTMLElement;

  @Prop({ mutable: true }) tabs: TabItem[] = [];
  @Prop({ mutable: true }) activeIndex?: number;
  @Prop() defaultActiveIndex: number = 0;
  @Prop() scrollable: boolean = false;
  @Prop() customTooltipClass?: string;
  @Prop() tagColor?: string;

  @State() internalActiveIndex: number = 0;
  @State() indicatorLeft = 0;
  @State() indicatorWidth = 0;

  @Event() getSelectedTab!: EventEmitter<TabItem>;
  @Event() getTabIndex!: EventEmitter<number>;
  @Event() tabIconClicked!: EventEmitter<TabIconClickDetail>;

  private headerEl?: HTMLElement;
  private tabButtonEls: HTMLButtonElement[] = [];
  private contentEl?: HTMLDivElement;
  private resizeObserver?: ResizeObserver;
  private lastResolvedKey?: string;

  componentWillLoad() {
    // Accept `tabs` as an actual array or a JSON string (used by story WC renderer)
    if (typeof (this.tabs as any) === 'string') {
      try {
        const parsed = JSON.parse(this.tabs as unknown as string);
        if (Array.isArray(parsed)) {
          this.tabs = parsed as TabItem[];
        }
      } catch {
        // ignore parse errors and fall back to default
      }
    }

    const normalizedTabs = this.getTabs();
    this.internalActiveIndex = this.resolveInitialIndex(normalizedTabs);
    this.lastResolvedKey = normalizedTabs[this.internalActiveIndex]?.key;
  }

  componentDidLoad() {
    this.updateIndicator();
    this.syncContentNode();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateIndicator();
      });

      if (this.headerEl) {
        this.resizeObserver.observe(this.headerEl);
      }
    }
  }

  componentDidRender() {
    this.updateIndicator();
    this.syncContentNode();
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
  }

  @Watch('tabs')
  handleTabsChanged(nextTabs: TabItem[]) {
    const normalizedTabs = this.normalizeTabs(nextTabs);
    const nextIndex = this.resolveIndexForTabs(normalizedTabs);
    const previousIndex = this.getResolvedActiveIndex();
    this.lastResolvedKey = normalizedTabs[nextIndex]?.key;

    if (this.isControlled()) {
      if (typeof this.activeIndex !== 'number' || nextIndex !== this.activeIndex) {
        this.activeIndex = nextIndex;
      }
      return;
    }

    this.internalActiveIndex = nextIndex;

    if (previousIndex !== nextIndex) {
      this.emitSelection(normalizedTabs, nextIndex);
    }
  }

  @Watch('activeIndex')
  handleActiveIndexChanged(nextActiveIndex: number | undefined) {
    if (typeof nextActiveIndex !== 'number') {
      return;
    }

    const previousIndex = this.internalActiveIndex;
    const normalizedTabs = this.getTabs();
    const nextIndex = this.resolveSelectableIndex(nextActiveIndex, normalizedTabs);
    this.lastResolvedKey = normalizedTabs[nextIndex]?.key;

    if (nextIndex !== nextActiveIndex) {
      this.activeIndex = nextIndex;
      return;
    }

    this.internalActiveIndex = nextIndex;
    if (previousIndex !== nextIndex) {
      this.emitSelection(normalizedTabs, nextIndex);
    }
  }

  @Method()
  async changeTab(index: number): Promise<void> {
    this.selectTab(index);
  }

  @Method()
  async getHeader(): Promise<HTMLElement> {
    return this.headerEl ?? this.hostEl;
  }

  private isControlled() {
    return typeof this.activeIndex === 'number';
  }

  private normalizeTabs(tabs?: TabItem[]) {
    if (!Array.isArray(tabs)) {
      return [];
    }

    return tabs
      .filter((tab): tab is TabItem => !!tab && typeof tab.key === 'string' && typeof tab.label === 'string')
      .map((tab) => ({
        ...tab,
        disabled: !!tab.disabled,
      }));
  }

  private getTabs() {
    return this.normalizeTabs(this.tabs);
  }

  private getResolvedActiveIndex() {
    return this.isControlled()
      ? this.resolveSelectableIndex(this.activeIndex ?? 0, this.getTabs())
      : this.resolveSelectableIndex(this.internalActiveIndex, this.getTabs());
  }

  private resolveInitialIndex(tabs: TabItem[]) {
    const seed = this.isControlled() ? this.activeIndex ?? 0 : this.defaultActiveIndex;
    return this.resolveSelectableIndex(seed, tabs);
  }

  private resolveIndexForTabs(tabs: TabItem[]) {
    if (tabs.length === 0) {
      return 0;
    }

    if (this.lastResolvedKey) {
      const keyedIndex = tabs.findIndex((tab) => tab.key === this.lastResolvedKey && !tab.disabled);
      if (keyedIndex >= 0) {
        return keyedIndex;
      }
    }

    const candidate = this.isControlled() ? this.activeIndex ?? 0 : this.internalActiveIndex;
    return this.resolveSelectableIndex(candidate, tabs);
  }

  private resolveSelectableIndex(index: number, tabs: TabItem[]) {
    if (tabs.length === 0) {
      return 0;
    }

    const bounded = Number.isFinite(index)
      ? Math.max(0, Math.min(index, tabs.length - 1))
      : 0;

    if (!tabs[bounded]?.disabled) {
      return bounded;
    }

    const nextEnabled = tabs.findIndex((tab) => !tab.disabled);
    return nextEnabled >= 0 ? nextEnabled : 0;
  }

  private emitSelection(tabs: TabItem[], index: number) {
    const tab = tabs[index];

    if (!tab) {
      return;
    }

    this.getTabIndex.emit(index);
    this.getSelectedTab.emit(tab);
  }

  private selectTab(index: number, emit = true) {
    const tabs = this.getTabs();
    const nextIndex = this.resolveSelectableIndex(index, tabs);
    const nextTab = tabs[nextIndex];

    if (!nextTab || nextTab.disabled) {
      return;
    }

    const previousIndex = this.getResolvedActiveIndex();

    if (this.isControlled()) {
      this.activeIndex = nextIndex;
    } else {
      this.internalActiveIndex = nextIndex;
    }

    this.lastResolvedKey = nextTab.key;
    this.focusTab(nextIndex);
    this.scrollTabIntoView(nextIndex);

    if (emit && !this.isControlled() && previousIndex !== nextIndex) {
      this.emitSelection(tabs, nextIndex);
    }
  }

  private focusTab(index: number) {
    this.tabButtonEls[index]?.focus();
  }

  private scrollTabIntoView(index: number) {
    if (!this.scrollable) {
      return;
    }

    this.tabButtonEls[index]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }

  private handleTabClick = (index: number) => {
    this.selectTab(index);
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    const tabs = this.getTabs();
    if (tabs.length === 0) {
      return;
    }

    const currentIndex = this.tabButtonEls.findIndex((button) => button === document.activeElement);
    if (currentIndex < 0) {
      return;
    }

    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
      return;
    }

    event.preventDefault();

    if (event.key === 'Enter' || event.key === ' ') {
      this.selectTab(currentIndex);
      return;
    }

    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    const nextIndex =
      event.key === 'Home'
        ? this.findNextEnabledIndex(tabs, 0, 1)
        : event.key === 'End'
          ? this.findNextEnabledIndex(tabs, tabs.length - 1, -1)
          : this.findWrappedEnabledIndex(tabs, currentIndex, direction);

    if (nextIndex >= 0) {
      this.focusTab(nextIndex);
      this.selectTab(nextIndex);
    }
  };

  private findNextEnabledIndex(tabs: TabItem[], start: number, step: 1 | -1) {
    for (let index = start; index >= 0 && index < tabs.length; index += step) {
      if (!tabs[index].disabled) {
        return index;
      }
    }

    return -1;
  }

  private findWrappedEnabledIndex(tabs: TabItem[], currentIndex: number, direction: number) {
    for (let offset = 1; offset <= tabs.length; offset += 1) {
      const nextIndex = (currentIndex + direction * offset + tabs.length) % tabs.length;
      if (!tabs[nextIndex].disabled) {
        return nextIndex;
      }
    }

    return currentIndex;
  }

  private handleIconClick = (event: Event, index: number, tab: TabItem) => {
    event.preventDefault();
    event.stopPropagation();
    this.tabIconClicked.emit({ index, tab });
  };

  private resolveTagColor(token?: string) {
    const value = token?.trim();
    if (!value) {
      return undefined;
    }

    if (value.startsWith('var(')) {
      return value;
    }

    if (value.startsWith('--ui-')) {
      return `var(${value})`;
    }

    const map: Record<string, string> = {
      primary: 'var(--ui-primary)',
      secondary: 'var(--ui-secondary-foreground)',
      accent: 'var(--ui-accent)',
      destructive: 'var(--ui-destructive)',
      foreground: 'var(--ui-foreground)',
      text: 'var(--ui-text)',
      muted: 'var(--ui-text-muted)',
      border: 'var(--ui-border-color)',
    };

    return map[value] ?? 'var(--ui-primary)';
  }

  private updateIndicator() {
    const activeButton = this.tabButtonEls[this.getResolvedActiveIndex()];

    if (!activeButton || !this.headerEl) {
      this.indicatorLeft = 0;
      this.indicatorWidth = 0;
      return;
    }

    const headerRect = this.headerEl.getBoundingClientRect();
    const activeRect = activeButton.getBoundingClientRect();
    this.indicatorLeft = activeRect.left - headerRect.left + this.headerEl.scrollLeft;
    this.indicatorWidth = activeRect.width;
  }

  private syncContentNode() {
    const container = this.contentEl;
    if (!container) {
      return;
    }

    const activeTab = this.getTabs()[this.getResolvedActiveIndex()];

    if (!(activeTab?.content instanceof HTMLElement)) {
      return;
    }

    container.innerHTML = '';
    container.appendChild(activeTab.content.cloneNode(true));
  }

  private setTabButtonRef = (index: number, element?: HTMLButtonElement | null) => {
    if (element) {
      this.tabButtonEls[index] = element;
      return;
    }

    this.tabButtonEls.splice(index, 1);
  };

  private renderTabLabel(tab: TabItem, index: number) {
    const label = (
      <span class="tab-button__label-wrap">
        <span class="tab-button__label">{tab.label}</span>
        {(tab.tagColor || this.tagColor) && (
          <span
            class="tab-button__tag"
            style={{ '--ui-tabs-tag-color': this.resolveTagColor(tab.tagColor || this.tagColor) }}
            aria-hidden="true"
          ></span>
        )}
      </span>
    );

    if (!tab.tooltip) {
      return label;
    }

    return (
      <ui-tooltip
        class={this.customTooltipClass}
        content={tab.tooltip}
        position="top"
        trigger="hover"
      >
        <span class="tab-button__tooltip-target" data-tab-index={index}>
          {label}
        </span>
      </ui-tooltip>
    );
  }

  private renderContent(tab?: TabItem) {
    if (!tab) {
      return null;
    }

    if (tab.content instanceof HTMLElement) {
      return <div ref={(el) => (this.contentEl = el as HTMLDivElement)} class="content__node"></div>;
    }

    return (
      <div ref={(el) => (this.contentEl = el as HTMLDivElement)} class="content__text">
        {tab.content ?? ''}
      </div>
    );
  }

  render() {
    const tabs = this.getTabs();
    const activeIndex = this.getResolvedActiveIndex();
    const activeTab = tabs[activeIndex];

    if (tabs.length === 0) {
      return <Host></Host>;
    }

    return (
      <Host>
        <div class="tabs">
          <div class={{ 'tabs__header-shell': true, 'tabs__header-shell--scrollable': this.scrollable }}>
            <div
              ref={(el) => (this.headerEl = el as HTMLElement)}
              class="tabs__header"
              role="tablist"
              onKeyDown={this.handleKeyDown}
            >
              {tabs.map((tab, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    ref={(el) => this.setTabButtonRef(index, el as HTMLButtonElement)}
                    key={tab.key}
                    type="button"
                    class={{
                      'tab-button': true,
                      'tab-button--active': isActive,
                      'tab-button--disabled': !!tab.disabled,
                    }}
                    role="tab"
                    aria-selected={isActive ? 'true' : 'false'}
                    aria-disabled={tab.disabled ? 'true' : 'false'}
                    tabindex={tab.disabled ? -1 : isActive ? 0 : -1}
                    disabled={tab.disabled}
                    onClick={() => this.handleTabClick(index)}
                  >
                    <span class="tab-button__inner">
                      {tab.icon && (
                        <span
                          class="tab-button__icon-button"
                          role="button"
                          tabindex={tab.disabled ? -1 : 0}
                          aria-label={`${tab.label} icon action`}
                          onClick={(event) => this.handleIconClick(event, index, tab)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              this.handleIconClick(event, index, tab);
                            }
                          }}
                        >
                          <ui-icon name={tab.icon as any} size="sm"></ui-icon>
                        </span>
                      )}
                      {this.renderTabLabel(tab, index)}
                    </span>
                  </button>
                );
              })}

              <span
                class="tabs__indicator"
                aria-hidden="true"
                style={{
                  transform: `translateX(${this.indicatorLeft}px)`,
                  width: `${this.indicatorWidth}px`,
                }}
              ></span>
            </div>
          </div>

          <div class="tabs__content" role="tabpanel">
            {this.renderContent(activeTab)}
          </div>
        </div>
      </Host>
    );
  }
}
