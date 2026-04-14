import { Injectable, signal } from '@angular/core';
import { ToastShowOptions, ToastPromiseOptions, configureToast } from '@karan9186/core';

// Initialize toast configuration with default settings
// Users can override this by calling configureToast() in their app
configureToast({
  maxVisible: 4,
  hoverLimit: 3,
  defaultDuration: 4000,
  stackGap: 10,
  pauseOnHover: true,
  swipeDismiss: false,
});

@Injectable({ providedIn: 'root' })
export class ToastService {
  private instance = signal<any | null>(null);

  register(el: any) {
    this.instance.set(el);
  }

  show(options: ToastShowOptions) {
    this.instance()?.show(options);
  }

  dismiss(id?: string) {
    this.instance()?.dismiss(id);
  }

  // DX helpers
  success(message: string) {
    this.show({ message, type: 'success' });
  }

  error(message: string) {
    this.show({ message, type: 'error' });
  }

  info(message: string) {
    this.show({ message, type: 'info' });
  }

  warning(message: string) {
    this.show({ message, type: 'warning' });
  }

  promise<T>(promise: Promise<T>, options: ToastPromiseOptions): string {
    return this.instance()?.promise(promise, options);
  }
}
