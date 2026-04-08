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
      default: "",
      description: "Text content of the button",
    },
    variant: {
      type: "select",
      options: ["primary", "secondary", "outline", "ghost"],
      default: "primary",
      description: "Visual style variant",
    },
    size: {
      type: "select",
      options: ["sm", "md", "lg"],
      default: "md",
      description: "Button size preset",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disables interaction and dims the button",
    },
    loading: {
      type: "boolean",
      default: false,
      description: "Shows a loading spinner alongside text",
    },
  },
  stories: {
    Primary: {
      props: {
        label: "Get Started",
        variant: "primary",
      },
    },
    Secondary: {
      props: {
        label: "Learn More",
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
    Loading: {
      props: {
        label: "hello",
        variant: "primary",
        disabled: false,
        loading: true,
      },
    },
    Outline: {
      props: {
        label: "View Details",
        variant: "outline",
        disabled: false,
      },
    },
  },
  docs: {
    description:
      "Buttons trigger user actions and enable interaction. They communicate actionability and intent throughout the interface.\n\n- Use `primary` for the main action in a view. Use only one per screen.\n- Use `secondary` for supporting or alternative actions.\n- Use `outline` for neutral or less-prominent choices.\n\nKeep labels short and action-oriented (e.g. Save, Cancel, Continue).",
    examples: [
      {
        title: "Primary",
        storyName: "Primary",
        description:
          "The main call-to-action. Use for the single most important action on screen.",
        props: { variant: "primary", label: "Get Started", disabled: false },
      },
      {
        title: "Secondary",
        storyName: "Secondary",
        description:
          "Supporting action with lower emphasis. Pairs well alongside a primary button.",
        props: { variant: "secondary", label: "Learn More", disabled: false },
      },
      {
        title: "Outline",
        storyName: "Outline",
        description:
          "Stroke-only button. Best for neutral or contextual actions on any background.",
        props: { variant: "outline", label: "View Details", disabled: false },
      },
    ],
    usage: {
      react: `import { UiButton } from "@karan9186/react";

<UiButton variant="primary">Get Started</UiButton>`,
      angular: `<ui-button-angular [variant]="'primary'">Get Started</ui-button-angular>`,
      wc: `<ui-button variant="primary">Get Started</ui-button>`,
    },
    api: [
      {
        name: "label",
        type: "string",
        defaultValue: "-",
        description: "Text content of the button",
        required: true,
      },
      {
        name: "variant",
        type: "'primary' | 'secondary' | 'outline' | 'ghost'",
        defaultValue: "'primary'",
        description: "Visual style variant",
      },
      {
        name: "size",
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: "Button size preset",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables interaction and dims the button",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description: "Shows a loading spinner alongside text",
      },
      {
        name: "onClick",
        type: "() => void",
        defaultValue: "-",
        description: "Callback fired on user click",
      },
    ],
  },
};

export default buttonStory;
