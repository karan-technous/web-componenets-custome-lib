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
document.documentElement.style.setProperty(
  "--bridge-ui-ring",
  "rgba(16, 185, 129, 0.3)",
);
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

function applyProps(el: HTMLElement, props: Record<string, string | boolean>) {
  Object.entries(props).forEach(([key, value]) => {
    try {
      (el as unknown as Record<string, unknown>)[key] = value;
    } catch {
      el.setAttribute(key, String(value));
    }
  });
}

type StoryPayload = {
  framework: "angular" | "react" | "wc";
  component: string;
  story: string;
  props: Record<string, string | boolean>;
  renderers?: {
    wc?: {
      tagName?: string;
      textProp?: string;
    };
  };
};

function renderComponent(payload: StoryPayload) {
  controls.innerHTML = "";
  const binding = payload.renderers?.wc;
  const tagName = binding?.tagName ?? `ui-${payload.component}`;
  const textProp =
    binding?.textProp ??
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

function parseInitialPayload(): StoryPayload {
  const params = new URLSearchParams(window.location.search);
  const component = params.get("component") ?? "button";
  const story = params.get("story") ?? "Primary";
  const renderersRaw = params.get("renderers");
  let props: Record<string, string | boolean> = {
    label: "Click Me",
    variant: "primary",
    disabled: false,
  };
  let renderers: StoryPayload["renderers"] | undefined;

  try {
    const raw = params.get("props");
    if (raw) {
      props = JSON.parse(raw) as Record<string, string | boolean>;
    }
  } catch {
    props = { label: "Click Me", variant: "primary", disabled: false };
  }
  try {
    if (renderersRaw) {
      renderers = JSON.parse(renderersRaw) as StoryPayload["renderers"];
    }
  } catch {
    renderers = undefined;
  }

  return {
    framework: "wc",
    component,
    story,
    props,
    renderers,
  };
}

const initialPayload = parseInitialPayload();
renderComponent(initialPayload);
window.parent.postMessage({ type: "IFRAME_READY" }, "*");

window.addEventListener("message", (event: MessageEvent) => {
  if (event.data?.type !== "UPDATE_STORY") {
    return;
  }

  const payload = event.data.payload as StoryPayload;
  if (!payload || payload.framework !== "wc") {
    return;
  }

  console.log("Received ->", event.data);
  renderComponent(payload);
});

canvas.appendChild(controls);
page.appendChild(canvas);
root.appendChild(page);
