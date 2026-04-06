import { marked } from "marked";
import { useMemo } from "react";
import type { Framework } from "../state/frameworkStore";
import type {
  SelectedStory,
  StoryProps,
  StoryRendererBindings,
} from "../state/storyTypes";

interface DocsPageProps {
  framework: Framework;
  story: SelectedStory | null;
}

const rendererUrls: Record<Framework, string> = {
  angular: "http://localhost:4200",
  react: "http://localhost:5173",
  wc: "http://localhost:5174",
};

function toPascalCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function getFrameworkCodeComponentName(
  framework: Framework,
  componentId: string,
  bindings?: StoryRendererBindings
): string {
  if (framework === "react") {
    return bindings?.react?.exportName ?? `Ui${toPascalCase(componentId)}`;
  }

  if (framework === "angular") {
    const fromBinding = bindings?.angular?.exportName;
    if (fromBinding) {
      return `<${toKebabCase(fromBinding.replace(/Component$/, ""))}-angular>`;
    }
    return `<ui-${componentId}-angular>`;
  }

  return `<${bindings?.wc?.tagName ?? `ui-${componentId}`}>`;
}

function serializeProps(props: StoryProps): string {
  return Object.entries(props)
    .map(([key, value]) =>
      typeof value === "boolean" ? `${key}={${value}}` : `${key}="${value}"`
    )
    .join(" ");
}

function generateCode(
  framework: Framework,
  componentId: string,
  props: StoryProps,
  bindings?: StoryRendererBindings
): string {
  if (framework === "react") {
    const componentName = getFrameworkCodeComponentName(
      framework,
      componentId,
      bindings
    );
    const childrenProp = bindings?.react?.childrenProp;
    const nextProps = { ...props };
    let children = "";

    if (childrenProp && typeof nextProps[childrenProp] !== "undefined") {
      children = String(nextProps[childrenProp]);
      delete nextProps[childrenProp];
    }

    const attrs = serializeProps(nextProps);
    if (children) {
      return `<${componentName}${attrs ? ` ${attrs}` : ""}>${children}</${componentName}>`;
    }
    return `<${componentName}${attrs ? ` ${attrs}` : ""} />`;
  }

  if (framework === "angular") {
    const tag = bindings?.angular?.exportName
      ? `${toKebabCase(
          bindings.angular.exportName.replace(/Component$/, "")
        )}-angular`
      : `ui-${componentId}-angular`;
    const attrs = Object.entries(props)
      .map(([key, value]) =>
        typeof value === "boolean" ? `[${key}]="${value}"` : `[${key}]="'${value}'"`
      )
      .join(" ");
    return `<${tag}${attrs ? ` ${attrs}` : ""}></${tag}>`;
  }

  const tag = bindings?.wc?.tagName ?? `ui-${componentId}`;
  const attrs = Object.entries(props)
    .map(([key, value]) =>
      typeof value === "boolean" ? `${key}="${value}"` : `${key}="${value}"`
    )
    .join(" ");
  return `<${tag}${attrs ? ` ${attrs}` : ""}></${tag}>`;
}

function buildPreviewUrl(
  framework: Framework,
  story: SelectedStory,
  props: StoryProps
): string {
  const params = new URLSearchParams({
    component: story.component,
    story: story.storyName,
    props: JSON.stringify(props),
    renderers: JSON.stringify(story.renderers ?? {}),
  });

  return `${rendererUrls[framework]}?${params.toString()}`;
}

function mergeProps(base: StoryProps, partial?: Partial<StoryProps>): StoryProps {
  const merged: StoryProps = { ...base };
  for (const [key, value] of Object.entries(partial ?? {})) {
    if (typeof value !== "undefined") {
      merged[key] = value;
    }
  }
  return merged;
}

function MarkdownBlock({ content }: { content: string }) {
  const html = useMemo(() => marked.parse(content) as string, [content]);
  return (
    <div
      className="prose prose-sm max-w-none text-slate-700"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function DocsPage({ framework, story }: DocsPageProps) {
  if (!story) {
    return (
      <section className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed border-slate-300 bg-[color:var(--bridge-ui-surface)] p-8">
        <p className="text-sm text-slate-500">Select a story to view docs.</p>
      </section>
    );
  }

  const docsExamples =
    story.docs?.examples?.map((example) => ({
      ...example,
      props: mergeProps(story.props, example.props),
    })) ?? [];

  const usage = story.docs?.usage;

  return (
    <section className="h-full overflow-auto rounded-md border border-slate-200 bg-[color:var(--bridge-ui-surface)] p-4">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-slate-900">{story.componentTitle}</h1>
        {story.docs?.description ? (
          <MarkdownBlock content={story.docs.description} />
        ) : (
          <p className="mt-1 text-sm text-slate-500">No description provided.</p>
        )}
      </div>

      <div className="mb-5 overflow-hidden rounded-md border border-slate-200">
        <div className="grid grid-cols-[1fr_120px_160px] bg-slate-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          <span>Name</span>
          <span>Type</span>
          <span>Default</span>
        </div>
        {Object.entries(story.propsConfig).map(([name, config]) => (
          <div
            key={name}
            className="grid grid-cols-[1fr_120px_160px] border-t border-slate-100 px-2 py-1.5 text-xs text-slate-700"
          >
            <span className="font-medium">{name}</span>
            <span>{config.type}</span>
            <span>{String(config.default)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {(docsExamples.length > 0 ? docsExamples : [{ title: story.storyName, props: story.props }]).map(
          (example) => {
            const exampleProps = example.props ?? story.props;
            const previewUrl = buildPreviewUrl(framework, story, exampleProps);
            return (
              <article key={example.title} className="rounded-md border border-slate-200 bg-white p-3">
                <h3 className="mb-1 text-sm font-semibold text-slate-900">{example.title}</h3>
                {example.description ? (
                  <p className="mb-2 text-xs text-slate-500">{example.description}</p>
                ) : null}
                <div className="mb-2 h-48 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                  <iframe
                    title={`${story.component}-${example.title}`}
                    src={previewUrl}
                    className="h-full w-full border-0"
                  />
                </div>
                <pre className="overflow-auto rounded-md bg-slate-900 p-2 text-xs text-slate-100">
                  <code>{generateCode(framework, story.component, exampleProps, story.renderers)}</code>
                </pre>
              </article>
            );
          }
        )}
      </div>

      <div className="mt-5 rounded-md border border-slate-200 bg-white p-3">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Usage</h3>
        <div className="space-y-2">
          <div>
            <p className="mb-1 text-xs font-medium text-slate-600">React</p>
            <pre className="overflow-auto rounded bg-slate-900 p-2 text-xs text-slate-100">
              <code>{usage?.react ?? generateCode("react", story.component, story.props, story.renderers)}</code>
            </pre>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-600">Angular</p>
            <pre className="overflow-auto rounded bg-slate-900 p-2 text-xs text-slate-100">
              <code>{usage?.angular ?? generateCode("angular", story.component, story.props, story.renderers)}</code>
            </pre>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-slate-600">Web Components</p>
            <pre className="overflow-auto rounded bg-slate-900 p-2 text-xs text-slate-100">
              <code>{usage?.wc ?? generateCode("wc", story.component, story.props, story.renderers)}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
