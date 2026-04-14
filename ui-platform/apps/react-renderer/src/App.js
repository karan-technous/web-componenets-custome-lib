import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { createElement, useEffect, useState, } from "react";
import * as ReactWrappers from "@karan9186/react";
import "./theme.css";
const initialPayload = {
    framework: "react",
    component: "button",
    story: "Primary",
    props: {
        label: "Click Me",
        variant: "primary",
        disabled: false,
    },
};
function toPascalCase(value) {
    return value
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join("");
}
function resolveWrapper(componentId, explicitExportName) {
    const pascal = toPascalCase(componentId);
    const candidates = [
        explicitExportName,
        `Ui${pascal}`,
        pascal,
    ].filter(Boolean);
    for (const key of candidates) {
        const candidate = ReactWrappers[key];
        if (candidate &&
            (typeof candidate === "function" || typeof candidate === "object")) {
            return candidate;
        }
    }
    return null;
}
function parsePayloadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const component = params.get("component") ?? initialPayload.component;
    const story = params.get("story") ?? initialPayload.story;
    const appearance = params.get("appearance") === "light" ? "light" : "dark";
    const propsRaw = params.get("props");
    const renderersRaw = params.get("renderers");
    let parsedProps = initialPayload.props;
    if (propsRaw) {
        try {
            parsedProps = JSON.parse(propsRaw);
        }
        catch {
            parsedProps = initialPayload.props;
        }
    }
    let parsedRenderers;
    if (renderersRaw) {
        try {
            parsedRenderers = JSON.parse(renderersRaw);
        }
        catch {
            parsedRenderers = undefined;
        }
    }
    return {
        framework: "react",
        component,
        story,
        props: parsedProps,
        appearance,
        renderers: parsedRenderers,
    };
}
function renderDynamicComponent(payload) {
    const binding = payload.renderers?.react;
    console.log("renderDynamicComponent called with:", JSON.stringify(payload, null, 2));
    // Special handling for toast - show a button that triggers the toast
    // Check multiple ways to identify toast: component name, exportName, or tagName
    const isToast = payload.component === "toast" ||
        payload.renderers?.react?.exportName === "UiToast" ||
        payload.renderers?.wc?.tagName === "ui-toast";
    console.log("Toast check:", { component: payload.component, exportName: binding?.exportName, isToast });
    if (isToast) {
        console.log("Toast detected, rendering button");
        // Create a proper component that uses the useToast hook
        const ToastButtonComponent = () => {
            const { useToast } = ReactWrappers;
            const toast = useToast();
            // Mock API call for promise toast example
            const mockApiCall = () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const success = Math.random() > 0.3; // 70% success rate
                        console.log("Mock API call result:", success);
                        if (success) {
                            resolve({ data: "Operation completed successfully" });
                        }
                        else {
                            reject(new Error("Operation failed"));
                        }
                    }, 3000);
                });
            };
            const handleShowToast = () => {
                const toastType = payload.props.type || "info";
                if (toastType === "promise") {
                    // Use toast.promise() for promise type
                    toast.promise(mockApiCall(), {
                        loading: payload.props.loading || "Loading...",
                        success: payload.props.success || "Success!",
                        error: payload.props.error || "Error!",
                        position: payload.props.position || "bottom-right",
                        duration: parseInt(String(payload.props.duration || "4000")),
                    });
                }
                else {
                    // Use toast.show() for regular types
                    toast.show({
                        message: payload.props.message || "Toast message",
                        type: toastType,
                        position: payload.props.position || "top-right",
                    });
                }
            };
            // Use UiButton component for toast
            const ButtonWrapper = resolveWrapper("button", "UiButton");
            if (ButtonWrapper) {
                return createElement(ButtonWrapper, {
                    variant: "primary",
                    onClick: handleShowToast,
                }, "Show Toast");
            }
            // Fallback to plain button if UiButton not found
            return createElement("button", {
                onClick: handleShowToast,
                className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
            }, "Show Toast");
        };
        return createElement(ToastButtonComponent);
    }
    console.log("Not toast, proceeding with normal rendering");
    const Wrapper = resolveWrapper(payload.component, binding?.exportName);
    if (!Wrapper) {
        return (_jsxs("div", { className: "text-sm text-slate-500", children: ["No React wrapper found for \"", payload.component, "\"."] }));
    }
    const props = { ...payload.props };
    const renderKey = `${payload.component}:${payload.story}:${JSON.stringify(payload.props)}`;
    let children;
    const childrenProp = binding?.childrenProp ??
        (Object.prototype.hasOwnProperty.call(props, "label") ? "label" : undefined);
    if (childrenProp && typeof props[childrenProp] !== "undefined") {
        children = String(props[childrenProp]);
        delete props[childrenProp];
    }
    if (payload.component === "input") {
        props.value = String(props.value ?? "");
        if (typeof props.onChange !== "function") {
            props.onChange = () => { };
        }
    }
    return createElement(Wrapper, { ...props, key: renderKey }, children);
}
export default function App() {
    const [payload, setPayload] = useState(parsePayloadFromUrl());
    useEffect(() => {
        document.documentElement.dataset.appearance = payload.appearance ?? "dark";
    }, [payload.appearance]);
    useEffect(() => {
        const handler = (event) => {
            if (event.data?.type !== "UPDATE_STORY") {
                return;
            }
            const nextPayload = event.data.payload;
            if (!nextPayload || nextPayload.framework !== "react") {
                return;
            }
            console.log("Received ->", event.data);
            setPayload(nextPayload);
        };
        window.addEventListener("message", handler);
        window.parent.postMessage({ type: "IFRAME_READY" }, "*");
        return () => window.removeEventListener("message", handler);
    }, []);
    return (_jsx("main", { className: "page", children: _jsx("section", { className: "canvas", children: _jsx("div", { className: "controls", children: renderDynamicComponent(payload) }) }) }));
}
