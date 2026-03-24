import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
export const UiButton = ({ children, onClick }) => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        const handler = () => onClick?.();
        el.addEventListener("clicked", handler);
        return () => el.removeEventListener("clicked", handler);
    }, []);
    return _jsx("ui-button", { ref: ref, children: children });
};
