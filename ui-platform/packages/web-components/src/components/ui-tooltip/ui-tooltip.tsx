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
import type {
  TooltipPosition,
  TooltipTrigger,
  TooltipVariant,
} from '@karan9186/core';

const VIEWPORT_MARGIN = 8;
const TOOLTIP_GAP = 10;

@Component({
  tag: 'ui-tooltip',
  styleUrl: 'ui-tooltip.css',
  shadow: true,
})
export class UiTooltip extends BaseComponent {
  @Element() hostEl!: HTMLElement;

  @Prop() content?: string;
  @Prop({ reflect: true }) position: TooltipPosition = 'top';
  @Prop({ reflect: true }) trigger: TooltipTrigger = 'hover';
  @Prop({ reflect: true }) open?: boolean;
  @Prop({ reflect: true }) disabled: boolean = false;
  @Prop({ reflect: true }) variant: TooltipVariant = 'simple';
  @Prop() delay: number = 150;

  @Event({ bubbles: true, composed: true }) openChange!: EventEmitter<boolean>;

  @State() internalOpen = false;
  @State() resolvedPosition: TooltipPosition = 'top';

  private triggerEl?: HTMLDivElement;
  private tooltipEl?: HTMLDivElement;
  private showTimer?: number;
  private hideTimer?: number;
  private teardownScroll?: () => void;
  private teardownTriggerListeners?: () => void;
  private teardownTooltipListeners?: () => void;
  private triggerFocused = false;
  private tooltipFocused = false;
  private pointerInsideTrigger = false;
  private pointerInsideTooltip = false;
  private initialized = false;
  private tooltipId = `ui-tooltip-${Math.random().toString(36).slice(2, 10)}`;

  componentWillLoad() {
    super.componentWillLoad();
    this.internalOpen = typeof this.open === 'boolean' ? this.open : false;
  }

  componentDidLoad() {
    this.initialized = true;
    this.attachTriggerListeners();
    this.attachTooltipListeners();
    this.syncAria();
    this.syncOpenState(this.isOpen());
  }

  componentDidRender() {
    this.attachTooltipListeners();
    if (this.isOpen()) {
      this.positionTooltip();
    }
  }

  disconnectedCallback() {
    this.clearTimers();
    this.detachViewportListeners();
    this.teardownTriggerListeners?.();
    this.teardownTooltipListeners?.();
  }

  @Watch('open')
  handleOpenChanged(nextOpen: boolean | undefined) {
    if (typeof nextOpen === 'boolean') {
      this.internalOpen = nextOpen;
      this.syncOpenState(nextOpen);
    }
  }

  @Watch('content')
  @Watch('position')
  @Watch('variant')
  @Watch('disabled')
  handlePropsChanged() {
    if (!this.initialized) {
      return;
    }

    this.syncAria();
    if (this.disabled) {
      this.forceClose();
      return;
    }

    if (this.isOpen()) {
      this.positionTooltip();
    }
  }

  private isControlled(): boolean {
    return typeof this.open === 'boolean';
  }

  private isOpen(): boolean {
    return this.isControlled() ? !!this.open : this.internalOpen;
  }

  private getTriggerTarget(): HTMLElement | null {
    const assigned = this.triggerEl
      ?.querySelector('slot')
      ?.assignedElements({ flatten: true })
      .find((node): node is HTMLElement => node instanceof HTMLElement);

    return assigned ?? this.triggerEl ?? null;
  }

  private attachTriggerListeners() {
    if (!this.triggerEl) {
      return;
    }

    this.teardownTriggerListeners?.();

    this.triggerEl.addEventListener('mouseenter', this.handleTriggerMouseEnter);
    this.triggerEl.addEventListener('mouseleave', this.handleTriggerMouseLeave);
    this.triggerEl.addEventListener('focusin', this.handleTriggerFocusIn);
    this.triggerEl.addEventListener('focusout', this.handleTriggerFocusOut as EventListener);
    this.triggerEl.addEventListener('click', this.handleTriggerClick as EventListener);

    this.teardownTriggerListeners = () => {
      this.triggerEl?.removeEventListener('mouseenter', this.handleTriggerMouseEnter);
      this.triggerEl?.removeEventListener('mouseleave', this.handleTriggerMouseLeave);
      this.triggerEl?.removeEventListener('focusin', this.handleTriggerFocusIn);
      this.triggerEl?.removeEventListener('focusout', this.handleTriggerFocusOut as EventListener);
      this.triggerEl?.removeEventListener('click', this.handleTriggerClick as EventListener);
      this.teardownTriggerListeners = undefined;
    };
  }

