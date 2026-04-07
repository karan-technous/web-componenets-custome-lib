import type { StoryDefinition } from "../state/storyTypes";

const checkboxStory: StoryDefinition = {
  id: "checkbox",
  title: "Checkbox",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "Checkbox" },
    angular: { exportName: "UiCheckboxComponent" },
    wc: { tagName: "ui-checkbox" },
  },
  props: {
    checked: {
      type: "boolean",
      default: false,
      description: "Checked state",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disable interaction",
    },
    size: {
      type: "select",
      options: ["sm", "md", "lg"],
      default: "md",
      description: "Toggle size",
    },
  },
  stories: {
    Default: {
      props: {
        checked: false,
      },
    },
    Checked: {
      props: {
        checked: true,
      },
    },
    Disabled: {
      props: {
        checked: false,
        disabled: true,
      },
    },
  },
  docs: {
    description:
      "Toggle switches between on/off states. Use for immediate, binary settings.",
    examples: [
      {
        title: "Unchecked",
        props: { checked: false, disabled: false, size: "md" },
      },
      {
        title: "Checked",
        props: { checked: true, disabled: false, size: "md" },
      },
    ],
    usage: {
      react: `<Toggle checked={false} />`,
      angular: `<ui-toggle-angular [ngModel]="false"></ui-toggle-angular>`,
      wc: `<ui-toggle></ui-toggle>`,
    },
  },
};

export default checkboxStory;
