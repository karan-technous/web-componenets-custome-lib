import { componentRegistry, type AngularComponentBinding, type ComponentRegistryEntry, type ReactComponentBinding, type WcComponentBinding } from "./componentRegistry";
import type { Framework } from "./frameworkStore";
import type {
  SelectedStory,
  Story,
  StoryCustomCode,
  StoryRendererBindings,
} from "./storyTypes";

type Primitive = string | number | boolean | null;
type RawReactExpression = { __raw: string };

export interface TransformedStory {
  framework: Framework;
  component: string;
  story: string;
  code: string;
  angularImports?: string[];
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function toLiteral(value: unknown): string {
  if (typeof value === "undefined") {
    return "undefined";
  }

  return JSON.stringify(value);
}

function reactPropValue(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "__raw" in value &&
    typeof (value as RawReactExpression).__raw === "string"
  ) {
    return `{${(value as RawReactExpression).__raw}}`;
  }

  return `{${toLiteral(value)}}`;
}

function angularPropValue(value: unknown): string {
  return toLiteral(value);
}

function htmlAttrName(name: string): string {
  return name.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function buildReactProps(props: Record<string, unknown>): string {
  const entries = Object.entries(props).map(
    ([key, value]) => `${key}=${reactPropValue(value)}`,
  );

  return entries.length > 0 ? ` ${entries.join(" ")}` : "";
}

function buildAngularProps(props: Record<string, unknown>): string {
  const entries = Object.entries(props).map(
    ([key, value]) => `[${key}]="${escapeHtml(angularPropValue(value))}"`,
  );

  return entries.length > 0 ? ` ${entries.join(" ")}` : "";
}

function buildHtmlProps(props: Record<string, unknown>): string {
  const entries = Object.entries(props).flatMap(([key, value]) => {
    if (typeof value === "boolean") {
      return value ? [htmlAttrName(key)] : [];
    }

    if (value === null || typeof value === "undefined") {
      return [];
    }

    return [`${htmlAttrName(key)}="${escapeHtml(String(value))}"`];
  });

  return entries.length > 0 ? ` ${entries.join(" ")}` : "";
}

function parseJsonArray(value: unknown): unknown[] | null {
  if (typeof value !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function resolveMeta(
  story: Story,
  framework: Framework,
  overrides?: StoryRendererBindings,
): ComponentRegistryEntry[Framework] {
  const registryEntry = componentRegistry[story.component];
  const fromRegistry = registryEntry?.[framework];

  if (!fromRegistry) {
    throw new Error(
      `No component registry entry found for "${story.component}" on "${framework}".`,
    );
  }

  const override = overrides?.[framework];
  return { ...fromRegistry, ...override } as ComponentRegistryEntry[Framework];
}

function buildToastReactCode(props: Record<string, unknown>): string {
  return `
const BridgeReact = window.BridgeReact;
const BridgeReactWrappers = window.BridgeReactWrappers;
const { UiButton, useToast } = BridgeReactWrappers;

export default function Story() {
  const toast = useToast();
  const handleClick = () => {
    const options = ${toLiteral(props)};

    if (options.type === "promise" && typeof toast.promise === "function") {
      toast.promise(
        new Promise((resolve, reject) => {
          window.setTimeout(() => {
            Math.random() > 0.3 ? resolve({ ok: true }) : reject(new Error("Request failed"));
          }, 1200);
        }),
        {
          loading: options.loading || "Loading...",
          success: options.success || "Success!",
          error: options.error || "Error!",
          position: options.position || "bottom-right",
          duration: Number(options.duration || 4000),
        }
      );
      return;
    }

    toast.show({
      message: options.message || "Toast message",
      type: options.type || "info",
      position: options.position || "top-right",
    });
  };

  return <UiButton variant={"primary"} onClick={handleClick}>Show Toast</UiButton>;
}
`.trim();
}

function buildToastAngularTemplate(props: Record<string, unknown>): string {
  const options = {
    message: props.message ?? "Toast message",
    type: props.type === "promise" ? "info" : props.type ?? "info",
    position: props.position ?? "top-right",
  };

  return `
<ui-toast-angular></ui-toast-angular>
<ui-button-angular [variant]="'primary'" [toastTrigger]="${escapeHtml(
   toLiteral(options),
 )}">
  Show Toast
</ui-button-angular>
`.trim();
}

function buildToastHtml(props: Record<string, unknown>): string {
  const escapedOptions = escapeHtml(JSON.stringify(props));
  return `
<div class="bridge-toast-demo">
  <button type="button" data-bridge-toast-trigger="${escapedOptions}">Show Toast</button>
  <ui-toast></ui-toast>
</div>
`.trim();
}

function buildGroupReactChildren(
  component: "button-group" | "radio-group",
  items: unknown[] | null,
): string | null {
  if (!items) {
    return null;
  }

  if (component === "button-group") {
    return items
      .map((item) => {
        const button = item as Record<string, Primitive>;
        const child = button.label ? escapeHtml(String(button.label)) : "";
        const props = {
          value: button.value,
          variant: button.variant,
          size: button.size,
          iconLeft: button.iconLeft,
          iconRight: button.iconRight,
        };
        return `<BridgeReactWrappers.UiButton${buildReactProps(
          Object.fromEntries(
            Object.entries(props).filter(([, value]) => typeof value !== "undefined"),
          ),
        )}>${child}</BridgeReactWrappers.UiButton>`;
      })
      .join("\n");
  }

  return items
    .map((item) => {
      const radio = item as Record<string, Primitive>;
      const props = Object.fromEntries(
        Object.entries({
          value: radio.value,
          label: radio.label,
          supportingText: radio.supportingText,
          size: radio.size,
        }).filter(([, value]) => typeof value !== "undefined"),
      );
      return `<BridgeReactWrappers.Radio${buildReactProps(props)} />`;
    })
    .join("\n");
}

function buildGroupAngularChildren(
  component: "button-group" | "radio-group",
  items: unknown[] | null,
): string | null {
  if (!items) {
    return null;
  }

  if (component === "button-group") {
    return items
      .map((item) => {
        const button = item as Record<string, Primitive>;
        const props = Object.fromEntries(
          Object.entries({
            value: button.value,
            variant: button.variant,
            size: button.size,
            iconLeft: button.iconLeft,
            iconRight: button.iconRight,
          }).filter(([, value]) => typeof value !== "undefined"),
        );
        return `<ui-button-angular${buildAngularProps(props)}>${escapeHtml(
          String(button.label ?? ""),
        )}</ui-button-angular>`;
      })
      .join("\n");
  }

  return items
    .map((item) => {
      const radio = item as Record<string, Primitive>;
      const props = Object.fromEntries(
        Object.entries({
          value: radio.value,
          label: radio.label,
          supportingText: radio.supportingText,
          size: radio.size,
        }).filter(([, value]) => typeof value !== "undefined"),
      );
      return `<ui-radio-angular${buildAngularProps(props)}></ui-radio-angular>`;
    })
    .join("\n");
}

function buildGroupHtmlChildren(
  component: "button-group" | "radio-group",
  items: unknown[] | null,
): string | null {
  if (!items) {
    return null;
  }

  if (component === "button-group") {
    return items
      .map((item) => {
        const button = item as Record<string, Primitive>;
        const props = Object.fromEntries(
          Object.entries({
            value: button.value,
            variant: button.variant,
            size: button.size,
            iconLeft: button.iconLeft,
            iconRight: button.iconRight,
          }).filter(([, value]) => typeof value !== "undefined"),
        );
        return `<ui-button${buildHtmlProps(props)}>${escapeHtml(
          String(button.label ?? ""),
        )}</ui-button>`;
      })
      .join("\n");
  }

  return items
    .map((item) => {
      const radio = item as Record<string, Primitive>;
      const props = Object.fromEntries(
        Object.entries({
          value: radio.value,
          label: radio.label,
          supportingText: radio.supportingText,
          size: radio.size,
        }).filter(([, value]) => typeof value !== "undefined"),
      );
      return `<ui-radio${buildHtmlProps(props)}></ui-radio>`;
    })
    .join("\n");
}

function buildSlotReactChildren(slots?: Record<string, string>): string {
  if (!slots) {
    return "";
  }

  return Object.entries(slots)
    .map(([slotName, value]) => {
      if (slotName === "default") {
        return `<div dangerouslySetInnerHTML={{ __html: ${toLiteral(value)} }} />`;
      }

      return `<div slot=${reactPropValue(slotName)} dangerouslySetInnerHTML={{ __html: ${toLiteral(
        value,
      )} }} />`;
    })
    .join("\n");
}

function buildSlotMarkup(
  slots: Record<string, string> | undefined,
  attrs: Record<string, string>,
): string {
  if (!slots) {
    return "";
  }

  return Object.entries(slots)
    .map(([slotName, value]) => {
      const attr = slotName === "default" ? "" : ` ${attrs.slot}="${slotName}"`;
      return `<div${attr}>${value}</div>`;
    })
    .join("\n");
}

function buildAngularPanelSlots(slots?: Record<string, string>): string {
  if (!slots) {
    return "";
  }

  const fragments: string[] = [];

  if (slots.header) {
    fragments.push(`<div uiPanelHeader>${slots.header}</div>`);
  }
  if (slots.actions) {
    fragments.push(`<div uiPanelActions>${slots.actions}</div>`);
  }
  if (slots.default) {
    fragments.push(`<div>${slots.default}</div>`);
  }
  if (slots.footer) {
    fragments.push(`<div uiPanelFooter>${slots.footer}</div>`);
  }

  return fragments.join("\n");
}

function toAbstractStory(selection: SelectedStory): Story {
  return {
    component: selection.component,
    props: { ...selection.props },
    children: selection.slots,
  };
}

function normalizeReactCustomCode(
  selection: SelectedStory,
  code: string,
): string {
  if (code.includes("export default")) {
    return code;
  }

  const binding = resolveMeta(
    toAbstractStory(selection),
    "react",
    selection.renderers,
  ) as ReactComponentBinding;

  const symbols = new Set<string>();
  if (binding.exportName) {
    symbols.add(binding.exportName);
  }

  if (selection.component === "button-group") {
    symbols.add("UiButton");
  }

  const prelude = [
    "const BridgeReact = window.BridgeReact;",
    "const BridgeReactWrappers = window.BridgeReactWrappers;",
    ...[...symbols].map(
      (symbol) => `const ${symbol} = BridgeReactWrappers.${symbol};`,
    ),
  ].join("\n");

  return `
${prelude}

export default function Story() {
  return (
    ${code}
  );
}
`.trim();
}

function normalizeAngularCustomCode(code: string): string {
  return code.trim();
}

function normalizeWcCustomCode(code: string): string {
  return code.trim();
}

function transformReactStory(
  story: Story,
  binding: ReactComponentBinding,
): string {
  const props = { ...(story.props ?? {}) };

  if (story.component === "toast") {
    return buildToastReactCode(props);
  }

  let children = "";
  const childrenProp = binding.childrenProp;

  if (story.component === "panel" && story.children && typeof story.children === "object") {
    children = buildSlotReactChildren(story.children as Record<string, string>);
  } else if (
    (story.component === "button-group" || story.component === "radio-group") &&
    childrenProp
  ) {
    children = buildGroupReactChildren(
      story.component,
      parseJsonArray(props[childrenProp]),
    ) ?? "";
    delete props[childrenProp];
  } else if (childrenProp && typeof props[childrenProp] !== "undefined") {
    children = escapeHtml(String(props[childrenProp]));
    delete props[childrenProp];
  }

  if (story.component === "date-picker") {
    delete props.parserPreset;
  }
  const propString = buildReactProps(
    Object.fromEntries(
      Object.entries(props).filter(([, value]) => typeof value !== "undefined"),
    ),
  );
  const exportName = binding.exportName;

  return `
const BridgeReact = window.BridgeReact;
const BridgeReactWrappers = window.BridgeReactWrappers;
const ${exportName} = BridgeReactWrappers.${exportName};

export default function Story() {
  return (
    <${exportName}${propString}>
      ${children}
    </${exportName}>
  );
}
`.trim();
}

function transformAngularStory(
  story: Story,
  binding: AngularComponentBinding,
): { code: string; imports: string[] } {
  const props = { ...(story.props ?? {}) };

  if (story.component === "toast") {
    return {
      code: buildToastAngularTemplate(props),
      imports: binding.imports ?? [],
    };
  }

  let children = "";
  const projectedProp = binding.projectedProp;

  if (story.component === "panel" && story.children && typeof story.children === "object") {
    children = buildAngularPanelSlots(story.children as Record<string, string>);
  } else if (
    (story.component === "button-group" || story.component === "radio-group") &&
    projectedProp
  ) {
    children = buildGroupAngularChildren(
      story.component,
      parseJsonArray(props[projectedProp]),
    ) ?? "";
    delete props[projectedProp];
  } else if (projectedProp && typeof props[projectedProp] !== "undefined") {
    children = escapeHtml(String(props[projectedProp]));
    delete props[projectedProp];
  }

  delete props.parserPreset;
  const propString = buildAngularProps(props);

  return {
    code: `
<${binding.selector}${propString}>
  ${children}
</${binding.selector}>
`.trim(),
    imports: binding.imports ?? (binding.exportName ? [binding.exportName] : []),
  };
}

function transformWcStory(story: Story, binding: WcComponentBinding): string {
  const props = { ...(story.props ?? {}) };

  if (story.component === "toast") {
    return buildToastHtml(props);
  }

  let children = "";
  const textProp = binding.textProp;

  if (story.component === "panel" && story.children && typeof story.children === "object") {
    children = buildSlotMarkup(story.children as Record<string, string>, { slot: "slot" });
  } else if (
    (story.component === "button-group" || story.component === "radio-group") &&
    textProp
  ) {
    children = buildGroupHtmlChildren(
      story.component,
      parseJsonArray(props[textProp]),
    ) ?? "";
    delete props[textProp];
  } else if (textProp && typeof props[textProp] !== "undefined") {
    children = escapeHtml(String(props[textProp]));
    delete props[textProp];
  }

  delete props.parserPreset;

  return `
<${binding.tagName}${buildHtmlProps(props)}>
  ${children}
</${binding.tagName}>
`.trim();
}

export function transformStory(
  selection: SelectedStory,
  framework: Framework,
): TransformedStory {
  const customCode = selection.code?.[framework as keyof StoryCustomCode];
  if (customCode) {
    return {
      framework,
      component: selection.component,
      story: selection.storyName,
      code:
        framework === "react"
          ? normalizeReactCustomCode(selection, customCode)
          : framework === "angular"
            ? normalizeAngularCustomCode(customCode)
            : normalizeWcCustomCode(customCode),
      angularImports:
        framework === "angular"
          ? (
              resolveMeta(
                toAbstractStory(selection),
                framework,
                selection.renderers,
              ) as AngularComponentBinding
            ).imports ?? []
          : undefined,
    };
  }

  const story = toAbstractStory(selection);

  if (framework === "react") {
    return {
      framework,
      component: selection.component,
      story: selection.storyName,
      code: transformReactStory(
        story,
        resolveMeta(story, framework, selection.renderers) as ReactComponentBinding,
      ),
    };
  }

  if (framework === "angular") {
    const result = transformAngularStory(
      story,
      resolveMeta(story, framework, selection.renderers) as AngularComponentBinding,
    );
    return {
      framework,
      component: selection.component,
      story: selection.storyName,
      code: result.code,
      angularImports: result.imports,
    };
  }

  return {
    framework,
    component: selection.component,
    story: selection.storyName,
    code: transformWcStory(
      story,
      resolveMeta(story, framework, selection.renderers) as WcComponentBinding,
    ),
  };
}
