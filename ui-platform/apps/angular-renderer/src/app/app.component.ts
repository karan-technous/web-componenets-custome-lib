import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import * as AngularWrappers from "@karan9186/angular";

type StoryProps = Record<string, unknown>;

type StoryPayload = {
  framework: "angular" | "react" | "wc";
  component: string;
  story: string;
  props: StoryProps;
  slots?: Record<string, string>;
  appearance?: "dark" | "light";
  renderers?: {
    angular?: {
      exportName?: string;
      projectedProp?: string;
    };
  };
};

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <div class="preview-root">
      <main class="page">
        <div class="controls">
          <ng-container #container></ng-container>
        </div>
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  @ViewChild("container", { read: ViewContainerRef, static: true })
  private container!: ViewContainerRef;

  private readonly handleMessage = (event: MessageEvent) => {
    if (event.data?.type !== "UPDATE_STORY") {
      return;
    }

    const payload = event.data.payload as StoryPayload;
    if (!payload || payload.framework !== "angular") {
      return;
    }

    console.log("Angular renderer received payload:", JSON.stringify(payload, null, 2));
    this.zone.run(() => {
      this.applyPayload(payload);
      this.cdr.detectChanges();
    });
  };

  ngOnInit(): void {
    this.applyPayload(this.parseInitialPayload());
    window.addEventListener("message", this.handleMessage);
    window.parent.postMessage({ type: "IFRAME_READY" }, "*");
  }

  ngOnDestroy(): void {
    window.removeEventListener("message", this.handleMessage);
  }

  private parseInitialPayload(): StoryPayload {
    const params = new URLSearchParams(window.location.search);
    const component = params.get("component") ?? "button";
    const story = params.get("story") ?? "Primary";
    const appearance =
      params.get("appearance") === "light" ? "light" : "dark";
    const renderersRaw = params.get("renderers");
    let props: StoryProps = {
      label: "Click Me",
      variant: "primary",
      disabled: false,
    };

    try {
      const raw = params.get("props");
      if (raw) {
        props = JSON.parse(raw) as StoryProps;
      }
    } catch {
      props = { label: "Click Me", variant: "primary", disabled: false };
    }

    let slots: Record<string, string> | undefined;
    try {
      const slotsRaw = params.get("slots");
      if (slotsRaw) {
        slots = JSON.parse(slotsRaw) as Record<string, string>;
      }
    } catch {
      slots = undefined;
    }

    let renderers: StoryPayload["renderers"] | undefined;
    if (renderersRaw) {
      try {
        renderers = JSON.parse(renderersRaw) as StoryPayload["renderers"];
      } catch {
        renderers = undefined;
      }
    }

    return {
      framework: "angular",
      component,
      story,
      props,
      slots,
      appearance,
      renderers,
    };
  }

  private applyPayload(payload: StoryPayload): void {
    document.documentElement.dataset.appearance = payload.appearance ?? "dark";
    
    // Special handling for toast - show a button that triggers the toast
    if (payload.component === "toast") {
      this.container.clear();
      
      // Ensure ui-toast element exists
      let toastElement = document.querySelector("ui-toast");
      if (!toastElement) {
        toastElement = document.createElement("ui-toast");
        document.body.appendChild(toastElement);
      }
      
      const buttonComponentType = this.resolveWrapperType("button", "ButtonComponent");
      
      if (buttonComponentType) {
        const buttonRef = this.container.createComponent(buttonComponentType, {
          projectableNodes: [[document.createTextNode("Show Toast")]],
        });
        buttonRef.setInput("variant", "primary");
        
        // Add click handler using event listener on native element
        setTimeout(() => {
          const buttonElement = buttonRef.location.nativeElement as HTMLElement;
          buttonElement.addEventListener("click", () => {
            const toastType = payload.props.type || "info";
            console.log("Angular toast button clicked, type:", toastType);
            
            if (toastType === "promise") {
              console.log("Angular: Promise toast detected");
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
              
              // Use ui-toast element's promise method for promise toast
              const toastEl = document.querySelector("ui-toast") as any;
              console.log("Angular: ui-toast element found:", !!toastEl);
              console.log("Angular: ui-toast has promise method:", typeof toastEl?.promise);
              
              if (toastEl && toastEl.promise) {
                try {
                  toastEl.promise(mockApiCall(), {
                    loading: payload.props.loading || "Loading...",
                    success: payload.props.success || "Success!",
                    error: payload.props.error || "Error!",
                    position: payload.props.position || "bottom-right",
                    duration: parseInt(String(payload.props.duration || "4000")),
                  });
                } catch (e) {
                  console.error("Angular: Failed to show promise toast:", e);
                }
              } else if (toastEl) {
                console.error("Angular: ui-toast does not have promise method, using ToastService");
                // Fallback to ToastService
                const toastService = this.resolveWrapperType("toast", "ToastService");
                if (toastService) {
                  const toast = new toastService() as any;
                  console.log("Angular: ToastService has promise method:", typeof toast.promise);
                  if (toast.promise) {
                    toast.promise(mockApiCall(), {
                      loading: payload.props.loading || "Loading...",
                      success: payload.props.success || "Success!",
                      error: payload.props.error || "Error!",
                      position: payload.props.position || "bottom-right",
                      duration: parseInt(String(payload.props.duration || "4000")),
                    });
                  } else {
                    console.error("Angular: ToastService does not have promise method either");
                  }
                }
              } else {
                console.error("Angular: ui-toast element not found");
              }
            } else {
              console.log("Angular: Regular toast type, using ui-toast element");
              // Use ui-toast element directly for regular types
              const toastEl = document.querySelector("ui-toast") as any;
              if (toastEl && toastEl.show) {
                try {
                  toastEl.show({
                    message: payload.props.message || "Toast message",
                    type: toastType,
                    position: payload.props.position || "top-right",
                  });
                } catch (e) {
                  console.error("Failed to show toast:", e);
                }
              }
            }
          });
        }, 0);
        
        buttonRef.changeDetectorRef.detectChanges();
      }
      return;
    }

    const binding = payload.renderers?.angular;
    const componentType = this.resolveWrapperType(
      payload.component,
      binding?.exportName
    );

    this.container.clear();

    if (!componentType) {
      return;
    }

    const projectedProp =
      binding?.projectedProp ??
      (Object.prototype.hasOwnProperty.call(payload.props, "label")
        ? "label"
        : undefined);

    // Special handling for button-group to parse buttons JSON and create ui-button web component elements
    let projectableNodes: Node[][] | undefined;
    
    // Handle slots for Panel component
    if (payload.component === "panel" && payload.slots) {
      const slotNodes: Node[] = [];
      
      if (payload.slots.header) {
        const headerDiv = document.createElement("div");
        headerDiv.innerHTML = payload.slots.header;
        headerDiv.setAttribute("slot", "header");
        slotNodes.push(headerDiv);
      }
      
      if (payload.slots.actions) {
        const actionsDiv = document.createElement("div");
        actionsDiv.innerHTML = payload.slots.actions;
        actionsDiv.setAttribute("slot", "actions");
        slotNodes.push(actionsDiv);
      }
      
      if (payload.slots.default) {
        const defaultDiv = document.createElement("div");
        defaultDiv.innerHTML = payload.slots.default;
        slotNodes.push(defaultDiv);
      }
      
      if (payload.slots.footer) {
        const footerDiv = document.createElement("div");
        footerDiv.innerHTML = payload.slots.footer;
        footerDiv.setAttribute("slot", "footer");
        slotNodes.push(footerDiv);
      }
      
      projectableNodes = [slotNodes];
    } else if (payload.component === "button-group" && projectedProp === "buttons" && typeof payload.props[projectedProp] !== "undefined") {
      try {
        const buttonsData = JSON.parse(String(payload.props[projectedProp]));
        if (Array.isArray(buttonsData)) {
          // Create ui-button web component elements directly
          const buttonNodes: Node[] = buttonsData.map((btn: any) => {
            const buttonEl = document.createElement("ui-button");
            buttonEl.setAttribute("value", btn.value);
            buttonEl.textContent = btn.label;
            // Apply additional button props if present
            if (btn.variant) buttonEl.setAttribute("variant", btn.variant);
            if (btn.size) buttonEl.setAttribute("size", btn.size);
            if (btn.iconLeft) buttonEl.setAttribute("icon-left", btn.iconLeft);
            if (btn.iconRight) buttonEl.setAttribute("icon-right", btn.iconRight);
            return buttonEl;
          });
          projectableNodes = [buttonNodes];
        }
      } catch (e) {
        console.error("Failed to parse buttons JSON:", e);
      }
    }

    const projectedValue =
      projectedProp && typeof payload.props[projectedProp] !== "undefined" && !projectableNodes
        ? String(payload.props[projectedProp])
        : "";

    if (payload.component === "date-picker") {
      const parserPreset = String(payload.props.parserPreset ?? "none");
      if (parserPreset === "todayNextWeek") {
        payload.props.customParsers = [
          { regex: /today/i, parse: () => new Date() },
          { regex: /next week/i, parse: () => new Date(Date.now() + 7 * 86400000) },
        ] as any;
      }
      delete payload.props.parserPreset;
    }

    const ref = projectedProp && !projectableNodes
      ? this.container.createComponent(componentType, {
          projectableNodes: [[document.createTextNode(projectedValue)]],
        })
      : this.container.createComponent(componentType, {
          projectableNodes: projectableNodes || [],
        });

    for (const [key, value] of Object.entries(payload.props)) {
      if (projectedProp && key === projectedProp) {
        continue;
      }
      if (key === "checked") {
        continue;
      }
      if (key === "disabled") {
        try {
          ref.setInput("disabled", this.toBoolean(value as string | boolean | undefined));
        } catch {
          // Ignore wrappers that don't expose disabled.
        }
      }

      try {
        ref.setInput(key, value as never);
      } catch {
        // Ignore unknown inputs.
      }
    }

    if (payload.component === "date-picker") {
      const hostElement = ref.location.nativeElement as HTMLElement;
      hostElement.style.display = "block";
      hostElement.style.width = "100%";
      hostElement.style.maxWidth = "400px";
      hostElement.style.margin = "24px";
      hostElement.style.boxSizing = "border-box";
    }

    const instance = ref.instance as {
      writeValue?: (value: unknown) => void;
      setDisabledState?: (disabled: boolean) => void;
    };

    if (payload.component === "panel") {
      const hostElement = ref.location.nativeElement as HTMLElement;
      hostElement.style.display = "block";
      hostElement.style.width = "100%";
      hostElement.style.maxWidth = "600px";
      hostElement.style.margin = "24px auto";
      hostElement.style.background = "var(--ui-bg-subtle, var(--ui-bg))";
      hostElement.style.boxSizing = "border-box";
    }

    if (typeof instance.writeValue === "function") {
      if ("value" in payload.props) {
        instance.writeValue(payload.props.value);
      } else if ("checked" in payload.props) {
        instance.writeValue(this.toBoolean(payload.props.checked as string | boolean | undefined));
      }
    }

    if (
      typeof instance.setDisabledState === "function" &&
      "disabled" in payload.props
    ) {
      instance.setDisabledState(this.toBoolean(payload.props.disabled as string | boolean | undefined));
    }

    ref.changeDetectorRef.detectChanges();
  }

  private resolveWrapperType(
    componentId: string,
    explicitExportName?: string
  ): Type<unknown> | null {
    const pascal = this.toPascalCase(componentId);
    const candidates = [
      explicitExportName,
      `${pascal}Component`,
      `Ui${pascal}Component`,
    ].filter(Boolean) as string[];

    for (const key of candidates) {
      const candidate = (AngularWrappers as Record<string, unknown>)[key];
      if (candidate && typeof candidate === "function") {
        return candidate as Type<unknown>;
      }
    }

    return null;
  }

  private toPascalCase(value: string): string {
    return value
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join("");
  }

  private toBoolean(value: string | boolean | undefined): boolean {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      return normalized === "true" || normalized === "1" || normalized === "yes";
    }

    return false;
  }
}
