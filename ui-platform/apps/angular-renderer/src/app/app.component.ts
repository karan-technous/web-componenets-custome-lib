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

type StoryProps = Record<string, string | boolean>;

type StoryPayload = {
  framework: "angular" | "react" | "wc";
  component: string;
  story: string;
  props: StoryProps;
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

    console.log("Received ->", event.data);
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
      renderers,
    };
  }

  private applyPayload(payload: StoryPayload): void {
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

    const projectedValue =
      projectedProp && typeof payload.props[projectedProp] !== "undefined"
        ? String(payload.props[projectedProp])
        : "";

    const ref = projectedProp
      ? this.container.createComponent(componentType, {
          projectableNodes: [[document.createTextNode(projectedValue)]],
        })
      : this.container.createComponent(componentType);

    for (const [key, value] of Object.entries(payload.props)) {
      if (projectedProp && key === projectedProp) {
        continue;
      }
      if (key === "checked") {
        continue;
      }
      if (key === "disabled") {
        try {
          ref.setInput("disabledInput", this.toBoolean(value));
        } catch {
          // Ignore wrappers that don't expose disabledInput.
        }
      }

      try {
        ref.setInput(key, value as never);
      } catch {
        // Ignore unknown inputs.
      }
    }

    const instance = ref.instance as {
      writeValue?: (value: unknown) => void;
      setDisabledState?: (disabled: boolean) => void;
    };

    if (typeof instance.writeValue === "function") {
      if ("value" in payload.props) {
        instance.writeValue(payload.props.value);
      } else if ("checked" in payload.props) {
        instance.writeValue(this.toBoolean(payload.props.checked));
      }
    }

    if (
      typeof instance.setDisabledState === "function" &&
      "disabled" in payload.props
    ) {
      instance.setDisabledState(this.toBoolean(payload.props.disabled));
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
