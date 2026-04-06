import type { Framework } from "./frameworkStore";

export type StoryPropValue = string | boolean;
export type StoryProps = Record<string, StoryPropValue>;

export type ControlType = "string" | "select" | "boolean";

export interface PropConfig {
  type: ControlType;
  default: StoryPropValue;
  description?: string;
  options?: string[];
}

export interface StoryVariantConfig {
  props?: Partial<StoryProps>;
}

export interface StoryDocsExample {
  title: string;
  props?: Partial<StoryProps>;
  description?: string;
}

export interface StoryDocsUsage {
  react?: string;
  angular?: string;
  wc?: string;
}

export interface StoryDocs {
  description?: string;
  examples?: StoryDocsExample[];
  usage?: StoryDocsUsage;
}

export interface ReactRendererBinding {
  exportName?: string;
  childrenProp?: string;
}

export interface AngularRendererBinding {
  exportName?: string;
  projectedProp?: string;
}

export interface WcRendererBinding {
  tagName?: string;
  textProp?: string;
}

export interface StoryRendererBindings {
  react?: ReactRendererBinding;
  angular?: AngularRendererBinding;
  wc?: WcRendererBinding;
}

export interface StoryDefinition {
  id: string;
  title: string;
  framework: Framework[];
  props: Record<string, PropConfig>;
  renderers?: StoryRendererBindings;
  stories?: Record<string, StoryVariantConfig>;
  docs?: StoryDocs;
}

export interface StoryVariant {
  name: string;
  props: StoryProps;
}

export interface StoryEntry {
  definition: StoryDefinition;
  variants: StoryVariant[];
}

export interface SelectedStory {
  storyId: string;
  componentTitle: string;
  storyName: string;
  component: string;
  framework: Framework[];
  props: StoryProps;
  propsConfig: Record<string, PropConfig>;
  renderers?: StoryRendererBindings;
  docs?: StoryDocs;
}
