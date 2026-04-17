import { Component, h, Prop, Event, EventEmitter, State, Host, Element, Listen, Method } from '@stencil/core';
import { BaseComponent } from '../base/base-component';

export interface PanelToggleEventDetail {
  expanded: boolean;
}

export type PanelVariant = 'default' | 'outlined' | 'elevated';
export type PanelSize = 'sm' | 'md' | 'lg';

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

  // === STATE ===

  @State() internalExpanded: boolean = true;
  @State() hasHeader: boolean = false;
  @State() hasActions: boolean = false;
  @State() hasFooter: boolean = false;

  // === EVENTS ===

  /**
   * Emitted when panel is expanded/collapsed
   */
  @Event() uiToggle: EventEmitter<PanelToggleEventDetail>;

  // === LIFECYCLE ===

  componentWillLoad() {
    this.internalExpanded = this.expanded;
    this.checkSlots();
  }

  componentDidLoad() {
    this.checkSlots();
  }

  // === METHODS ===

  @Listen('slotchange')
  handleSlotChange() {
    this.checkSlots();
  }

  private checkSlots() {
    const headerSlot = this.element.shadowRoot?.querySelector('slot[name="header"]') as HTMLSlotElement;
    const actionsSlot = this.element.shadowRoot?.querySelector('slot[name="actions"]') as HTMLSlotElement;
    const footerSlot = this.element.shadowRoot?.querySelector('slot[name="footer"]') as HTMLSlotElement;

    this.hasHeader = headerSlot?.assignedElements().length > 0;
    this.hasActions = actionsSlot?.assignedElements().length > 0;
    this.hasFooter = footerSlot?.assignedElements().length > 0;
  }

  /**
   * Toggle the panel expand/collapse state
   */
  @Method()
  async toggle() {
    if (!this.collapsible || this.disabled) return;
    
    this.internalExpanded = !this.internalExpanded;
    this.expanded = this.internalExpanded;
    
    this.uiToggle.emit({ expanded: this.internalExpanded });
  }

  /**
   * Expand the panel
   */
  @Method()
  async expand() {
    if (!this.collapsible || this.disabled) return;
    
    this.internalExpanded = true;
    this.expanded = true;
    
    this.uiToggle.emit({ expanded: true });
  }

  /**
   * Collapse the panel
   */
  @Method()
  async collapse() {
    if (!this.collapsible || this.disabled) return;
    
    this.internalExpanded = false;
    this.expanded = false;
    
    this.uiToggle.emit({ expanded: false });
  }

  private handleHeaderClick() {
    if (this.collapsible && !this.disabled) {
      this.toggle();
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (this.collapsible && !this.disabled) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggle();
      }
    }
  }

  // === RENDER ===

  render() {
    const isExpanded = this.internalExpanded;

    return (
      <Host
        class={{
          'ui-panel': true,
          [`ui-panel--${this.variant}`]: true,
          [`ui-panel--${this.size}`]: true,
          'ui-panel--collapsible': this.collapsible,
          'ui-panel--expanded': isExpanded,
          'ui-panel--collapsed': !isExpanded,
          'ui-panel--loading': this.loading,
          'ui-panel--disabled': this.disabled,
        }}
        role="region"
        aria-expanded={this.collapsible ? isExpanded : undefined}
      >
        <div
          class="ui-panel__header"
          onClick={() => this.handleHeaderClick()}
          onKeyDown={(e) => this.handleKeyDown(e)}
          tabIndex={this.collapsible ? 0 : undefined}
          role={this.collapsible ? 'button' : undefined}
          aria-pressed={this.collapsible ? isExpanded : undefined}
        >
          <div class="ui-panel__header-content">
            <slot name="header"></slot>
            {this.collapsible && (
              <div class="ui-panel__collapse-icon" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class={{ 'ui-panel__collapse-icon--rotated': !isExpanded }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            )}
          </div>
          <div class="ui-panel__actions">
            <slot name="actions"></slot>
          </div>
        </div>

        <div
          class={{
            'ui-panel__body': true,
            'ui-panel__body--expanded': isExpanded,
            'ui-panel__body--collapsed': !isExpanded,
          }}
        >
          <slot></slot>
        </div>

        <div
          class="ui-panel__footer"
          style={{
            display: !isExpanded ? 'none' : 'block',
          }}
        >
          <slot name="footer"></slot>
        </div>

        {this.loading && (
          <div class="ui-panel__loading-overlay">
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
