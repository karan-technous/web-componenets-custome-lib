import { BookOpen, Copy, ExternalLink, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { Framework } from "../state/frameworkStore";
import { storyCatalog } from "../state/storyStore";
import type {
  PropConfig,
  SelectedStory,
  StoryDocsExample,
  StoryProps,
  StoryRendererBindings,
  StoryVariant,
} from "../state/storyTypes";

interface DocsPageProps {
  framework: Framework;
  story: SelectedStory | null;
  onOpenStory: (storyName: string) => void;
  appearance: "dark" | "light";
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
  bindings?: StoryRendererBindings,
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
      typeof value === "boolean" ? `${key}={${value}}` : `${key}="${value}"`,
    )
    .join(" ");
}

function generateCode(
  framework: Framework,
  componentId: string,
  props: StoryProps,
  bindings?: StoryRendererBindings,
): string {
  if (framework === "react") {
    const componentName = getFrameworkCodeComponentName(
      framework,
      componentId,
      bindings,
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
          bindings.angular.exportName.replace(/Component$/, ""),
        )}-angular`
      : `ui-${componentId}-angular`;
    const attrs = Object.entries(props)
      .map(([key, value]) =>
        typeof value === "boolean"
          ? `[${key}]="${value}"`
          : `[${key}]="'${value}'"`,
      )
      .join(" ");
    return `<${tag}${attrs ? ` ${attrs}` : ""}></${tag}>`;
  }

  const tag = bindings?.wc?.tagName ?? `ui-${componentId}`;
  const attrs = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  return `<${tag}${attrs ? ` ${attrs}` : ""}></${tag}>`;
}

function buildPreviewUrl(
  framework: Framework,
  story: SelectedStory,
  props: StoryProps,
  appearance: "dark" | "light",
): string {
  const params = new URLSearchParams({
    component: story.component,
    story: story.storyName,
    props: JSON.stringify(props),
    renderers: JSON.stringify(story.renderers ?? {}),
    appearance,
  });

  return `${rendererUrls[framework]}?${params.toString()}`;
}

function mergeProps(
  base: StoryProps,
  partial?: Partial<StoryProps>,
): StoryProps {
  const merged: StoryProps = { ...base };
  for (const [key, value] of Object.entries(partial ?? {})) {
    if (typeof value !== "undefined") {
      merged[key] = value;
    }
  }
  return merged;
}

function parseDescription(description?: string): {
  intro: string;
  bullets: string[];
  closing: string;
} {
  if (!description) {
    return {
      intro: "",
      bullets: [],
      closing: "",
    };
  }

  const lines = description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const bullets = lines
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2));
  const prose = lines.filter((line) => !line.startsWith("- "));

  return {
    intro: prose[0] ?? "",
    bullets,
    closing: prose.slice(1).join(" "),
  };
}

function stringifyPropType(name: string, config: PropConfig): string {
  if (config.type === "boolean") {
    return "boolean";
  }

  if (config.type === "select" && config.options?.length) {
    return config.options.map((option) => `'${option}'`).join(" | ");
  }

  if (name.toLowerCase().includes("click")) {
    return "() => void";
  }

  return "string";
}

function formatDefaultValue(value: string | boolean): string {
  if (typeof value === "boolean") {
    return String(value);
  }

  return value ? `'${value}'` : "-";
}

function formatInlineCode(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={`${part}-${index}`}
        className="rounded-md border border-[color:var(--docs-accent-border)] bg-[color:var(--docs-inline-code-bg)] px-1.5 py-0.5 font-mono text-[12px] font-semibold text-[color:var(--docs-token-name)]"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

function renderHighlightedCode(code: string): ReactNode[] {
  return code.split("\n").map((line, lineIndex) => {
    if (line.trim().startsWith("import ")) {
      const match = line.match(
        /^(import)(\s+\{?\s*[^}]+\}?\s+from\s+)('.*?'|".*?")(;?)$/,
      );
      if (match) {
        return (
          <div key={`line-${lineIndex}`}>
            <span className="text-[color:var(--docs-token-type)]">
              {match[1]}
            </span>
            <span className="text-[color:var(--docs-code-text)]">
              {match[2]}
            </span>
            <span className="text-[color:var(--docs-accent)]">{match[3]}</span>
            <span className="text-[color:var(--bride-text-muted)]">
              {match[4]}
            </span>
          </div>
        );
      }
    }

    if (line.includes("<") && line.includes(">")) {
      const parts: ReactNode[] = [];
      const pattern = /(<\/?)([\w-]+)|([\w-]+)(=)|(".*?")|(\{.*?\})|(\/?>)/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = pattern.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(
            <span
              key={`text-${lineIndex}-${lastIndex}`}
              className="text-[color:var(--docs-code-text)]"
            >
              {line.slice(lastIndex, match.index)}
            </span>,
          );
        }

        if (match[1] && match[2]) {
          parts.push(
            <span key={`tag-${lineIndex}-${match.index}`}>
              <span className="text-[color:var(--docs-accent-strong)]">
                {match[1]}
              </span>
              <span className="text-[color:var(--docs-accent-strong)]">
                {match[2]}
              </span>
            </span>,
          );
        } else if (match[3] && match[4]) {
          parts.push(
            <span key={`attr-${lineIndex}-${match.index}`}>
              <span className="text-[color:var(--bride-text-muted)]">
                {match[3]}
              </span>
              <span className="text-[color:var(--docs-code-text)]">
                {match[4]}
              </span>
            </span>,
          );
        } else if (match[5]) {
          parts.push(
            <span
              key={`string-${lineIndex}-${match.index}`}
              className="text-[color:var(--docs-accent)]"
            >
              {match[5]}
            </span>,
          );
        } else if (match[6]) {
          parts.push(
            <span
              key={`expr-${lineIndex}-${match.index}`}
              className="text-[color:var(--docs-token-default)]"
            >
              {match[6]}
            </span>,
          );
        } else if (match[7]) {
          parts.push(
            <span
              key={`close-${lineIndex}-${match.index}`}
              className="text-[color:var(--docs-accent-strong)]"
            >
              {match[7]}
            </span>,
          );
        }

        lastIndex = pattern.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(
          <span
            key={`tail-${lineIndex}-${lastIndex}`}
            className="text-[color:var(--docs-code-text)]"
          >
            {line.slice(lastIndex)}
          </span>,
        );
      }

      return <div key={`line-${lineIndex}`}>{parts}</div>;
    }

    return (
      <div
        key={`line-${lineIndex}`}
        className="text-[color:var(--docs-code-text)]"
      >
        {line || " "}
      </div>
    );
  });
}

function CodePanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[18px] border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-bg-elevated)] shadow-[inset_0_1px_0_var(--bride-border-subtle)]">
      <div className="flex items-center justify-between border-b border-[color:var(--bride-border-subtle)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full border border-[#6b232c] bg-[#a33b43]" />
            <span className="h-2.5 w-2.5 rounded-full border border-[#725818] bg-[#a68525]" />
            <span className="h-2.5 w-2.5 rounded-full border border-[#24563a] bg-[#3b7a52]" />
          </div>
          <span className="rounded-full border border-[color:var(--docs-accent-border)] bg-[color:var(--docs-code-chip-bg)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--docs-accent)]">
            {"</>"} Code
          </span>
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-bg)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--bride-text-muted)] transition hover:border-[color:var(--docs-accent-border)] hover:text-[color:var(--bride-text)]"
        >
          <Copy size={14} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-auto bg-[color:var(--bride-bg)] px-5 py-6 text-[12px] leading-8 text-[color:var(--docs-code-text)]">
        <code className="font-mono">{renderHighlightedCode(code)}</code>
      </pre>
    </div>
  );
}

function StoryPreviewCard({
  framework,
  story,
  example,
  onOpenStory,
  appearance,
}: {
  framework: Framework;
  story: SelectedStory;
  example: StoryDocsExample & { props: StoryProps };
  onOpenStory: (storyName: string) => void;
  appearance: "dark" | "light";
}) {
  const previewUrl = buildPreviewUrl(framework, story, example.props, appearance);
  const code = generateCode(
    framework,
    story.component,
    example.props,
    story.renderers,
  );

  return (
    <article className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-[18px] font-semibold leading-none tracking-[-0.03em] text-[color:var(--docs-heading)]">
          {example.title}
        </h3>
        <button
          type="button"
          onClick={() => onOpenStory(example.storyName ?? example.title)}
          className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--docs-accent-border)] bg-[color:var(--docs-accent-surface)] px-2 py-1 text-xs font-semibold text-[color:var(--docs-accent-strong)] transition hover:border-[color:var(--docs-accent-strong)] hover:bg-[color:var(--docs-accent-surface-strong)]"
        >
          <span className="h-2 w-2 rounded-full bg-[color:var(--docs-accent)]" />
          Open Story
        </button>
      </div>

      {example.description ? (
        <p className="max-w-3xl text-[15px] leading-7 text-[color:var(--docs-body)]">
          {example.description}
        </p>
      ) : null}

      <div className="relative overflow-hidden rounded-[20px] border border-[color:var(--docs-preview-border)] px-4 py-5 shadow-[inset_0_1px_0_var(--bride-border-subtle)] sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_50%,var(--docs-accent-surface),transparent_26%)] opacity-28" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,var(--docs-accent-surface),transparent_20%)] opacity-16" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--bride-text-muted)_1px,transparent_1px),linear-gradient(90deg,var(--bride-text-muted)_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.08]" />
        <iframe
          title={`${story.component}-${example.title}`}
          src={previewUrl}
          className="relative z-10 h-[72px] w-full min-w-0 border-0 bg-transparent"
        />
      </div>

      <CodePanel code={code} />
    </article>
  );
}

export function DocsPage({ framework, story, onOpenStory, appearance }: DocsPageProps) {
  const [activeUsage, setActiveUsage] = useState<Framework>(framework);

  useEffect(() => {
    setActiveUsage(framework);
  }, [framework]);

  if (!story) {
    return (
      <section className="preview flex min-h-0 flex-1 items-center justify-center">
        <p className="text-secondary text-sm">Select a story to view docs.</p>
      </section>
    );
  }

  const entry = storyCatalog.find(
    (item) => item.definition.id === story.storyId,
  );
  const variants: StoryVariant[] = entry?.variants ?? [];
  const docsExamples =
    story.docs?.examples?.map((example) => ({
      ...example,
      props: mergeProps(story.props, example.props),
    })) ?? [];
  const examples =
    docsExamples.length > 0
      ? docsExamples
      : [{ title: story.storyName, props: story.props, description: "" }];
  const descriptionParts = parseDescription(story.docs?.description);
  const usage =
    story.docs?.usage?.[activeUsage] ??
    generateCode(activeUsage, story.component, story.props, story.renderers);
  const apiRows =
    story.docs?.api ??
    Object.entries(story.propsConfig).map(([name, config], index) => ({
      name,
      type: stringifyPropType(name, config),
      defaultValue: formatDefaultValue(config.default),
      description: config.description ?? "No description provided.",
      required: index === 0,
    }));

  return (
    <section className="h-full overflow-auto bg-[color:var(--bride-bg)]">
      <div className="mx-auto flex w-full max-w-[920px] flex-col gap-8 px-4 py-5 sm:px-6 sm:py-6 lg:gap-10 lg:px-8 lg:py-8">
        <header className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--docs-accent-border)] bg-[color:var(--docs-code-chip-bg)] text-[color:var(--docs-accent)] shadow-[0_0_18px_var(--docs-accent-glow)]">
              <BookOpen size={20} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[color:var(--docs-heading)]">
                {story.componentTitle}
              </h1>
              <span className="rounded-full border border-[color:var(--docs-accent-border)] bg-[color:var(--docs-accent-surface)] px-3 py-1.5 text-[13px] font-semibold text-[color:var(--docs-accent)]">
                Stable
              </span>
            </div>
          </div>

          {descriptionParts.intro ? (
            <p className="max-w-[720px] text-[14px] leading-8 text-[color:var(--docs-body)]">
              {descriptionParts.intro}
            </p>
          ) : null}
          {descriptionParts.bullets.length > 0 || descriptionParts.closing ? (
            <div className="rounded-[20px] border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-bg-elevated)] px-5 py-5 shadow-[inset_0_1px_0_var(--bride-border-subtle)]">
              <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--docs-muted)]">
                <Sparkles
                  size={13}
                  className="text-[color:var(--docs-accent)]"
                />
                Guidelines
              </div>
              <div className="space-y-3">
                {descriptionParts.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="flex items-start gap-3 text-[14px] leading-7 text-[color:var(--docs-body)]"
                  >
                    <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-[color:var(--docs-accent)]" />
                    <p>{formatInlineCode(bullet)}</p>
                  </div>
                ))}
                {descriptionParts.closing ? (
                  <div className="flex items-start gap-3 text-[14px] leading-7 text-[color:var(--docs-body)]">
                    <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-[color:var(--docs-accent)]" />
                    <p>{formatInlineCode(descriptionParts.closing)}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </header>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--docs-muted)]">
              Props Api
            </span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          <div className="overflow-hidden rounded-[20px] border border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-bg-elevated)] shadow-[inset_0_1px_0_var(--bride-border-subtle)]">
            <div className="hidden grid-cols-[1.15fr_2fr_0.85fr_1.7fr] border-b border-[color:var(--bride-border-subtle)] bg-white/[0.02] px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[color:var(--docs-table-head)] md:grid">
              <span>Name</span>
              <span>Type</span>
              <span>Default</span>
              <span>Description</span>
            </div>
            {apiRows.map((row, index) => (
              <div
                key={row.name}
                className={`grid gap-2 px-4 py-4 text-[13px] text-white/78 md:grid-cols-[1.15fr_2fr_0.85fr_1.7fr] ${
                  index > 0 ? "border-t border-white/6" : ""
                }`}
              >
                <div className="font-mono font-semibold text-[color:var(--docs-token-name)]">
                  {row.name}
                  {row.required ? (
                    <span className="ml-1 text-[color:var(--docs-required)]">
                      *
                    </span>
                  ) : null}
                </div>
                <div className="font-mono text-[color:var(--docs-token-type)] md:before:hidden before:mr-2 before:font-[var(--bride-font-ui)] before:text-[11px] before:font-semibold before:uppercase before:tracking-[0.1em] before:text-[color:var(--docs-muted)] before:content-['Type']">
                  {row.type}
                </div>
                <div className="font-mono text-[color:var(--docs-token-default)] md:before:hidden before:mr-2 before:font-[var(--bride-font-ui)] before:text-[11px] before:font-semibold before:uppercase before:tracking-[0.1em] before:text-[color:var(--docs-muted)] before:content-['Default']">
                  {row.defaultValue}
                </div>
                <div className="text-[color:var(--docs-table-desc)] md:before:hidden before:mr-2 before:font-[var(--bride-font-ui)] before:text-[11px] before:font-semibold before:uppercase before:tracking-[0.1em] before:text-[color:var(--docs-muted)] before:content-['Description']">
                  {row.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-7">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--docs-muted)]">
              Stories
            </span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          {examples.map((example) => (
            <StoryPreviewCard
              appearance={appearance}
              key={example.title}
              framework={framework}
              story={story}
              example={example}
              onOpenStory={(storyName) => {
                const target =
                  variants.find((variant) => variant.name === storyName)
                    ?.name ?? storyName;
                onOpenStory(target);
              }}
            />
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-px w-16 bg-[color:var(--bride-border-subtle)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--docs-muted)]">
                Usage
              </span>
            </div>
            <a
              href={buildPreviewUrl(framework, story, story.props, appearance)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[13px] text-[color:var(--bride-text-muted)] transition hover:text-[color:var(--bride-text)]"
            >
              <ExternalLink size={14} />
              Open in full
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            {(["react", "angular", "wc"] as Framework[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveUsage(tab)}
                className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition ${
                  activeUsage === tab
                    ? "border-[color:var(--docs-accent-border)] bg-[color:var(--docs-code-chip-bg)] text-[color:var(--docs-accent)]"
                    : "border-[color:var(--bride-border-subtle)] bg-[color:var(--bride-bg-elevated)] text-[color:var(--bride-text-muted)] hover:text-[color:var(--bride-text)]"
                }`}
              >
                {tab === "wc"
                  ? "Web Components"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <CodePanel code={usage} />
        </section>
      </div>
    </section>
  );
}
