import React, {
  createElement,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ElementType,
  type ReactElement,
} from "react";
import * as ReactWrappers from "@karan9186/react";
import "./theme.css";

type StoryProps = Record<string, unknown>;

type StoryPayload = {
  framework: "angular" | "react" | "wc";
  component: string;
  story: string;
  props: StoryProps;
  slots?: Record<string, string>;
  appearance?: "dark" | "light";
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
  const appearance =
    params.get("appearance") === "light" ? "light" : "dark";
  const propsRaw = params.get("props");
  const slotsRaw = params.get("slots");
  const renderersRaw = params.get("renderers");

  let parsedProps = initialPayload.props;
  if (propsRaw) {
    try {
      parsedProps = JSON.parse(propsRaw) as StoryProps;
    } catch {
      parsedProps = initialPayload.props;
    }
  }

  let parsedSlots: Record<string, string> | undefined;
  if (slotsRaw) {
    try {
      parsedSlots = JSON.parse(slotsRaw) as Record<string, string>;
    } catch {
      parsedSlots = undefined;
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
    slots: parsedSlots,
    appearance,
    renderers: parsedRenderers,
  };
}

function renderDynamicComponent(payload: StoryPayload): ReactElement {
  const binding = payload.renderers?.react;
  
  console.log("renderDynamicComponent called with:", JSON.stringify(payload, null, 2));
  
  // Special handling for toast - show a button that triggers the toast
  // Check multiple ways to identify toast: component name, exportName, or tagName
  const isToast = 
    payload.component === "toast" ||
    payload.renderers?.react?.exportName === "UiToast" ||
    (payload.renderers as any)?.wc?.tagName === "ui-toast";
  
  console.log("Toast check:", { component: payload.component, exportName: binding?.exportName, isToast });
  
  if (isToast) {
    console.log("Toast detected, rendering button");
    
    // Create a proper component that uses the useToast hook
    const ToastButtonComponent = () => {
      const { useToast } = ReactWrappers as { useToast: () => any };
      const toast = useToast();
      
      // Mock API call for promise toast example
      const mockApiCall = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.3; // 70% success rate
            console.log("Mock API call result:", success);
            if (success) {
              resolve({ data: "Operation completed successfully" });
            } else {
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
        } else {
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
    return (
      <div className="text-sm text-slate-500">
        No React wrapper found for "{payload.component}".
      </div>
    );
  }

  const props: Record<string, unknown> = { ...payload.props };
  const renderKey = `${payload.component}:${payload.story}:${JSON.stringify(payload.props)}`;
  let children: string | ReactElement | ReactElement[] | undefined;

  // Remove children from props to avoid conflicts with DOM read-only property
  delete (props as any).children;

  const childrenProp = binding?.childrenProp;

  // Special handling for button-group to parse buttons JSON and create UiButton components
  if (payload.component === "button-group" && childrenProp === "buttons" && typeof props[childrenProp] !== "undefined") {
    try {
      const buttonsData = JSON.parse(String(props[childrenProp]));
      if (Array.isArray(buttonsData)) {
        const ButtonWrapper = resolveWrapper("button", "UiButton");
        children = buttonsData.map((btn: any, index: number) => {
          if (ButtonWrapper) {
            return createElement(ButtonWrapper, {
              key: index,
              value: btn.value,
              variant: btn.variant,
              size: btn.size,
              iconLeft: btn.iconLeft,
              iconRight: btn.iconRight,
              children: btn.label,
            });
          }
          return createElement("button", {
            key: index,
            value: btn.value,
          }, btn.label);
        });
      }
      delete props[childrenProp];
    } catch (e) {
      console.error("Failed to parse buttons JSON:", e);
      children = String(props[childrenProp]);
      delete props[childrenProp];
    }
  } else if (payload.component === "radio-group" && childrenProp === "radios" && typeof props[childrenProp] !== "undefined") {
    try {
      const radiosData = JSON.parse(String(props[childrenProp]));
      if (Array.isArray(radiosData)) {
        const RadioWrapper = resolveWrapper("radio", "Radio");
        children = radiosData.map((radio: any, index: number) => {
          if (RadioWrapper) {
            return createElement(RadioWrapper, {
              key: index,
              value: radio.value,
              label: radio.label,
              supportingText: radio.supportingText,
              size: radio.size,
            });
          }
          return createElement("ui-radio", {
            key: index,
            value: radio.value,
            label: radio.label,
          });
        });
      }
      delete props[childrenProp];
    } catch (e) {
      console.error("Failed to parse radios JSON:", e);
      children = String(props[childrenProp]);
      delete props[childrenProp];
    }
  } else if (childrenProp && typeof props[childrenProp] !== "undefined") {
    children = String(props[childrenProp]);
    delete props[childrenProp];
  }

  if (payload.component === "input") {
    props.value = String(props.value ?? "");
    if (typeof props.onChange !== "function") {
      props.onChange = () => {};
    }
  }

  if (payload.component === "date-picker") {
    const parserPreset = String((props as any).parserPreset ?? "none");
    if (parserPreset === "todayNextWeek") {
      props.customParsers = [
        { regex: /today/i, parse: () => new Date() },
        { regex: /next week/i, parse: () => new Date(Date.now() + 7 * 86400000) },
      ];
    }
    delete (props as any).parserPreset;
  }

  // Handle slots for Panel component
  if (payload.component === "panel" && payload.slots) {
    const slotElements: ReactElement[] = [];
    
    if (payload.slots.header) {
      slotElements.push(createElement("div", {
        slot: "header",
        dangerouslySetInnerHTML: { __html: payload.slots.header }
      }));
    }
    
    if (payload.slots.actions) {
      slotElements.push(createElement("div", {
        slot: "actions",
        dangerouslySetInnerHTML: { __html: payload.slots.actions }
      }));
    }
    
    if (payload.slots.default) {
      slotElements.push(createElement("div", {
        dangerouslySetInnerHTML: { __html: payload.slots.default }
      }));
    }
    
    if (payload.slots.footer) {
      slotElements.push(createElement("div", {
        slot: "footer",
        dangerouslySetInnerHTML: { __html: payload.slots.footer }
      }));
    }
    
    return createElement(
      "div",
      {
        style: {
        },
      },
      createElement("ui-panel" as any, {
        ...props,
        key: renderKey,
      }, slotElements),
    );
  }

  const rendered = createElement(Wrapper, { ...props, key: renderKey }, children);
  if (payload.component !== "date-picker") {
    return rendered;
  }

  return createElement(
    "div",
    {
      style: {
      },
    },
    rendered,
  );
}

const App = React.memo(function App() {
  const [payload, setPayload] = useState<StoryPayload>(parsePayloadFromUrl());

  // Memoize appearance to prevent unnecessary effect runs
  const appearance = useMemo(() => payload.appearance ?? "dark", [payload.appearance]);

  useEffect(() => {
    document.documentElement.dataset.appearance = appearance;
  }, [appearance]);

  // Memoize message handler to prevent recreating on each render
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type !== "UPDATE_STORY") {
      return;
    }

    const nextPayload = event.data.payload as StoryPayload;
    if (!nextPayload || nextPayload.framework !== "react") {
      return;
    }

    // Log only in development (check for Vite dev mode)
    if (import.meta.env?.DEV) {
      console.log("React renderer received payload:", JSON.stringify(nextPayload, null, 2));
    }
    setPayload(nextPayload);
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "IFRAME_READY" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // Memoize rendered component to prevent unnecessary re-renders
  const renderedComponent = useMemo(() => renderDynamicComponent(payload), [payload]);

  return (
    <main className="page">
      <section className="canvas">
        <div className="controls">{renderedComponent}</div>
      </section>
    </main>
  );
});

export default App;
