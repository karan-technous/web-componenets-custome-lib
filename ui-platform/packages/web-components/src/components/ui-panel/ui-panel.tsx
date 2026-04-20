import { Component, h, Prop, Event, EventEmitter, State, Host, Element, Method, Watch } from '@stencil/core';
import { BaseComponent } from '../base/base-component';

export type PanelVariant = 'default' | 'outlined' | 'elevated';
export type PanelSize = 'sm' | 'md' | 'lg';
export type PanelRounded = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  tag: 'ui-panel',
  styleUrl: 'ui-panel.css',
  shadow: true,
})
export class UiPanel extends BaseComponent {
  @Element() element: HTMLElement;

  // === PROPS ===

  /**
   * Visual variant of the panel
   * @default 'default'
   */
  @Prop({ reflect: true }) variant: PanelVariant = 'default';

  /**
   * Size of the panel
   * @default 'md'
   */
  @Prop({ reflect: true }) size: PanelSize = 'md';

  /**
   * Border radius of the panel
   * @default 'md'
   */
  @Prop({ reflect: true }) rounded: PanelRounded = 'md';

  /**
   * Whether the panel is collapsible
   * @default false
   */
  @Prop({ reflect: true }) collapsible: boolean = false;

  /**
   * Expanded state (can be controlled or uncontrolled)
   * @default true
   */
  @Prop({ reflect: true, mutable: true }) expanded: boolean = true;

  /**
   * Whether the panel is in loading state
   * @default false
   */
  @Prop({ reflect: true }) loading: boolean = false;

  /**
   * Whether the panel is disabled
   * @default false
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * Keeps header visible while scrolling panel content
   * @default false
   */
  @Prop({ reflect: true }) stickyHeader: boolean = false;

  /**
   * Renders body/footer only when expanded
   * @default false
   */
  @Prop({ reflect: true }) lazy: boolean = false;

  // === STATE ===

  @State() internalExpanded: boolean = true;
  @State() hasHeader: boolean = false;
  @State() hasActions: boolean = false;
  @State() hasFooter: boolean = false;
  @State() hasBody: boolean = false;

  private bodyId = `ui-panel-body-${Math.random().toString(36).slice(2, 10)}`;
  private isExpandedControlled = false;
  private headerSlot?: HTMLSlotElement;
  private actionsSlot?: HTMLSlotElement;
  private footerSlot?: HTMLSlotElement;
  private defaultSlot?: HTMLSlotElement;

  // === EVENTS ===

  /**
   * Emitted when panel is expanded/collapsed
   */
  @Event({ eventName: 'toggle' }) panelToggle: EventEmitter<boolean>;
  @Event({ eventName: 'expand' }) panelExpand: EventEmitter<boolean>;
  @Event({ eventName: 'collapse' }) panelCollapse: EventEmitter<boolean>;

  /**
   * @deprecated use `toggle`
   */
  @Event() uiToggle: EventEmitter<{ expanded: boolean }>;

  // === LIFECYCLE ===

  componentWillLoad() {
    this.internalExpanded = this.expanded;
    this.isExpandedControlled = this.element.hasAttribute('expanded') || this.element.getAttribute('data-controlled') === 'true';
  }

  componentDidLoad() {
    this.checkSlots();
  }

  @Watch('expanded')
  handleExpandedChange(nextValue: boolean) {
    this.internalExpanded = nextValue;
  }

  // === METHODS ===

  private checkSlots() {
    this.hasHeader = (this.headerSlot?.assignedElements({ flatten: true }).length ?? 0) > 0;
    this.hasActions = (this.actionsSlot?.assignedElements({ flatten: true }).length ?? 0) > 0;
    this.hasFooter = (this.footerSlot?.assignedElements({ flatten: true }).length ?? 0) > 0;
    this.hasBody = (this.defaultSlot?.assignedNodes({ flatten: true }).length ?? 0) > 0;
  }

  private emitToggle(nextExpanded: boolean) {
    this.panelToggle.emit(nextExpanded);
    if (nextExpanded) {
      this.panelExpand.emit(true);
    } else {
      this.panelCollapse.emit(false);
    }
    this.uiToggle.emit({ expanded: nextExpanded });
  }

