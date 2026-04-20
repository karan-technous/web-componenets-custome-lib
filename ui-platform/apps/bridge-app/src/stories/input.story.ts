import type { StoryDefinition } from "../state/storyTypes";

const inputStory: StoryDefinition = {
  id: "input",
  title: "Input",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "UiInput" },
    angular: { exportName: "InputComponent" },
    wc: { tagName: "ui-input" },
  },
  props: {
    placeholder: {
      type: "string",
      default: "Type your message",
      description: "Placeholder text",
    },
    value: {
      type: "string",
      default: "",
      description: "Current value",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disable input",
    },
    icon: {
      type: "string",
      default: "",
      description: "Lucide icon name shown inside input",
    },
    iconOnly: {
      type: "boolean",
      default: false,
      description: "Show only icon button and hide text field",
    },
    rounded: {
      type: "select",
      options: ["xs", "sm", "md", "xl"],
      default: "md",
      description: "Rounded corners for the input",
    },
  },
  stories: {
    Default: {
      props: {
        placeholder: "Type your message",
        value: "",
      },
    },
    Filled: {
      props: {
        placeholder: "Search",
        value: "Design System",
      },
    },
    Disabled: {
      props: {
        placeholder: "Search",
        value: "Design System",
        disabled: true,
      },
    },
    "With Icon": {
      props: {
        placeholder: "Search",
        value: "",
        icon: "Search",
      },
    },
    "Icon Only": {
      props: {
        icon: "Calendar",
        iconOnly: true,
      },
    },
    "Rounded": {
      props: {
        placeholder: "Calendar",
        value: "Design System",
        rounded: "md",
      },
    },
  },
  docs: {
    description:
      "Input captures short text values. Keep placeholders concise and avoid using placeholder as a label replacement.",
    examples: [
      {
        title: "Default Input",
        props: { placeholder: "Type your message", value: "", disabled: false },
      },
      {
        title: "Disabled Input",
        props: { placeholder: "Search", value: "Read only", disabled: true },
      },
      {
        title: "Input With Icon",
        props: { placeholder: "Search...", value: "", icon: "Search", disabled: false },
      },
    ],
    usage: {
      react: `<UiInput placeholder="Search" icon="Search" />`,
      angular: `<ui-input-angular [placeholder]="'Search'" [icon]="'Search'"></ui-input-angular>`,
      wc: `<ui-input placeholder="Search" icon="Search"></ui-input>`,
    },
  },
};

export default inputStory;
