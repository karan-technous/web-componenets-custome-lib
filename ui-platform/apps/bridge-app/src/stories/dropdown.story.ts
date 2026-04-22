import type { StoryDefinition } from "../state/storyTypes";

const dropdownStory: StoryDefinition = {
  id: "dropdown",
  title: "Dropdown",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "UiDropdown" },
    angular: { exportName: "DropdownComponent" },
    wc: { tagName: "ui-dropdown" },
  },
  props: {
    mode: {
      type: "select",
      default: "single",
      description: "Selection mode",
      options: ["single", "multiple"],
    },
    maxWidth: {
      type: "string",
      default: "",
      description: "Maximum width",
    },
    variant: {
      type: "select",
      default: "input",
      description: "Trigger variant",
      options: ["input", "button", "icon-only"],
    },
    placeholder: {
      type: "string",
      default: "Select...",
      description: "Placeholder text",
    },
    label: {
      type: "string",
      default: "",
      description: "Label text for the dropdown",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disable interaction",
    },
    loading: {
      type: "boolean",
      default: false,
      description: "Loading state",
    },
    searchable: {
      type: "boolean",
      default: false,
      description: "Enable search/filter",
    },
    clearable: {
      type: "boolean",
      default: false,
      description: "Show clear button",
    },
    selectAll: {
      type: "boolean",
      default: false,
      description: "Show select all option (multi-select)",
    },
    minWidth: {
      type: "string",
      default: "",
      description: "Minimum width",
    },
    maxHeight: {
      type: "string",
      default: "300px",
      description: "Maximum height of dropdown menu",
    },
    options: {
      type: "string",
      default: JSON.stringify([
        { label: "Option 1", value: "1" },
        { label: "Option 2", value: "2" },
        { label: "Option 3", value: "3" },
      ]),
      description: "Available options (JSON string)",
    },
  },
  stories: {
    Default: {
      props: {
        mode: "single",
        variant: "input",
        options: [
          { label: "Apple", value: "apple" },
          { label: "Banana", value: "banana" },
          { label: "Cherry", value: "cherry" },
          { label: "Date", value: "date" },
          { label: "Elderberry", value: "elderberry" },
        ] as any,
      },
    },
    "With Label": {
      props: {
        mode: "single",
        variant: "input",
        label: "Select Fruit",
        options: [
          { label: "Apple", value: "apple" },
          { label: "Banana", value: "banana" },
          { label: "Cherry", value: "cherry" },
        ] as any,
      },
    },
    "Multi-Select": {
      props: {
        mode: "multiple",
        variant: "input",
        options: [
          { label: "Red", value: "red" },
          { label: "Green", value: "green" },
          { label: "Blue", value: "blue" },
          { label: "Yellow", value: "yellow" },
          { label: "Purple", value: "purple" },
        ] as any,
      },
    },
    "Multi-Select with Select All": {
      props: {
        mode: "multiple",
        variant: "input",
        selectAll: true,
        clearable: true,
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
          { label: "Option 3", value: "3" },
          { label: "Option 4", value: "4" },
          { label: "Option 5", value: "5" },
        ] as any,
      },
    },
    "Button Variant": {
      props: {
        mode: "single",
        variant: "button",
        options: [
          { label: "Small", value: "s" },
          { label: "Medium", value: "m" },
          { label: "Large", value: "l" },
          { label: "Extra Large", value: "xl" },
        ] as any,
      },
    },
    "Searchable": {
      props: {
        mode: "single",
        variant: "input",
        searchable: true,
        options: [
          { label: "Afghanistan", value: "af" },
          { label: "Albania", value: "al" },
          { label: "Algeria", value: "dz" },
          { label: "Andorra", value: "ad" },
          { label: "Angola", value: "ao" },
          { label: "Argentina", value: "ar" },
          { label: "Armenia", value: "am" },
          { label: "Australia", value: "au" },
          { label: "Austria", value: "at" },
          { label: "Azerbaijan", value: "az" },
        ] as any,
      },
    },
    "Grouped Options": {
      props: {
        mode: "single",
        variant: "input",
        options: [
          { label: "Apple", value: "apple", group: "Fruits" },
          { label: "Banana", value: "banana", group: "Fruits" },
          { label: "Carrot", value: "carrot", group: "Vegetables" },
          { label: "Broccoli", value: "broccoli", group: "Vegetables" },
          { label: "Chicken", value: "chicken", group: "Meat" },
          { label: "Beef", value: "beef", group: "Meat" },
        ] as any,
      },
    },
    "Disabled Options": {
      props: {
        mode: "single",
        variant: "input",
        options: [
          { label: "Available", value: "1" },
          { label: "Sold Out", value: "2", disabled: true },
          { label: "In Stock", value: "3" },
          { label: "Pre-order", value: "4", disabled: true },
        ] as any,
      },
    },
    "Loading State": {
      props: {
        mode: "single",
        variant: "input",
        loading: true,
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ] as any,
      },
    },
    "Disabled": {
      props: {
        mode: "single",
        variant: "input",
        disabled: true,
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ] as any,
      },
    },
    "Clearable": {
      props: {
        mode: "single",
        variant: "input",
        clearable: true,
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
          { label: "Option 3", value: "3" },
        ] as any,
      },
    },
  },
  docs: {
    description:
      "Dropdown List supports single and multiple selection with keyboard navigation, search/filtering, grouped options, and various trigger variants. Fully accessible with ARIA attributes and focus management.",
    usage: {
      react: `<UiDropdown mode="single" options={[{ label: 'Option 1', value: '1' }]} />`,
      angular: `<ui-dropdown-angular [mode]="'single'" [options]="[{ label: 'Option 1', value: '1' }]"></ui-dropdown-angular>`,
      wc: `<ui-dropdown mode="single" options='[{"label":"Option 1","value":"1"}]'></ui-dropdown>`,
    },
    examples: [
      {
        title: "Single Select",
        description: `<UiDropdown mode="single" options={options} />`,
      },
      {
        title: "Multi-Select",
        description: `<UiDropdown mode="multiple" options={options} />`,
      },
      {
        title: "Searchable",
        description: `<UiDropdown searchable options={options} />`,
      },
      {
        title: "Grouped",
        description: `<UiDropdown options={groupedOptions} />`,
      },
    ],
  },
};

export default dropdownStory;
