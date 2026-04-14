import { ToastConfig, ToastSettings } from './toast.types';

const DEFAULT_TOAST_SETTINGS: ToastSettings = {
  maxVisible: 4,
  hoverLimit: 3,
  defaultDuration: 4000,
  stackGap: 10,
  pauseOnHover: true,
  swipeDismiss: false,
};

let toastSettings: ToastSettings = { ...DEFAULT_TOAST_SETTINGS };

export function configureToast(config: ToastConfig): void {
  toastSettings = {
    ...toastSettings,
    ...config,
  };
}

export function getToastSettings(): ToastSettings {
  return { ...toastSettings };
}

export function getToastHoverLimit(): number {
  return toastSettings.hoverLimit;
}

export function getToastMaxVisible(): number {
  return toastSettings.maxVisible;
}

export function resetToastSettings(): void {
  toastSettings = { ...DEFAULT_TOAST_SETTINGS };
}
