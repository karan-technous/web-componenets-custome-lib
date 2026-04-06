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
    ],
    usage: {
      react: `<UiInput placeholder="Search" value="" />`,
      angular: `<ui-input-angular [placeholder]="'Search'"></ui-input-angular>`,
      wc: `<ui-input placeholder="Search"></ui-input>`,
    },
  },
};

export default inputStory;
