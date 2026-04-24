import type { StoryDefinition } from "../state/storyTypes";

const radioGroupStory: StoryDefinition = {
  id: "radio-group",
  title: "Radio Group",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "RadioGroup", childrenProp: "radios" },
    angular: { exportName: "UiRadioGroupComponent", projectedProp: "radios" },
    wc: { tagName: "ui-radio-group", textProp: "radios" },
  },
  props: {
    value: {
      type: "string",
      default: "",
      description: "Currently selected value",
    },
    defaultValue: {
      type: "string",
      default: "",
      description: "Default selected value (uncontrolled)",
    },
    name: {
      type: "string",
      default: "",
      description: "Form group name",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disable all radios in group",
    },
    required: {
      type: "boolean",
      default: false,
      description: "Required field indicator",
    },
    label: {
      type: "string",
      default: "",
      description: "Group label text",
    },
    orientation: {
      type: "select",
      options: ["horizontal", "vertical"],
      default: "vertical",
      description: "Layout orientation",
    },
    size: {
      type: "select",
      options: ["sm", "md", "lg"],
      default: "md",
      description: "Radio size",
    },
    radios: {
      type: "string",
      default: "",
      description: "JSON string array of radio objects with value, label, supportingText",
    },
  },
  stories: {
    Default: {
      props: {
        name: "group1",
        value: "option1",
        orientation: "vertical",
        radios: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"},{"value":"option3","label":"Option 3"}]',
      },
    },
    Small: {
      props: {
        name: "group1",
        value: "option1",
        size: "sm",
        radios: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"}]',
      },
    },
    Medium: {
      props: {
        name: "group1",
        value: "option1",
        size: "md",
        radios: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"}]',
      },
    },
    Large: {
      props: {
        name: "group1",
        value: "option1",
        size: "lg",
        radios: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"}]',
      },
    },
    Horizontal: {
      props: {
        name: "group1",
        value: "option1",
        orientation: "horizontal",
        radios: '[{"value":"option1","label":"Small"},{"value":"option2","label":"Medium"},{"value":"option3","label":"Large"}]',
      },
    },
    Disabled: {
      props: {
        name: "group1",
        value: "option1",
        disabled: true,
        radios: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"}]',
      },
    },
    "With Label": {
      props: {
        name: "group1",
        value: "option1",
        label: "Choose your preference",
        radios: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"}]',
      },
    },
    Required: {
      props: {
        name: "group1",
        value: "option1",
        required: true,
        label: "Payment Method",
        radios: '[{"value":"credit-card","label":"Credit Card"},{"value":"paypal","label":"PayPal"},{"value":"bank-transfer","label":"Bank Transfer"}]',
      },
    },
  },
  docs: {
    description:
      "Radio groups manage a collection of radio buttons, ensuring only one can be selected at a time. Supports keyboard navigation and form integration.",
    examples: [
      {
        title: "Vertical Group",
        props: { name: "group1", value: "option1", orientation: "vertical", radios: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"}]' },
      },
      {
        title: "Horizontal Group",
        props: { name: "group1", value: "option1", orientation: "horizontal", radios: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"}]' },
      },
      {
        title: "Small",
        props: { name: "group1", value: "option1", size: "sm", radios: '[{"value":"option1","label":"Option 1"}]' },
      },
      {
        title: "Medium",
        props: { name: "group1", value: "option1", size: "md", radios: '[{"value":"option1","label":"Option 1"}]' },
      },
      {
        title: "Large",
        props: { name: "group1", value: "option1", size: "lg", radios: '[{"value":"option1","label":"Option 1"}]' },
      },
      {
        title: "Disabled Group",
        props: { name: "group1", value: "option1", disabled: true, radios: '[{"value":"option1","label":"Option 1"}]' },
      },
      {
        title: "With Label",
        props: { name: "group1", value: "option1", label: "Choose your preference", radios: '[{"value":"option1","label":"Option 1"}]' },
      },
      {
        title: "Required",
        props: { name: "group1", value: "option1", required: true, label: "Payment Method", radios: '[{"value":"credit-card","label":"Credit Card"}]' },
      },
    ],
    usage: {
      react: `<RadioGroup name="group" value="option1">\n  <Radio value="option1" label="Option 1" />\n  <Radio value="option2" label="Option 2" />\n</RadioGroup>`,
      angular: `<ui-radio-group-angular name="group" [value]="'option1'">\n  <ui-radio-angular value="option1" label="Option 1"></ui-radio-angular>\n  <ui-radio-angular value="option2" label="Option 2"></ui-radio-angular>\n</ui-radio-group-angular>`,
      wc: `<ui-radio-group name="group" value="option1">\n  <ui-radio value="option1" label="Option 1"></ui-radio>\n  <ui-radio value="option2" label="Option 2"></ui-radio>\n</ui-radio-group>`,
    },
  },
};

export default radioGroupStory;
