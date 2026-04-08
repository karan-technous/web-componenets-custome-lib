import "./theme.css";
import { initializeTheme } from "@karan9186/web-components";
import { defineCustomElements } from "@karan9186/web-components/loader";
defineCustomElements();
const root = document.getElementById("app");
if (!root) {
    throw new Error("Missing #app root");
}
document.documentElement.style.height = "100%";
document.documentElement.style.setProperty("--bridge-ui-primary", "#10b981");
document.documentElement.style.setProperty("--bridge-ui-bg", "#ffffff");
document.documentElement.style.setProperty("--bridge-ui-surface", "#ffffff");
document.documentElement.style.setProperty("--bridge-ui-ring", "rgba(16, 185, 129, 0.3)");
initializeTheme();
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
root.style.height = "100%";
root.style.width = "100%";
root.style.overflow = "hidden";
const page = document.createElement("main");
page.className = "page";
const canvas = document.createElement("section");
canvas.className = "canvas";
const controls = document.createElement("div");
controls.className = "controls";
function applyProps(el, props) {
    Object.entries(props).forEach(([key, value]) => {
        try {
            el[key] = value;
        }
        catch {
            el.setAttribute(key, String(value));
        }
    });
}
function renderComponent(payload) {
    controls.innerHTML = "";
    const binding = payload.renderers?.wc;
    const tagName = binding?.tagName ?? `ui-${payload.component}`;
    const textProp = binding?.textProp ??
        (Object.prototype.hasOwnProperty.call(payload.props, "label")
            ? "label"
            : undefined);
    const el = document.createElement(tagName);
    const props = { ...payload.props };
    if (textProp && typeof props[textProp] !== "undefined") {
        el.textContent = String(props[textProp]);
        delete props[textProp];
    }
    applyProps(el, props);
    controls.appendChild(el);
}
function applyAppearance(appearance) {
    document.documentElement.dataset.appearance = appearance;
    const isLight = appearance === "light";
    document.documentElement.style.setProperty("--bridge-ui-bg", isLight ? "#ffffff" : "#0b1020");
    document.documentElement.style.setProperty("--bridge-ui-surface", isLight ? "#ffffff" : "#12182a");
}
function parseInitialPayload() {
    const params = new URLSearchParams(window.location.search);
    const component = params.get("component") ?? "button";
    const story = params.get("story") ?? "Primary";
    const appearance = params.get("appearance") === "light" ? "light" : "dark";
    const renderersRaw = params.get("renderers");
    let props = {
        label: "Click Me",
        variant: "primary",
        disabled: false,
    };
    let renderers;
    try {
        const raw = params.get("props");
        if (raw) {
            props = JSON.parse(raw);
        }
    }
    catch {
        props = { label: "Click Me", variant: "primary", disabled: false };
    }
    try {
        if (renderersRaw) {
            renderers = JSON.parse(renderersRaw);
        }
    }
    catch {
        renderers = undefined;
    }
    return {
        framework: "wc",
        component,
        story,
        props,
        appearance,
        renderers,
    };
}
const initialPayload = parseInitialPayload();
applyAppearance(initialPayload.appearance ?? "dark");
renderComponent(initialPayload);
window.parent.postMessage({ type: "IFRAME_READY" }, "*");
window.addEventListener("message", (event) => {
    if (event.data?.type !== "UPDATE_STORY") {
        return;
    }
    const payload = event.data.payload;
    if (!payload || payload.framework !== "wc") {
        return;
    }
    console.log("Received ->", event.data);
    applyAppearance(payload.appearance ?? "dark");
    renderComponent(payload);
});
canvas.appendChild(controls);
page.appendChild(canvas);
root.appendChild(page);
