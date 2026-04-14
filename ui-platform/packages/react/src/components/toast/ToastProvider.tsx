import React, { createContext, useContext, useRef } from "react";
import { UiToast, UiToastRef } from "./Toast";
import { ToastShowOptions, ToastPromiseOptions, configureToast } from "@karan9186/core";

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

const ToastContext = createContext<React.RefObject<UiToastRef | null> | null>(
  null,
);
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ref = useRef<UiToastRef>(null);

  return (
    <ToastContext.Provider value={ref}>
      {children}
      <UiToast ref={ref} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);

  return {
    show: (opts: ToastShowOptions) => ctx?.current?.show(opts),
    dismiss: (id?: string) => ctx?.current?.dismiss(id),
    promise: <T,>(promise: Promise<T>, opts: ToastPromiseOptions) => ctx?.current?.promise(promise, opts),
  };
};
