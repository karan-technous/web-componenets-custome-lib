import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type ToastOptions = {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  duration?: number;
  closable?: boolean;
};

export type UiToastRef = {
  show: (opts: ToastOptions) => void;
  dismiss: (id?: string) => void;
};

type Props = {
  onOpen?: (e: any) => void;
  onClose?: (e: any) => void;
};

export const UiToast = forwardRef<UiToastRef, Props>((props, ref) => {
  const elRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    show: (opts) => elRef.current?.show(opts),
    dismiss: (id) => elRef.current?.dismiss(id),
  }));

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const handleShow = (e: any) => props.onOpen?.(e.detail);
    const handleClose = (e: any) => props.onClose?.(e.detail);

    el.addEventListener("toastShow", handleShow);
    el.addEventListener("toastClose", handleClose);

    return () => {
      el.removeEventListener("toastShow", handleShow);
      el.removeEventListener("toastClose", handleClose);
    };
  }, [props.onOpen, props.onClose]);

  return <ui-toast ref={elRef} />;
});
