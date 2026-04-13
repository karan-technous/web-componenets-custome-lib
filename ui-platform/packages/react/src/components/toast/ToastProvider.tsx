import React, { createContext, useContext, useRef } from "react";
import { UiToast, UiToastRef } from "./Toast";

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
    show: (opts: any) => ctx?.current?.show(opts),
    dismiss: (id?: string) => ctx?.current?.dismiss(id),
  };
};
