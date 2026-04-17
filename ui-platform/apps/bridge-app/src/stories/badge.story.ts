import type { StoryDefinition } from "../state/storyTypes";

const badgeStory: StoryDefinition = {
  id: "badge",
  title: "Badge",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "Badge", childrenProp: "children" },
    angular: { exportName: "BadgeComponent", projectedProp: "children" },
    wc: { tagName: "ui-badge", textProp: "children" },
  },
  props: {
    children: {
      type: "string",
      default: "Badge",
      description: "Badge content/text",
    },
    variant: {
      type: "select",
      options: ["solid", "soft", "outline"],
      default: "solid",
      description: "Visual style variant of the badge",
    },
    color: {
      type: "select",
      options: ["primary", "success", "warning", "danger", "neutral"],
      default: "primary",
      description: "Color theme of the badge",
    },
    size: {
      type: "select",
      options: ["sm", "md", "lg"],
      default: "md",
      description: "Size of the badge",
    },
    shape: {
      type: "select",
      options: ["rounded", "pill"],
      default: "rounded",
      description: "Shape of the badge",
    },
    dot: {
      type: "boolean",
      default: false,
      description: "Show as a dot indicator (status indicator)",
    },
    removable: {
      type: "boolean",
      default: false,
      description: "Show remove button",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disable the badge",
    },
  },
  stories: {
    Primary: {
      props: {
        variant: "solid",
        color: "primary",
      },
    },
    Success: {
      props: {
        variant: "solid",
        color: "success",
      },
    },
    Warning: {
      props: {
        variant: "solid",
        color: "warning",
      },
    },
    Danger: {
      props: {
        variant: "solid",
        color: "danger",
      },
    },
    Neutral: {
      props: {
        variant: "solid",
        color: "neutral",
      },
    },
    Soft: {
      props: {
        variant: "soft",
        color: "primary",
      },
    },
    Outline: {
      props: {
        variant: "outline",
        color: "primary",
      },
    },
    Small: {
      props: {
        size: "sm",
      },
    },
    Large: {
      props: {
        size: "lg",
      },
    },
    Pill: {
      props: {
        shape: "pill",
      },
    },
    Dot: {
      props: {
        dot: true,
        color: "primary",
      },
    },
    Removable: {
      props: {
        removable: true,
      },
    },
    Disabled: {
      props: {
        disabled: true,
      },
    },
  },
};

export default badgeStory;
