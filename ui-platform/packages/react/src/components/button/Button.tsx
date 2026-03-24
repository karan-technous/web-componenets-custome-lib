import { useEffect, useRef } from "react";

export const UiButton = ({ children, onClick }: any) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    const el = ref.current;

    const handler = () => onClick?.();

    el.addEventListener("clicked", handler);
    return () => el.removeEventListener("clicked", handler);
  }, []);

  return <ui-button ref={ref}>{children}</ui-button>;
};
