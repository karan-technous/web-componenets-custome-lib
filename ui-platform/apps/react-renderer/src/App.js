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
