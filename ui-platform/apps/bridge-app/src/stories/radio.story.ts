import type { StoryDefinition } from "../state/storyTypes";

const radioStory: StoryDefinition = {
  id: "radio",
  title: "Radio",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "Radio" },
    angular: { exportName: "UiRadioComponent" },
    wc: { tagName: "ui-radio" },
  },
  props: {
    value: {
      type: "string",
      default: "",
      description: "Unique value for the radio",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disable interaction",
    },
    required: {
      type: "boolean",
      default: false,
      description: "Required field indicator",
    },
    name: {
      type: "string",
      default: "",
      description: "Form group name",
    },
    error: {
      type: "boolean",
      default: false,
      description: "Error state",
    },
    size: {
      type: "select",
      options: ["sm", "md", "lg"],
      default: "md",
      description: "Radio size",
    },
    label: {
      type: "string",
      default: "",
      description: "Radio label text",
    },
    supportingText: {
      type: "string",
      default: "",
      description: "Additional description text",
    },
  },
  stories: {
    Default: {
      props: {
        value: "option1",
        label: "Option 1",
      },
    },
    Small: {
      props: {
        value: "option1",
        size: "sm",
        label: "Option 1",
      },
    },
    Medium: {
      props: {
        value: "option1",
        size: "md",
        label: "Option 1",
      },
    },
    Large: {
      props: {
        value: "option1",
        size: "lg",
        label: "Option 1",
      },
    },
    Disabled: {
      props: {
        value: "option1",
        disabled: true,
        label: "Option 1",
      },
    },
    Error: {
      props: {
        value: "option1",
        error: true,
        label: "Option 1",
      },
    },
    "With Supporting Text": {
      props: {
        value: "option1",
        label: "Option 1",
        supportingText: "This is additional description text for the radio option",
      },
    },
    Required: {
      props: {
        value: "option1",
        required: true,
        label: "Option 1",
      },
    },
  },
  docs: {
    description:
      "Radio buttons allow users to select a single option from a list. Use when users can only select one option from a set. Note: Radios are typically controlled by a RadioGroup component.",
    examples: [
      {
        title: "Default",
        props: { value: "option1", label: "Option 1" },
      },
      {
        title: "Small",
        props: { value: "option1", size: "sm", label: "Option 1" },
      },
      {
        title: "Medium",
        props: { value: "option1", size: "md", label: "Option 1" },
      },
      {
        title: "Large",
        props: { value: "option1", size: "lg", label: "Option 1" },
      },
      {
        title: "Disabled",
        props: { value: "option1", disabled: true, label: "Option 1" },
      },
      {
        title: "Error State",
        props: { value: "option1", error: true, label: "Option 1" },
      },
      {
        title: "With Supporting Text",
        props: {
          value: "option1",
          label: "Option 1",
          supportingText: "Additional description text",
        },
      },
    ],
    usage: {
      react: `<Radio value="option1" label="Option 1" />`,
      angular: `<ui-radio-angular value="option1" label="Option 1"></ui-radio-angular>`,
      wc: `<ui-radio value="option1" label="Option 1"></ui-radio>`,
    },
  },
};

export default radioStory;