  private attachTooltipListeners() {
    if (!this.tooltipEl) {
      this.teardownTooltipListeners?.();
      return;
    }

    this.teardownTooltipListeners?.();

    this.tooltipEl.addEventListener('mouseenter', this.handleTooltipMouseEnter);
    this.tooltipEl.addEventListener('mouseleave', this.handleTooltipMouseLeave);
    this.tooltipEl.addEventListener('focusin', this.handleTooltipFocusIn);
    this.tooltipEl.addEventListener('focusout', this.handleTooltipFocusOut as EventListener);

    this.teardownTooltipListeners = () => {
      this.tooltipEl?.removeEventListener('mouseenter', this.handleTooltipMouseEnter);
      this.tooltipEl?.removeEventListener('mouseleave', this.handleTooltipMouseLeave);
      this.tooltipEl?.removeEventListener('focusin', this.handleTooltipFocusIn);
      this.tooltipEl?.removeEventListener('focusout', this.handleTooltipFocusOut as EventListener);
      this.teardownTooltipListeners = undefined;
    };
  }

  private attachViewportListeners() {
    if (this.teardownScroll) {
      return;
    }

    const reposition = () => this.positionTooltip();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);

    this.teardownScroll = () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
      this.teardownScroll = undefined;
    };
  }

  private detachViewportListeners() {
    this.teardownScroll?.();
  }

  private clearTimers() {
    if (this.showTimer) {
      window.clearTimeout(this.showTimer);
      this.showTimer = undefined;
    }
    if (this.hideTimer) {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
  }

  private syncAria() {
    const target = this.getTriggerTarget();
    if (!target) {
      return;
    }

    if (this.disabled) {
      target.removeAttribute('aria-describedby');
      return;
    }

    target.setAttribute('aria-describedby', this.tooltipId);
  }

  private forceClose() {
    this.clearTimers();
    this.internalOpen = false;
    this.syncOpenState(false);
    this.openChange.emit(false);
  }

  private requestOpen(nextOpen: boolean) {
    if (this.disabled && nextOpen) {
      return;
    }

    if (this.isControlled()) {
      this.openChange.emit(nextOpen);
      return;
    }

    this.internalOpen = nextOpen;
    this.syncOpenState(nextOpen);
    this.openChange.emit(nextOpen);
  }

  private syncOpenState(nextOpen: boolean) {
    if (nextOpen) {
      this.attachViewportListeners();
      window.requestAnimationFrame(() => this.positionTooltip());
      return;
    }

    this.detachViewportListeners();
  }

  private scheduleShow() {
    this.clearTimers();
    const wait = this.trigger === 'hover' ? this.delay : 0;
    this.showTimer = window.setTimeout(() => {
      this.requestOpen(true);
    }, wait);
  }

  private scheduleHide() {
    this.clearTimers();
    this.hideTimer = window.setTimeout(() => {
      if (
        this.pointerInsideTrigger ||
        this.pointerInsideTooltip ||
        this.triggerFocused ||
        this.tooltipFocused
      ) {
        return;
      }

      this.requestOpen(false);
    }, 80);
  }

  private positionTooltip() {
    const anchor = this.getTriggerTarget();
    if (!anchor || !this.tooltipEl) {
      return;
    }

    const triggerRect = anchor.getBoundingClientRect();
    const tooltipRect = this.tooltipEl.getBoundingClientRect();

    const fits = {
      top: triggerRect.top >= tooltipRect.height + TOOLTIP_GAP + VIEWPORT_MARGIN,
      bottom:
        window.innerHeight - triggerRect.bottom >=
        tooltipRect.height + TOOLTIP_GAP + VIEWPORT_MARGIN,
      left: triggerRect.left >= tooltipRect.width + TOOLTIP_GAP + VIEWPORT_MARGIN,
      right:
        window.innerWidth - triggerRect.right >=
        tooltipRect.width + TOOLTIP_GAP + VIEWPORT_MARGIN,
    };

    const resolvedPosition = (() => {
      if (this.position === 'top' && !fits.top && fits.bottom) return 'bottom';
      if (this.position === 'bottom' && !fits.bottom && fits.top) return 'top';
      if (this.position === 'left' && !fits.left && fits.right) return 'right';
      if (this.position === 'right' && !fits.right && fits.left) return 'left';
      return this.position;
    })();

    let top = 0;
    let left = 0;

    switch (resolvedPosition) {
      case 'bottom':
        top = triggerRect.bottom + TOOLTIP_GAP;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - TOOLTIP_GAP;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + TOOLTIP_GAP;
        break;
      case 'top':
      default:
        top = triggerRect.top - tooltipRect.height - TOOLTIP_GAP;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
    }

    const maxLeft = window.innerWidth - tooltipRect.width - VIEWPORT_MARGIN;
    const maxTop = window.innerHeight - tooltipRect.height - VIEWPORT_MARGIN;

    left = Math.max(VIEWPORT_MARGIN, Math.min(left, maxLeft));
    top = Math.max(VIEWPORT_MARGIN, Math.min(top, maxTop));

    this.resolvedPosition = resolvedPosition;
    this.hostEl.style.setProperty('--ui-tooltip-left', `${left}px`);
    this.hostEl.style.setProperty('--ui-tooltip-top', `${top}px`);
  }

  private handleTriggerMouseEnter = () => {
    this.pointerInsideTrigger = true;
    if (this.trigger === 'hover') {
      this.scheduleShow();
    }
  };

  private handleTriggerMouseLeave = () => {
    this.pointerInsideTrigger = false;
    if (this.trigger === 'hover') {
      this.scheduleHide();
    }
  };

  private handleTriggerFocusIn = () => {
    this.triggerFocused = true;
    if (this.trigger === 'focus') {
      this.scheduleShow();
    }
  };

  private handleTriggerFocusOut = (event: FocusEvent) => {
    const related = event.relatedTarget as Node | null;
    this.triggerFocused = !!(related && this.tooltipEl?.contains(related));
    if (!this.triggerFocused && this.trigger === 'focus') {
      this.scheduleHide();
    }
  };

  private handleTriggerClick = (event: MouseEvent) => {
    if (this.trigger !== 'click' || this.disabled) {
      return;
    }

    event.stopPropagation();
    this.requestOpen(!this.isOpen());
  };

  private handleTooltipMouseEnter = () => {
    this.pointerInsideTooltip = true;
    this.clearTimers();
  };

  private handleTooltipMouseLeave = () => {
    this.pointerInsideTooltip = false;
    if (this.trigger === 'hover') {
      this.scheduleHide();
    }
  };

  private handleTooltipFocusIn = () => {
    this.tooltipFocused = true;
    this.clearTimers();
  };

  private handleTooltipFocusOut = (event: FocusEvent) => {
    const related = event.relatedTarget as Node | null;
    const nextInsideTrigger = !!(related && this.triggerEl?.contains(related));
    const nextInsideTooltip = !!(related && this.tooltipEl?.contains(related));
    this.tooltipFocused = nextInsideTooltip;
    this.triggerFocused = nextInsideTrigger;

    if (!nextInsideTrigger && !nextInsideTooltip) {
      this.scheduleHide();
    }
  };

  @Listen('mousedown', { target: 'document' })
  handleDocumentPointerDown(event: MouseEvent) {
    if (this.trigger !== 'click' || !this.isOpen()) {
      return;
    }

    const path = event.composedPath();
    if (path.includes(this.hostEl)) {
      return;
    }

    this.requestOpen(false);
  }

  @Listen('keydown', { target: 'document' })
  handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isOpen()) {
      this.requestOpen(false);
    }
  }

  render() {
    const isOpen = this.isOpen();

    return (
      <Host>
        <div class="trigger" ref={(el) => (this.triggerEl = el as HTMLDivElement)}>
          <slot></slot>
        </div>

        <div
          ref={(el) => (this.tooltipEl = el as HTMLDivElement)}
          id={this.tooltipId}
          role="tooltip"
          class={{
            tooltip: true,
            show: isOpen,
            complex: this.variant === 'complex',
            [this.resolvedPosition]: true,
          }}
          aria-hidden={isOpen ? 'false' : 'true'}
        >
          {this.variant === 'simple' ? (
            <div class="tooltip-content">{this.content}</div>
          ) : (
            <div class="tooltip-content tooltip-content--complex">
              <slot name="content"></slot>
            </div>
          )}
          <div class="tooltip-arrow"></div>
        </div>
      </Host>
    );
  }
}
