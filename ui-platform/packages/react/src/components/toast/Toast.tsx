import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { ToastShowOptions } from "@karan9186/core";

export type UiToastRef = {
  show: (opts: ToastShowOptions) => void;
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
