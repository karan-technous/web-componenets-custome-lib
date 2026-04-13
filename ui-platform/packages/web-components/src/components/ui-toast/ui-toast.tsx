import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State } from '@stencil/core';
import { ToastCloseReason, ToastLifecycleDetail, ToastPosition, ToastRequest, ToastShowOptions, ToastType, toast } from '@karan9186/core';

type ToastPhase = 'entering' | 'visible' | 'exiting';

type QueuedToast = ToastRequest & {
  dedupeToken?: string;
};

type ActiveToast = QueuedToast & {
  phase: ToastPhase;
  remaining: number;
  startedAt?: number;
  swipeStartX?: number;
  swipeX: number;
};

const POSITIONS: ToastPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];

const EXIT_ANIMATION_MS = 180;
const SWIPE_DISMISS_THRESHOLD = 90;

const ICON_BY_TYPE: Record<ToastType, string> = {
  success: 'CircleCheck',
  error: 'CircleAlert',
  warning: 'TriangleAlert',
  info: 'Info',
};

function createEmptyQueues() {
  return {
    'top-left': [] as QueuedToast[],
    'top-right': [] as QueuedToast[],
    'bottom-left': [] as QueuedToast[],
    'bottom-right': [] as QueuedToast[],
    'center': [] as QueuedToast[],
  };
}

@Component({
  tag: 'ui-toast',
  styleUrl: 'ui-toast.css',
  shadow: true,
})
export class UiToast {
  @Element() el!: HTMLElement;
  @State() isHovered: boolean = false;
  @Prop({ reflect: true }) maxVisible: number = 4;
  @Prop({ reflect: true }) defaultDuration: number = 4000;
  @Prop({ reflect: true }) pauseOnHover: boolean = true;
  @Prop({ reflect: true }) stackGap: number = 10;
  @Prop({ reflect: true }) swipeDismiss: boolean = false;

  @Event() toastShow!: EventEmitter<ToastLifecycleDetail>;
  @Event() toastClose!: EventEmitter<ToastLifecycleDetail>;

  @State() activeToasts: ActiveToast[] = [];
  @State() liveMessage: string = '';
  @State() liveMode: 'polite' | 'assertive' = 'polite';

  private unsubscribe?: () => void;
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly exitTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private positionQueues = createEmptyQueues();
  private lastFocusedToastId?: string;

  connectedCallback() {
    this.unsubscribe = toast.subscribe((event: any) => {
      if (event.kind === 'show') {
        toast.acknowledge(event.request.id);
        this.enqueue(event.request);
        return;
      }

      if (event.id) {
        this.beginClose(event.id, 'programmatic');
        return;
      }

      this.dismissAll('dismiss-all');
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.onWindowKeydown);
    }
  }

