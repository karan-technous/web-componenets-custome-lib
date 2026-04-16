import "./theme.css";
import { initializeTheme } from "@karan9186/web-components";
import { defineCustomElements } from "@karan9186/web-components/loader";
import { applyTheme, lightTheme, darkTheme } from "@karan9186/core";
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
    // Special handling for toast - show a button that triggers the toast
    if (payload.component === "toast") {
        const button = document.createElement("ui-button");
        button.textContent = "Show Toast";
        button.setAttribute("variant", "primary");
        button.addEventListener("click", () => {
            const toastType = payload.props.type || "info";
            if (toastType === "promise") {
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
                // Use toast.promise() for promise type
                const toastElement = document.querySelector("ui-toast");
                if (toastElement && toastElement.promise) {
                    try {
                        toastElement.promise(mockApiCall(), {
                            loading: payload.props.loading || "Loading...",
                            success: payload.props.success || "Success!",
                            error: payload.props.error || "Error!",
                            position: payload.props.position || "bottom-right",
                            duration: parseInt(String(payload.props.duration || "4000")),
                        });
                    }
                    catch (e) {
                        console.error("Failed to show promise toast:", e);
                    }
                }
            }
            else {
                // Use toast.show() for regular types
                const toastElement = document.querySelector("ui-toast");
                if (toastElement) {
                    try {
                        toastElement.show({
                            message: payload.props.message || "Toast message",
                            type: toastType,
                            position: payload.props.position || "top-right",
                        });
                    }
                    catch (e) {
                        console.error("Failed to show toast:", e);
                    }
                }
            }
        });
        controls.appendChild(button);
        return;
    }
    const binding = payload.renderers?.wc;
    const tagName = binding?.tagName ?? `ui-${payload.component}`;
    const textProp = binding?.textProp ??
        (Object.prototype.hasOwnProperty.call(payload.props, "label")
            ? "label"
            : undefined);
    const el = document.createElement(tagName);
    const props = { ...payload.props };
    // Special handling for button-group to parse buttons JSON and create ui-button elements
    if (payload.component === "button-group" && textProp === "buttons" && typeof props[textProp] !== "undefined") {
        try {
            const buttonsData = JSON.parse(String(props[textProp]));
            if (Array.isArray(buttonsData)) {
                buttonsData.forEach((btn) => {
                    const buttonEl = document.createElement("ui-button");
                    buttonEl.setAttribute("value", btn.value);
                    buttonEl.textContent = btn.label;
                    // Apply additional button props if present
                    if (btn.variant)
                        buttonEl.setAttribute("variant", btn.variant);
                    if (btn.size)
                        buttonEl.setAttribute("size", btn.size);
                    if (btn.iconLeft)
                        buttonEl.setAttribute("icon-left", btn.iconLeft);
                    if (btn.iconRight)
                        buttonEl.setAttribute("icon-right", btn.iconRight);
                    el.appendChild(buttonEl);
                });
            }
            delete props[textProp];
        }
        catch (e) {
            console.error("Failed to parse buttons JSON:", e);
            if (textProp && typeof props[textProp] !== "undefined") {
                el.textContent = String(props[textProp]);
                delete props[textProp];
            }
        }
    }
    else if (textProp && typeof props[textProp] !== "undefined") {
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
    // Apply core theme
    const coreTheme = isLight ? lightTheme : darkTheme;
    applyTheme(coreTheme);
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
let currentAppearance = "dark";
const initialPayload = parseInitialPayload();
currentAppearance = initialPayload.appearance ?? "dark";
try {
    applyAppearance(currentAppearance);
    renderComponent(initialPayload);
    window.parent.postMessage({ type: "IFRAME_READY" }, "*");
}
catch (error) {
    console.error("Failed to initialize renderer:", error);
    window.parent.postMessage({ type: "IFRAME_READY" }, "*");
}
window.addEventListener("message", (event) => {
    try {
        if (event.data?.type === "UPDATE_THEME") {
            const appearance = event.data.appearance;
            console.log("Received UPDATE_THEME ->", appearance);
            currentAppearance = appearance;
            applyAppearance(appearance);
            return;
        }
        if (event.data?.type !== "UPDATE_STORY") {
            return;
        }
        const payload = event.data.payload;
        if (!payload || payload.framework !== "wc") {
            return;
        }
        console.log("WC renderer received payload:", JSON.stringify(payload, null, 2));
        if (payload.appearance) {
            currentAppearance = payload.appearance;
        }
        applyAppearance(currentAppearance);
        renderComponent(payload);
    }
    catch (error) {
        console.error("Failed to handle message:", error);
    }
});
canvas.appendChild(controls);
page.appendChild(canvas);
// Add ui-toast element to the page for toast notifications
let toastElement = document.querySelector("ui-toast");
if (!toastElement) {
    toastElement = document.createElement("ui-toast");
    document.body.appendChild(toastElement);
}
root.appendChild(page);
