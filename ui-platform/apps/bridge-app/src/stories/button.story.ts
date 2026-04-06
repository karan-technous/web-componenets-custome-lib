import type { StoryDefinition } from "../state/storyTypes";

const buttonStory: StoryDefinition = {
  id: "button",
  title: "Button",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "UiButton", childrenProp: "label" },
    angular: { exportName: "ButtonComponent", projectedProp: "label" },
    wc: { tagName: "ui-button", textProp: "label" },
  },
  props: {
    label: {
      type: "string",
      default: "Click Me",
      description: "Button text",
    },
    variant: {
      type: "select",
      options: ["primary", "secondary", "outline"],
      default: "primary",
      description: "Visual style variant",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disable interaction",
    },
  },
  stories: {
    Primary: {
      props: {
        label: "Click Me",
        variant: "primary",
      },
    },
    Secondary: {
      props: {
        label: "Cancel",
        variant: "secondary",
      },
    },
    Demo: {
      props: {
        label: "hello",
        variant: "primary",
        disabled: true,
      },
    },
  },
  docs: {
    description:
      "Buttons trigger user actions.\n\n- Use `primary` for the main action in a view.\n- Use `secondary` for alternative actions.\n- Use `outline` for subtle or less-prominent actions.\n\nKeep labels short and action-oriented (for example: `Save`, `Cancel`, `Continue`).",
    examples: [
      {
        title: "Primary Button",
        description: "Default call-to-action for a flow.",
        props: { variant: "primary", label: "Primary", disabled: false },
      },
      {
        title: "Secondary Button",
        description: "Alternative action with lower visual emphasis.",
        props: { variant: "secondary", label: "Secondary", disabled: false },
      },
      {
        title: "Disabled Button",
        description: "Use when an action is unavailable until prerequisites are met.",
        props: { variant: "primary", label: "Submit", disabled: true },
      },
    ],
    usage: {
      react: `import { UiButton } from "@karan9186/react";

<UiButton variant="primary">Save</UiButton>`,
      angular: `<ui-button-angular [variant]="'primary'">Save</ui-button-angular>`,
      wc: `<ui-button variant="primary">Save</ui-button>`,
    },
  },
};

export default buttonStory;