  private updateExpanded(nextExpanded: boolean) {
    if (!this.isExpandedControlled) {
      this.internalExpanded = nextExpanded;
      this.expanded = nextExpanded;
    }

    this.emitToggle(nextExpanded);
  }

  /**
   * Toggle the panel expand/collapse state
   */
  @Method()
  async toggle() {
    if (!this.collapsible || this.disabled || this.loading) return;

    this.updateExpanded(!this.internalExpanded);
  }

  /**
   * Expand the panel
   */
  @Method()
  async expand() {
    if (!this.collapsible || this.disabled || this.loading) return;

    this.updateExpanded(true);
  }

  /**
   * Collapse the panel
   */
  @Method()
  async collapse() {
    if (!this.collapsible || this.disabled || this.loading) return;

    this.updateExpanded(false);
  }

  private handleHeaderClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (target?.closest('.ui-panel__actions')) {
      return;
    }
    if (this.collapsible && !this.disabled && !this.loading) {
      this.toggle();
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (this.collapsible && !this.disabled && !this.loading) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggle();
      }
    }
  }

  // === RENDER ===

  render() {
    const isExpanded = this.internalExpanded;
    const showHeader = this.hasHeader || this.hasActions || this.collapsible;
    const showBody = isExpanded || !this.lazy;
    const showFooter = this.hasFooter && (isExpanded || !this.lazy);

    return (
      <Host
        class={{
          'ui-panel': true,
          [`ui-panel--${this.variant}`]: true,
          [`ui-panel--${this.size}`]: true,
          [`ui-panel--rounded-${this.rounded}`]: true,
          'ui-panel--sticky-header': this.stickyHeader,
          'ui-panel--collapsible': this.collapsible,
          'ui-panel--expanded': isExpanded,
          'ui-panel--collapsed': !isExpanded,
          'ui-panel--loading': this.loading,
          'ui-panel--disabled': this.disabled,
        }}
        role="region"
        aria-expanded={this.collapsible ? `${isExpanded}` : undefined}
        aria-disabled={this.disabled ? 'true' : undefined}
      >
        {showHeader && (
          <div
            class={{
              'ui-panel__header': true,
              'ui-panel__header--divider': this.hasBody || this.hasFooter,
            }}
            onClick={(event) => this.handleHeaderClick(event)}
            onKeyDown={(e) => this.handleKeyDown(e)}
            tabIndex={this.collapsible && !this.disabled ? 0 : undefined}
            role={this.collapsible ? 'button' : undefined}
            aria-expanded={this.collapsible ? `${isExpanded}` : undefined}
            aria-controls={this.collapsible ? this.bodyId : undefined}
          >
            <div class="ui-panel__header-content">
              <slot name="header" ref={(el) => (this.headerSlot = el as HTMLSlotElement)} onSlotchange={() => this.checkSlots()}></slot>
            </div>
            <div class="ui-panel__header-end">
              <div class="ui-panel__actions">
                <slot name="actions" ref={(el) => (this.actionsSlot = el as HTMLSlotElement)} onSlotchange={() => this.checkSlots()}></slot>
              </div>
              {this.collapsible && (
                <div class="ui-panel__collapse-icon" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="6" y1="12" x2="18" y2="12"></line>
                    {!isExpanded && <line x1="12" y1="6" x2="12" y2="18"></line>}
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          id={this.bodyId}
          class={{
            'ui-panel__body': true,
            'ui-panel__body--expanded': isExpanded,
            'ui-panel__body--collapsed': !isExpanded,
          }}
          aria-hidden={!isExpanded ? 'true' : undefined}
        >
          {showBody && <slot ref={(el) => (this.defaultSlot = el as HTMLSlotElement)} onSlotchange={() => this.checkSlots()}></slot>}
        </div>

        {showFooter && (
          <div
            class={{
              'ui-panel__footer': true,
              'ui-panel__footer--divider': this.hasBody,
            }}
          >
            <slot name="footer" ref={(el) => (this.footerSlot = el as HTMLSlotElement)} onSlotchange={() => this.checkSlots()}></slot>
          </div>
        )}

        {this.loading && (
          <div class="ui-panel__loading-overlay" aria-live="polite" aria-busy="true">
            <div class="ui-panel__spinner">
              <svg
                class="ui-panel__spinner-svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-opacity="0.3"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
        )}
      </Host>
    );
  }
}
