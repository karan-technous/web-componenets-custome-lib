import * as buttonStories from '../stories/button.stories';
import * as inputStories from '../stories/input.stories';

export type StoryProps = Record<string, string | boolean>;

export interface StoryMeta {
  title: string;
  component: string;
}

export interface StoryVariant {
  name: string;
  props: StoryProps;
}

export interface StoryGroup {
  meta: StoryMeta;
  stories: StoryVariant[];
}

export interface SelectedStory {
  componentTitle: string;
  storyName: string;
  component: string;
  props: StoryProps;
}

const modules = [buttonStories, inputStories];

function normalizeStories(moduleDef: Record<string, unknown>): StoryGroup {
  const meta = moduleDef.default as StoryMeta;

  const stories = Object.entries(moduleDef)
    .filter(([name]) => name !== 'default')
    .map(([name, value]) => {
      const story = value as { props?: StoryProps };
      return {
        name,
        props: story.props ?? {}
      };
    });

  return { meta, stories };
}

export const storyCatalog: StoryGroup[] = modules.map((mod) =>
  normalizeStories(mod as unknown as Record<string, unknown>)
);

export function getInitialSelectedStory(): SelectedStory | null {
  if (storyCatalog.length === 0 || storyCatalog[0].stories.length === 0) {
    return null;
  }

  const firstGroup = storyCatalog[0];
  const firstStory = firstGroup.stories[0];

  return {
    componentTitle: firstGroup.meta.title,
    storyName: firstStory.name,
    component: firstGroup.meta.component,
    props: { ...firstStory.props }
  };
}

export function resolveStorySelection(componentTitle: string, storyName: string): SelectedStory | null {
  if (storyCatalog.length === 0) {
    return null;
  }

  const group = storyCatalog.find((entry) => entry.meta.title === componentTitle) ?? storyCatalog[0];

  if (group.stories.length === 0) {
    return null;
  }

  const story = group.stories.find((entry) => entry.name === storyName) ?? group.stories[0];

  return {
    componentTitle: group.meta.title,
    storyName: story.name,
    component: group.meta.component,
    props: { ...story.props }
  };
}
