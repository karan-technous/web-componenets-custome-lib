import {
  ToastBusEvent,
  ToastPromiseOptions,
  ToastRequest,
  ToastShowOptions,
  ToastShortcutOptions,
  ToastType,
  ToastUpdateOptions,
} from './toast.types';

const TOAST_EVENT_NAME = 'ui-toast-bus';
const TOAST_SERVICE_KEY = Symbol.for('@karan9186/ui.toast.service');
const TOAST_STORE_KEY = Symbol.for('@karan9186/ui.toast.store');

const DEFAULT_TYPE: ToastType = 'info';
const DEFAULT_POSITION = 'top-right';
const DEFAULT_DURATION = 4000;
const DEFAULT_CLOSABLE = true;

type ToastListener = (event: ToastBusEvent) => void;

type ToastStore = {
  target: EventTarget;
  pending: Map<string, ToastRequest>;
  counter: number;
};

type GlobalWithToast = typeof globalThis & {
  [TOAST_STORE_KEY]?: ToastStore;
  [TOAST_SERVICE_KEY]?: ToastService;
};

function getStore(): ToastStore {
  const runtime = globalThis as GlobalWithToast;

  if (!runtime[TOAST_STORE_KEY]) {
    runtime[TOAST_STORE_KEY] = {
      target: new EventTarget(),
      pending: new Map<string, ToastRequest>(),
      counter: 0,
    };
  }

  return runtime[TOAST_STORE_KEY];
}

function createToastId(store: ToastStore) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  store.counter += 1;
  return `toast-${Date.now()}-${store.counter}`;
}

function normalizeDuration(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return DEFAULT_DURATION;
  }

  return Math.max(0, value);
}

function normalizeRequest(store: ToastStore, options: ToastShowOptions): ToastRequest {
  return {
    id: options.id || createToastId(store),
    message: options.message,
    type: options.type || DEFAULT_TYPE,
    position: options.position || DEFAULT_POSITION,
    duration: normalizeDuration(options.duration),
    closable: options.closable ?? DEFAULT_CLOSABLE,
    dedupe: options.dedupe ?? false,
    dedupeKey: options.dedupeKey,
    slot: options.slot,
  };
}

export class ToastService {
  private readonly store = getStore();

  show(options: ToastShowOptions) {
    if (!options.message || !options.message.trim()) {
      throw new Error('toast.show requires a non-empty message.');
    }

    const request = normalizeRequest(this.store, options);

    this.store.pending.set(request.id, request);
    this.dispatch({
      kind: 'show',
      request,
    });

    return request.id;
  }

  success(message: string, options: ToastShortcutOptions = {}) {
    return this.show({
      ...options,
      message,
      type: 'success',
    });
  }

  error(message: string, options: ToastShortcutOptions = {}) {
    return this.show({
      ...options,
      message,
      type: 'error',
    });
  }

  warning(message: string, options: ToastShortcutOptions = {}) {
    return this.show({
      ...options,
      message,
      type: 'warning',
    });
  }

  info(message: string, options: ToastShortcutOptions = {}) {
    return this.show({
      ...options,
      message,
      type: 'info',
    });
  }

  dismiss(id?: string) {
    if (id) {
      this.store.pending.delete(id);
    } else {
      this.store.pending.clear();
    }

    this.dispatch({
      kind: 'dismiss',
      id,
    });
  }

  update(id: string, options: ToastUpdateOptions) {
    const pending = this.store.pending.get(id);
    
    if (pending) {
      const updated: ToastRequest = {
        ...pending,
        message: options.message ?? pending.message,
        type: options.type ?? pending.type,
        duration: options.duration !== undefined ? normalizeDuration(options.duration) : pending.duration,
      };

      this.store.pending.set(id, updated);
      this.dispatch({
        kind: 'show',
        request: updated,
      });
    } else {
      // Toast is not in pending map (already activated), dispatch update event directly
      this.dispatch({
        kind: 'show',
        request: {
          id,
          message: options.message || '',
          type: options.type || 'info',
          position: 'top-right',
          duration: options.duration !== undefined ? normalizeDuration(options.duration) : DEFAULT_DURATION,
          closable: true,
          dedupe: false,
        },
      });
    }
  }

  promise<T>(promise: Promise<T>, options: ToastPromiseOptions): string {
    const id = this.show({
      message: options.loading,
      type: 'loading',
      position: options.position,
      duration: Infinity,
      closable: false,
    });

    promise
      .then((result) => {
        const message = typeof options.success === 'function'
          ? options.success(result)
          : options.success;
        this.update(id, {
          message,
          type: 'success',
          duration: options.duration ?? DEFAULT_DURATION,
        });
      })
      .catch((error) => {
        const message = typeof options.error === 'function'
          ? options.error(error)
          : options.error;
        this.update(id, {
          message,
          type: 'error',
          duration: options.duration ?? DEFAULT_DURATION,
        });
      });

    return id;
  }

  subscribe(listener: ToastListener) {
    const handler = (event: Event) => {
      listener((event as CustomEvent<ToastBusEvent>).detail);
    };

    this.store.target.addEventListener(TOAST_EVENT_NAME, handler);
    return () => this.store.target.removeEventListener(TOAST_EVENT_NAME, handler);
  }

  consumePending() {
    const pending = Array.from(this.store.pending.values());
    this.store.pending.clear();
    return pending;
  }

  acknowledge(id: string) {
    this.store.pending.delete(id);
  }

  private dispatch(event: ToastBusEvent) {
    this.store.target.dispatchEvent(
      new CustomEvent<ToastBusEvent>(TOAST_EVENT_NAME, {
        detail: event,
      })
    );
  }
}

export const toast = (() => {
  const runtime = globalThis as GlobalWithToast;

  if (!runtime[TOAST_SERVICE_KEY]) {
    runtime[TOAST_SERVICE_KEY] = new ToastService();
  }

  return runtime[TOAST_SERVICE_KEY];
})();
