import type { Framework } from "./frameworkStore";
import type {
  SelectedStory,
  StoryDefinition,
  StoryEntry,
  StoryProps,
  StoryVariant,
} from "./storyTypes";

const modules = import.meta.glob("../stories/*.story.ts", { eager: true }) as Record<
  string,
  { default: StoryDefinition }
>;

function getDefaultProps(definition: StoryDefinition): StoryProps {
  const defaults: StoryProps = {};
  for (const [key, config] of Object.entries(definition.props)) {
    defaults[key] = config.default;
  }
  return defaults;
}

function normalizeDefinition(definition: StoryDefinition): StoryEntry {
  const defaultProps = getDefaultProps(definition);

  const variants: StoryVariant[] =
    definition.stories && Object.keys(definition.stories).length > 0
      ? Object.entries(definition.stories).map(([name, story]) => {
          const merged: StoryProps = { ...defaultProps };
          for (const [key, value] of Object.entries(story.props ?? {})) {
            if (typeof value !== "undefined") {
              merged[key] = value;
            }
          }
          return { name, props: merged, slots: story.slots };
        })
      : [{ name: "Default", props: defaultProps }];

  return { definition, variants };
}

function sortByTitle(items: StoryEntry[]): StoryEntry[] {
  return [...items].sort((a, b) =>
    a.definition.title.localeCompare(b.definition.title)
  );
}

export const storyCatalog: StoryEntry[] = sortByTitle(
  Object.values(modules)
    .map((mod) => mod.default)
    .filter(Boolean)
    .map(normalizeDefinition)
);

export function getStoriesForFramework(framework: Framework): StoryEntry[] {
  return storyCatalog.filter((entry) =>
    entry.definition.framework.includes(framework)
  );
}

function toSelectedStory(entry: StoryEntry, variant: StoryVariant): SelectedStory {
  return {
    storyId: entry.definition.id,
    componentTitle: entry.definition.title,
    storyName: variant.name,
    component: entry.definition.id,
    framework: [...entry.definition.framework],
    props: { ...variant.props },
    slots: variant.slots,
    propsConfig: entry.definition.props,
    renderers: entry.definition.renderers,
    docs: entry.definition.docs,
  };
}

export function getInitialSelectedStory(
  framework?: Framework
): SelectedStory | null {
  const pool = framework ? getStoriesForFramework(framework) : storyCatalog;
  if (pool.length === 0) {
    return null;
  }

  const first = pool[0];
  const variant = first.variants[0];
  if (!variant) {
    return null;
  }

  return toSelectedStory(first, variant);
}

export function resolveStorySelection(
  storyId: string,
  storyName: string
): SelectedStory | null {
  const entry = storyCatalog.find((item) => item.definition.id === storyId);
  if (!entry || entry.variants.length === 0) {
    return null;
  }

  const variant =
    entry.variants.find((item) => item.name === storyName) ?? entry.variants[0];
  return toSelectedStory(entry, variant);
}
