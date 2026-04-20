import type { StoryDefinition } from "../state/storyTypes";

const datePickerStory: StoryDefinition = {
  id: "date-picker",
  title: "Date Picker",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "DatePicker" },
    angular: { exportName: "UiDatePickerComponent" },
    wc: { tagName: "ui-date-picker" },
  },
  props: {
    mode: {
      type: "select",
      default: "single",
      description: "Selection mode",
      options: ["single", "range"],
    },
    placeholder: {
      type: "string",
      default: "Enter date (e.g. 1 Jan 2020)",
      description: "Input placeholder",
    },
    showIcon: {
      type: "boolean",
      default: true,
      description: "Show calendar icon trigger",
    },
    iconOnly: {
      type: "boolean",
      default: false,
      description: "Only icon trigger mode",
    },
    showActions: {
      type: "boolean",
      default: false,
      description: "Enable apply/cancel footer",
    },
    search: {
      type: "boolean",
      default: false,
      description: "Enable internal panel search input",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disable interaction",
    },
    readonly: {
      type: "boolean",
      default: false,
      description: "Read-only input",
    },
    defaultOpen: {
      type: "boolean",
      default: false,
      description: "Initial open state",
    },
    parserPreset: {
      type: "select",
      default: "none",
      description: "Enable custom regex parser demo",
      options: ["none", "todayNextWeek"],
    },
  },
  stories: {
    Default: { props: { mode: "single", showIcon: true } },
    "Range Picker": { props: { mode: "range", showIcon: true } },
    "With Icon Trigger": { props: { mode: "single", showIcon: true } },
    "Icon Only": { props: { mode: "single", iconOnly: true, showIcon: true } },
    "Input Parsing": { props: { mode: "single" } },
    "Custom Regex": { props: { mode: "single", parserPreset: "todayNextWeek", search: true } },
    "Controlled Mode": { props: { mode: "single", defaultOpen: false } },
    "Invalid Input": { props: { mode: "single", placeholder: "Type random string to validate" } },
    "Search Enabled": { props: { mode: "single", search: true } },
    "Search + Range": { props: { mode: "range", search: true } },
    "Search + Apply Mode": { props: { mode: "single", search: true, showActions: true } },
  },
  docs: {
    description:
      "Date Picker supports single and range selection with lazy calendar rendering, accessible keyboard navigation, and smart parser matching for human-readable date inputs.",
    usage: {
      react: `<DatePicker mode="single" />`,
      angular: `<ui-date-picker-angular [mode]="'single'"></ui-date-picker-angular>`,
      wc: `<ui-date-picker mode="single"></ui-date-picker>`,
    },
    examples: [
      {
        title: "Single Date",
        description: `<DatePicker mode="single" />`,
      },
      {
        title: "Range Mode",
        description: `<DatePicker mode="range" />`,
      },
      {
        title: "Custom Regex Parsers",
        description:
          `<DatePicker search customParsers={[{ regex: /today/i, parse: () => new Date() }, { regex: /next week/i, parse: () => new Date(Date.now() + 7 * 86400000) }]} />`,
      },
    ],
  },
};

export default datePickerStory;