  componentDidLoad() {
    const pending = toast.consumePending();

    for (const request of pending) {
      this.enqueue(request);
    }
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    this.unsubscribe = undefined;

    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.onWindowKeydown);
    }

    this.clearAllTimers();
  }

  @Method()
  async show(options: ToastShowOptions) {
    return toast.show(options);
  }

  @Method()
  async dismiss(id?: string) {
    toast.dismiss(id);
  }

  private enqueue(request: ToastRequest) {
    const normalized = this.normalize(request);

    if (this.isDuplicate(normalized)) {
      return;
    }

    const activeCountForPosition = this.activeToasts.filter(toastItem => toastItem.position === normalized.position).length;

    if (activeCountForPosition >= this.getMaxVisible()) {
      this.positionQueues[normalized.position].push(normalized);
      return;
    }

    this.activate(normalized);
  }

  private activate(toastItem: QueuedToast) {
    const activeItem: ActiveToast = {
      ...toastItem,
      phase: 'entering',
      remaining: toastItem.duration,
      swipeX: 0,
    };

    this.activeToasts = [...this.activeToasts, activeItem];

    requestAnimationFrame(() => {
      this.patchToast(activeItem.id, {
        phase: 'visible',
      });
    });

    if (activeItem.duration > 0) {
      this.startTimer(activeItem.id, activeItem.duration);
    }

    this.announce(activeItem);
    this.toastShow.emit({
      toast: toastItem,
    });
  }

  private beginClose(id: string, reason: ToastCloseReason) {
    const existing = this.activeToasts.find(toastItem => toastItem.id === id);

    if (!existing || existing.phase === 'exiting') {
      return;
    }

    this.stopTimer(id);
    this.patchToast(id, {
      phase: 'exiting',
      swipeX: existing.swipeX,
    });

    const timer = setTimeout(() => {
      this.removeToast(id, reason);
    }, EXIT_ANIMATION_MS);

    this.exitTimers.set(id, timer);
  }

  private removeToast(id: string, reason: ToastCloseReason) {
    const toastItem = this.activeToasts.find(item => item.id === id);
    if (!toastItem) {
      return;
    }

    this.activeToasts = this.activeToasts.filter(item => item.id !== id);
    this.stopTimer(id);
    this.clearExitTimer(id);
    this.promoteQueued(toastItem.position);

    this.toastClose.emit({
      toast: {
        id: toastItem.id,
        message: toastItem.message,
        type: toastItem.type,
        position: toastItem.position,
        duration: toastItem.duration,
        closable: toastItem.closable,
        dedupe: toastItem.dedupe,
        dedupeKey: toastItem.dedupeKey,
        slot: toastItem.slot,
      },
      reason,
    });

    this.restoreFocusAfterClose(id);
  }

  private dismissAll(reason: ToastCloseReason) {
    for (const toastItem of this.activeToasts) {
      this.beginClose(toastItem.id, reason);
    }

    this.positionQueues = createEmptyQueues();
  }

  private promoteQueued(position: ToastPosition) {
    const maxVisible = this.getMaxVisible();
    let activeCount = this.activeToasts.filter(toastItem => toastItem.position === position).length;

    while (activeCount < maxVisible && this.positionQueues[position].length > 0) {
      const next = this.positionQueues[position].shift();
      if (!next) {
        break;
      }

      this.activate(next);
      activeCount += 1;
    }
  }

  private normalize(request: ToastRequest): QueuedToast {
    const dedupeToken = request.dedupe || request.dedupeKey ? request.dedupeKey || `${request.position}:${request.type}:${request.message.trim()}` : undefined;

    const duration = request.duration < 0 ? this.defaultDuration : request.duration;

    return {
      ...request,
      duration,
      dedupeToken,
    };
  }

  private isDuplicate(request: QueuedToast) {
    if (!request.dedupeToken) {
      return false;
    }

    if (this.activeToasts.some(toastItem => toastItem.dedupeToken === request.dedupeToken)) {
      return true;
    }

    return POSITIONS.some(position => this.positionQueues[position].some(toastItem => toastItem.dedupeToken === request.dedupeToken));
  }

  private getAllToastsForPosition(position: ToastPosition) {
    const active = this.activeToasts.filter(t => t.position === position);

    //  only show queued on hover
    if (!this.isHovered) return active;

    const queued = this.positionQueues[position];

    return [...active, ...queued];
  }

  private getMaxVisible() {
    if (!Number.isFinite(this.maxVisible)) {
      return 4;
    }

    return Math.max(1, Math.floor(this.maxVisible));
  }

  private startTimer(id: string, delayMs: number) {
    const safeDelay = Math.max(0, delayMs);

    this.stopTimer(id);
    this.patchToast(id, {
      startedAt: Date.now(),
      remaining: safeDelay,
    });

    const timer = setTimeout(() => {
      this.beginClose(id, 'timeout');
    }, safeDelay);

    this.timers.set(id, timer);
  }

  private stopTimer(id: string) {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  private clearExitTimer(id: string) {
    const timer = this.exitTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.exitTimers.delete(id);
    }
  }

  private clearAllTimers() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.exitTimers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.exitTimers.clear();
  }

  private pauseToast(id: string) {
    if (!this.pauseOnHover) {
      return;
    }

    const toastItem = this.activeToasts.find(item => item.id === id);
    if (!toastItem || toastItem.duration <= 0 || toastItem.phase === 'exiting') {
      return;
    }

    if (typeof toastItem.startedAt !== 'number') {
      return;
    }

    const elapsed = Date.now() - toastItem.startedAt;
    const nextRemaining = Math.max(0, toastItem.remaining - elapsed);

    this.stopTimer(id);
    this.patchToast(id, {
      remaining: nextRemaining,
      startedAt: undefined,
    });
  }

  private resumeToast(id: string) {
    const toastItem = this.activeToasts.find(item => item.id === id);
    if (!toastItem || toastItem.duration <= 0 || toastItem.phase === 'exiting') {
      return;
    }

    if (typeof toastItem.startedAt === 'number') {
      return;
    }

    if (toastItem.remaining <= 0) {
      this.beginClose(id, 'timeout');
      return;
    }

    this.startTimer(id, toastItem.remaining);
  }

  private patchToast(id: string, patch: Partial<ActiveToast>) {
    this.activeToasts = this.activeToasts.map(toastItem =>
      toastItem.id === id
        ? {
            ...toastItem,
            ...patch,
          }
        : toastItem,
    );
  }

  private announce(toastItem: QueuedToast) {
    this.liveMode = toastItem.type === 'error' || toastItem.type === 'warning' ? 'assertive' : 'polite';
    this.liveMessage = `${toastItem.type}: ${toastItem.message}`;
  }

  private onWindowKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return;
    }

    const target =
      this.activeToasts.find(toastItem => toastItem.id === this.lastFocusedToastId && toastItem.phase !== 'exiting') ||
      [...this.activeToasts].reverse().find(toastItem => toastItem.phase !== 'exiting');

    if (!target) {
      return;
    }

    event.preventDefault();
    this.beginClose(target.id, 'escape');
  };

  private onToastFocus = (id: string) => {
    this.lastFocusedToastId = id;
  };

  private restoreFocusAfterClose(id: string) {
    if (this.lastFocusedToastId !== id) {
      return;
    }

    const next = [...this.activeToasts].reverse().find(toastItem => toastItem.phase !== 'exiting');

    if (!next) {
      this.lastFocusedToastId = undefined;
      return;
    }

    this.lastFocusedToastId = next.id;

    requestAnimationFrame(() => {
      const nextElement = this.el.shadowRoot?.querySelector<HTMLElement>(`[data-toast-id="${next.id}"]`);
      nextElement?.focus();
    });
  }

  private onSwipeStart = (event: PointerEvent, id: string) => {
    if (!this.swipeDismiss) {
      return;
    }

    const target = this.activeToasts.find(toastItem => toastItem.id === id);
    if (!target || target.phase === 'exiting') {
      return;
    }

    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.pauseToast(id);
    this.patchToast(id, {
      swipeStartX: event.clientX,
    });
  };

  private onSwipeMove = (event: PointerEvent, id: string) => {
    if (!this.swipeDismiss) {
      return;
    }

    const target = this.activeToasts.find(toastItem => toastItem.id === id);
    if (!target || typeof target.swipeStartX !== 'number' || target.phase === 'exiting') {
      return;
    }

    const delta = event.clientX - target.swipeStartX;
    this.patchToast(id, {
      swipeX: delta,
    });
  };

  private onSwipeEnd = (event: PointerEvent, id: string) => {
    if (!this.swipeDismiss) {
      return;
    }

    const target = this.activeToasts.find(toastItem => toastItem.id === id);
    if (!target || target.phase === 'exiting') {
      return;
    }

    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);

    const dismissed = Math.abs(target.swipeX) >= SWIPE_DISMISS_THRESHOLD;
    if (dismissed) {
      this.beginClose(id, 'swipe');
      return;
    }

    this.patchToast(id, {
      swipeStartX: undefined,
      swipeX: 0,
    });
    this.resumeToast(id);
  };

  private onSwipeCancel = (id: string) => {
    if (!this.swipeDismiss) {
      return;
    }

    this.patchToast(id, {
      swipeStartX: undefined,
      swipeX: 0,
    });
    this.resumeToast(id);
  };

  private hoverTimeout?: any;

  private handleMouseEnter = () => {
    clearTimeout(this.hoverTimeout);
    this.isHovered = true;
  };

  private handleMouseLeave = () => {
    clearTimeout(this.hoverTimeout);

    // small delay prevents flicker when crossing gaps
    this.hoverTimeout = setTimeout(() => {
      this.isHovered = false;
    }, 80); // tweak 60–120ms
  };

  private toRenderableToast(toast: QueuedToast | ActiveToast): ActiveToast {
    if ('phase' in toast) {
      return toast; // already ActiveToast
    }

    // convert QueuedToast → ActiveToast (virtual)
    return {
      ...toast,
      phase: 'visible', // fake but safe
      remaining: toast.duration,
      swipeX: 0,
    };
  }

  private renderToast(toastItem: ActiveToast, index: number, total: number) {
    const isBottom = toastItem.position.includes('bottom');
    const isActive = this.activeToasts.some(t => t.id === toastItem.id);
    const iconName = ICON_BY_TYPE[toastItem.type];

    const offset = total - index - 1;

    // Sonner-style physics
    const direction = isBottom ? -1 : 1;

    const y = direction * offset * (this.isHovered ? 57 : 8);
    const scale = this.isHovered ? 1 : 1 - offset * 0.04;
    const opacity = this.isHovered ? 1 : 1 - offset * 0.15;
    const blur = this.isHovered ? 0 : offset * 1.5;

    const style = {
      transform: `translateY(${y}px) scale(${scale}) translateX(${toastItem.swipeX}px)`,
      zIndex: `${100 + index}`,
      opacity: `${opacity}`,
      filter: `blur(${blur}px)`,
      transformOrigin: 'top right',
      transition: 'all 240ms cubic-bezier(0.22, 1, 0.36, 1)',
    };

    return (
      <article
        key={toastItem.id}
        class={{
          toast: true,
          [`toast--${toastItem.type}`]: true,
          [`toast--${toastItem.phase}`]: true,
        }}
        style={style}
        data-toast-id={toastItem.id}
        tabIndex={0}
        role={toastItem.type === 'error' ? 'alert' : 'status'}
        onMouseEnter={() => isActive && this.pauseToast(toastItem.id)}
        onMouseLeave={() => isActive && this.resumeToast(toastItem.id)}
        onPointerDown={e => isActive && this.onSwipeStart(e, toastItem.id)}
        onPointerMove={e => isActive && this.onSwipeMove(e, toastItem.id)}
        onPointerUp={e => isActive && this.onSwipeEnd(e, toastItem.id)}
        onPointerCancel={() => isActive && this.onSwipeCancel(toastItem.id)}
        onFocusin={() => this.onToastFocus(toastItem.id)}
      >
        <div class="toast__rail" />

        <div class="toast__icon">
          <ui-icon name={iconName as any} size="sm" />
        </div>

        <div class="toast__content">
          <slot name={toastItem.slot || `toast-${toastItem.id}`}>{toastItem.message}</slot>
        </div>

        {toastItem.closable && isActive && (
          <button class="toast__close" onClick={() => this.beginClose(toastItem.id, 'manual')}>
            <ui-icon name="X" size="sm" />
          </button>
        )}
      </article>
    );
  }
  render() {
    return (
      <Host
        style={{
          '--ui-toast-gap': `${Math.max(0, this.stackGap)}px`,
        }}
      >
        <div class="sr-only" aria-live={this.liveMode} aria-atomic="true">
          {this.liveMessage}
        </div>

        {POSITIONS.map(position => {
          const toastsForPosition = this.getAllToastsForPosition(position);
          if (!toastsForPosition.length) return null;

          return (
            <section key={position} class={`viewport viewport--${position}`} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
              {toastsForPosition
                .slice() // copy
                .reverse() // IMPORTANT
                .map((toastItem, index) => this.renderToast(this.toRenderableToast(toastItem), index, toastsForPosition.length))}
            </section>
          );
        })}
      </Host>
    );
  }
}
