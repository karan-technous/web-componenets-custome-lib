import {
  createElement,
  useEffect,
  useState,
  type ElementType,
  type ReactElement,
} from "react";
import * as ReactWrappers from "@karan9186/react";
import "./theme.css";

type StoryProps = Record<string, string | boolean>;

type StoryPayload = {
  framework: "angular" | "react" | "wc";
  component: string;
  story: string;
  props: StoryProps;
  renderers?: {
    react?: {
      exportName?: string;
      childrenProp?: string;
    };
  };
};

const initialPayload: StoryPayload = {
  framework: "react",
  component: "button",
  story: "Primary",
  props: {
    label: "Click Me",
    variant: "primary",
    disabled: false,
  },
};

function toPascalCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function resolveWrapper(
  componentId: string,
  explicitExportName?: string
): ElementType<Record<string, unknown>> | null {
  const pascal = toPascalCase(componentId);
  const candidates = [
    explicitExportName,
    `Ui${pascal}`,
    pascal,
  ].filter(Boolean) as string[];

  for (const key of candidates) {
    const candidate = (ReactWrappers as Record<string, unknown>)[key];
    if (
      candidate &&
      (typeof candidate === "function" || typeof candidate === "object")
    ) {
      return candidate as ElementType<Record<string, unknown>>;
    }
  }

  return null;
}

function parsePayloadFromUrl(): StoryPayload {
  const params = new URLSearchParams(window.location.search);
  const component = params.get("component") ?? initialPayload.component;
  const story = params.get("story") ?? initialPayload.story;
  const propsRaw = params.get("props");
  const renderersRaw = params.get("renderers");

  let parsedProps = initialPayload.props;
  if (propsRaw) {
    try {
      parsedProps = JSON.parse(propsRaw) as StoryProps;
    } catch {
      parsedProps = initialPayload.props;
    }
  }

  let parsedRenderers: StoryPayload["renderers"] | undefined;
  if (renderersRaw) {
    try {
      parsedRenderers = JSON.parse(renderersRaw) as StoryPayload["renderers"];
    } catch {
      parsedRenderers = undefined;
    }
  }

  return {
    framework: "react",
    component,
    story,
    props: parsedProps,
    renderers: parsedRenderers,
  };
}

function renderDynamicComponent(payload: StoryPayload): ReactElement {
  const binding = payload.renderers?.react;
  const Wrapper = resolveWrapper(payload.component, binding?.exportName);
  if (!Wrapper) {
    return (
      <div className="text-sm text-slate-500">
        No React wrapper found for "{payload.component}".
      </div>
    );
  }

  const props: Record<string, unknown> = { ...payload.props };
  let children: string | undefined;

  const childrenProp =
    binding?.childrenProp ??
    (Object.prototype.hasOwnProperty.call(props, "label") ? "label" : undefined);

  if (childrenProp && typeof props[childrenProp] !== "undefined") {
    children = String(props[childrenProp]);
    delete props[childrenProp];
  }

  return createElement(Wrapper, props, children);
}

export default function App() {
  const [payload, setPayload] = useState<StoryPayload>(parsePayloadFromUrl());

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== "UPDATE_STORY") {
        return;
      }

      const nextPayload = event.data.payload as StoryPayload;
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

  return (
    <main className="page">
      <section className="canvas">
        <div className="controls">{renderDynamicComponent(payload)}</div>
      </section>
    </main>
  );
}
