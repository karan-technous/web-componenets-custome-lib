import { Component, h, Prop, Event, EventEmitter, State, Host, Listen, Element } from '@stencil/core';
import { BaseComponent } from '../base/base-component';
import { BreadcrumbSeparator, BreadcrumbEventDetail, BreadcrumbItem } from '@karan9186/core';

@Component({
  tag: 'ui-breadcrumb',
  styleUrl: 'ui-breadcrumb.css',
  shadow: true,
})
export class UiBreadcrumb extends BaseComponent {
  @Element() element: HTMLElement;

  // === PROPS ===

  /**
   * Breadcrumb items as JSON string
   */
  @Prop() items: string = '';

  /**
   * Separator between items
   * @default 'slash'
   */
  @Prop({ reflect: true }) separator: BreadcrumbSeparator = 'slash';

  /**
   * Maximum number of items before collapsing
   * @default undefined (no collapse)
   */
  @Prop({ reflect: true }) maxItems?: string;

  /**
   * Number of items to show before collapse indicator
   * @default 1
   */
  @Prop({ reflect: true }) itemsBeforeCollapse: number = 1;

  /**
   * Number of items to show after collapse indicator
   * @default 1
   */
  @Prop({ reflect: true }) itemsAfterCollapse: number = 1;

  /**
   * Whether the breadcrumb is disabled
   * @default false
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  // === STATE ===

  @State() parsedItems: Array<{ value: string; label: string; href?: string; active?: boolean; disabled?: boolean; icon?: any }> = [];
  @State() visibleItems: Array<{ value: string; label: string; href?: string; active?: boolean; disabled?: boolean; icon?: any; isCollapsed?: boolean }> = [];
  @State() isExpanded: boolean = false;
  @State() isDropdownOpen: boolean = false;
  @State() collapsedItems: Array<{ value: string; label: string; href?: string; active?: boolean; disabled?: boolean; icon?: any }> = [];

  // === EVENTS ===

  /**
   * Emitted when a breadcrumb item is clicked
   */
  @Event({ bubbles: true, composed: true }) uiClick: EventEmitter<BreadcrumbEventDetail>;

  // === LIFECYCLE ===

  componentWillLoad() {
    super.componentWillLoad();
    this.parseItems();
  }

  // === METHODS ===

  @Listen('itemClick')
  handleItemClick(event: CustomEvent<{ value: string; index: number }>) {
    event.stopPropagation();
    const item = this.parsedItems[event.detail.index];
    if (item && !item.disabled && !this.disabled) {
      this.uiClick.emit({
        value: item.value,
        index: event.detail.index,
        href: item.href,
      });
    }
  }

  private parseItems() {
    try {
      const parsed = JSON.parse(this.items);
      this.parsedItems = Array.isArray(parsed) ? parsed : [];
    } catch {
      this.parsedItems = [];
    }
    this.calculateVisibleItems();
  }

  private calculateVisibleItems() {
    const maxItemsNum = this.maxItems ? parseInt(this.maxItems, 10) : undefined;
    if (!maxItemsNum || this.parsedItems.length <= maxItemsNum) {
      this.visibleItems = this.parsedItems.map(item => ({ ...item, isCollapsed: false }));
      this.collapsedItems = [];
      this.isExpanded = false;
      return;
    }

    const beforeCount = this.itemsBeforeCollapse;
    const afterCount = this.itemsAfterCollapse;
    const totalVisible = beforeCount + afterCount;

    if (totalVisible >= this.parsedItems.length) {
      this.visibleItems = this.parsedItems.map(item => ({ ...item, isCollapsed: false }));
      this.collapsedItems = [];
      this.isExpanded = false;
      return;
    }

    if (this.isExpanded) {
      this.visibleItems = this.parsedItems.map(item => ({ ...item, isCollapsed: false }));
      this.collapsedItems = [];
      return;
    }

    const beforeItems = this.parsedItems.slice(0, beforeCount);
    const afterItems = this.parsedItems.slice(-afterCount);
    const collapsed = this.parsedItems.slice(beforeCount, -afterCount);

    this.collapsedItems = collapsed;
    this.visibleItems = [
      ...beforeItems.map(item => ({ ...item, isCollapsed: false })),
      { value: 'collapsed', label: '...', isCollapsed: true } as any,
      ...afterItems.map(item => ({ ...item, isCollapsed: false })),
    ];
  }

  private toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.calculateVisibleItems();
  }

  private toggleDropdown(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  private closeDropdown() {
    this.isDropdownOpen = false;
  }

  @Listen('click', { target: 'document' })
  handleDocumentClick(event: MouseEvent) {
    const breadcrumb = this.element;
    if (this.isDropdownOpen && !breadcrumb.contains(event.target as Node)) {
      this.closeDropdown();
    }
  }

  getSeparatorIcon() {
    switch (this.separator) {
      case 'chevron':
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
      case 'arrow':
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
      case 'slash':
      default:
        return '/';
    }
  }

  render() {
    const separatorIcon = this.getSeparatorIcon();

    return (
      <Host
        class={{
          'ui-breadcrumb--disabled': this.disabled,
        }}
      >
        <nav aria-label="Breadcrumb">
          <ol role="list" class="ui-breadcrumb__list">
            {this.visibleItems.map((item, index) => {
              const isLast = index === this.visibleItems.length - 1;
              const isCollapsed = (item as any).isCollapsed;

              return (
                <li
                  role="listitem"
                  class={{
                    'ui-breadcrumb__item': true,
                    'ui-breadcrumb__item--active': item.active,
                    'ui-breadcrumb__item--disabled': item.disabled || this.disabled,
                    'ui-breadcrumb__item--collapsed': isCollapsed,
                  }}
                  aria-current={item.active ? 'page' : undefined}
                >
                  {isCollapsed ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <span
                        class="ui-breadcrumb__collapsed"
                        onClick={(e) => this.toggleDropdown(e)}
                        style={{ cursor: 'pointer' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </span>
                      {this.isDropdownOpen && this.collapsedItems.length > 0 && (
                        <div class="ui-breadcrumb__dropdown">
                          <ul class="ui-breadcrumb__dropdown-list">
                            {this.collapsedItems.map((item, idx) => (
                              <li
                                class="ui-breadcrumb__dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  this.closeDropdown();
                                  this.uiClick.emit({
                                    value: item.value,
                                    index: this.itemsBeforeCollapse + idx,
                                    href: item.href,
                                  });
                                }}
                              >
                                {item.icon && (
                                  <span class="ui-breadcrumb__dropdown-icon">
                                    <ui-icon name={item.icon} size="sm"></ui-icon>
                                  </span>
                                )}
                                <span class="ui-breadcrumb__dropdown-text">{item.label}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div class="ui-breadcrumb__item-content">
                      {item.icon && (
                        <span class="ui-breadcrumb__icon" slot="icon">
                          <ui-icon name={item.icon} size="sm"></ui-icon>
                        </span>
                      )}
                      {item.href && !item.active && !item.disabled ? (
                        <a
                          href={item.href}
                          class="ui-breadcrumb__link"
                          onClick={(e) => {
                            e.preventDefault();
                            this.uiClick.emit({
                              value: item.value,
                              index,
                              href: item.href,
                            });
                          }}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span class="ui-breadcrumb__text">{item.label}</span>
                      )}
                    </div>
                  )}

                  {!isLast && !isCollapsed && (
                    <span class="ui-breadcrumb__separator" innerHTML={separatorIcon}></span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </Host>
    );
  }
}
