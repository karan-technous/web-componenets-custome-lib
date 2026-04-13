import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private instance = signal<any | null>(null);

  register(el: any) {
    this.instance.set(el);
  }

  show(options: any) {
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
}
