import type { StoryDefinition } from "../state/storyTypes";

const breadcrumbStory: StoryDefinition = {
  id: "breadcrumb",
  title: "Breadcrumb",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "Breadcrumb", childrenProp: "children" },
    angular: { exportName: "UiBreadcrumbComponent", projectedProp: "children" },
    wc: { tagName: "ui-breadcrumb", textProp: "children" },
  },
  props: {
    items: {
      type: "string",
      default: '[{"value":"home","label":"Home"},{"value":"products","label":"Products"},{"value":"electronics","label":"Electronics"},{"value":"mobile","label":"Mobile","active":true}]',
      description: "Breadcrumb items (JSON string array)",
    },
    separator: {
      type: "select",
      options: ["slash", "chevron", "arrow"],
      default: "slash",
      description: "Separator between items",
    },
    maxItems: {
      type: "string",
      default: "",
      description: "Maximum number of items before collapsing",
    },
    itemsBeforeCollapse: {
      type: "string",
      default: "1",
      description: "Number of items to show before collapse indicator",
    },
    itemsAfterCollapse: {
      type: "string",
      default: "1",
      description: "Number of items to show after collapse indicator",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Whether the breadcrumb is disabled",
    },
  },
  stories: {
    Default: {
      props: {
        separator: "slash",
      },
    },
    ChevronSeparator: {
      props: {
        separator: "chevron",
      },
    },
    ArrowSeparator: {
      props: {
        separator: "arrow",
      },
    },
    Collapsed: {
      props: {
        maxItems: "2",
        itemsBeforeCollapse: "1",
        itemsAfterCollapse: "1",
      },
    },
    Disabled: {
      props: {
        disabled: true,
      },
    },
  },
};

export default breadcrumbStory;
