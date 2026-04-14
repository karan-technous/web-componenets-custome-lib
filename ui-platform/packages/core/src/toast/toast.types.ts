export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

export type ToastCloseReason =
  | 'timeout'
  | 'manual'
  | 'escape'
  | 'swipe'
  | 'programmatic'
  | 'dismiss-all';

export interface ToastShowOptions {
  id?: string;
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  closable?: boolean;
  dedupe?: boolean;
  dedupeKey?: string;
  slot?: string;
}

export interface ToastPromiseOptions {
  loading: string;
  success: string | ((result: any) => string);
  error: string | ((error: any) => string);
  position?: ToastPosition;
  duration?: number;
}

export interface ToastUpdateOptions {
  message?: string;
  type?: ToastType;
  duration?: number;
}

export type ToastShortcutOptions = Omit<ToastShowOptions, 'message' | 'type'>;

export interface ToastRequest {
  id: string;
  message: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
  closable: boolean;
  dedupe: boolean;
  dedupeKey?: string;
  slot?: string;
}

export type ToastBusEvent =
  | {
      kind: 'show';
      request: ToastRequest;
    }
  | {
      kind: 'dismiss';
      id?: string;
    };

export interface ToastLifecycleDetail {
  toast: ToastRequest;
  reason?: ToastCloseReason;
}

export interface ToastConfig {
  maxVisible?: number;
  hoverLimit?: number;
  defaultDuration?: number;
  stackGap?: number;
  pauseOnHover?: boolean;
  swipeDismiss?: boolean;
}

export interface ToastSettings {
  maxVisible: number;
  hoverLimit: number;
  defaultDuration: number;
  stackGap: number;
  pauseOnHover: boolean;
  swipeDismiss: boolean;
}
