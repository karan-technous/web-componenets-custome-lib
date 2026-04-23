import type { StoryDefinition } from "../state/storyTypes";

const checkboxDropdownStory: StoryDefinition = {
  id: "checkbox-dropdown",
  title: "Checkbox Dropdown",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "CheckboxDropdown" },
    angular: { exportName: "UiCheckboxDropdownWrapper" },
    wc: { tagName: "ui-checkbox-dropdown" },
  },
  props: {
    label: {
      type: "string",
      default: "",
      description: "Label text for the dropdown",
    },
    placeholder: {
      type: "string",
      default: "Select...",
      description: "Placeholder text when no options selected",
    },
    supportingText: {
      type: "string",
      default: "",
      description: "Supporting text below label",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disable interaction",
    },
    required: {
      type: "boolean",
      default: false,
      description: "Mark as required field",
    },
    loading: {
      type: "boolean",
      default: false,
      description: "Loading state",
    },
    showAvatar: {
      type: "boolean",
      default: false,
      description: "Show avatar for selected options",
    },
    errorMessage: {
      type: "string",
      default: "",
      description: "Error message to display",
    },
    showSelectAll: {
      type: "boolean",
      default: true,
      description: "Show select all option",
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
        options: [
          { label: "Apple", value: "apple" },
          { label: "Banana", value: "banana" },
          { label: "Cherry", value: "cherry" },
          { label: "Date", value: "date" },
        ] as any,
        showSelectAll: true,
      },
    },
    "With Label": {
      props: {
        label: "Select Fruits",
        placeholder: "Choose fruits...",
        options: [
          { label: "Apple", value: "apple" },
          { label: "Banana", value: "banana" },
          { label: "Cherry", value: "cherry" },
        ] as any,
      },
    },
    "With Supporting Text": {
      props: {
        label: "Select Funds",
        supportingText: "Choose one or more funds to invest in",
        options: [
          { label: "Growth Fund", value: "growth" },
          { label: "Income Fund", value: "income" },
          { label: "Balanced Fund", value: "balanced" },
        ] as any,
      },
    },
    "With Error": {
      props: {
        label: "Select Options",
        errorMessage: "Please select at least one option",
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
          { label: "Option 3", value: "3" },
        ] as any,
      },
    },
    "Required Field": {
      props: {
        label: "Select Items",
        required: true,
        options: [
          { label: "Item 1", value: "1" },
          { label: "Item 2", value: "2" },
          { label: "Item 3", value: "3" },
        ] as any,
      },
    },
    "Without Select All": {
      props: {
        label: "Select Colors",
        showSelectAll: false,
        options: [
          { label: "Red", value: "red" },
          { label: "Green", value: "green" },
          { label: "Blue", value: "blue" },
        ] as any,
      },
    },
    "With Avatars": {
      props: {
        label: "Select Users",
        showAvatar: true,
        options: [
          { label: "John Doe", value: "john", avatar: "https://i.pravatar.cc/150?u=john" },
          { label: "Jane Smith", value: "jane", avatar: "https://i.pravatar.cc/150?u=jane" },
          { label: "Bob Wilson", value: "bob", avatar: "https://i.pravatar.cc/150?u=bob" },
        ] as any,
      },
    },
    "With Per-Option Supporting Text": {
      props: {
        label: "Select Users",
        showAvatar: true,
        options: [
          { label: "John Doe", value: "john", avatar: "https://i.pravatar.cc/150?u=john", supportingText: "john.doe@example.com" },
          { label: "Jane Smith", value: "jane", avatar: "https://i.pravatar.cc/150?u=jane", supportingText: "jane.smith@example.com" },
          { label: "Bob Wilson", value: "bob", avatar: "https://i.pravatar.cc/150?u=bob", supportingText: "bob.wilson@example.com" },
        ] as any,
      },
    },
    "Loading State": {
      props: {
        label: "Select Options",
        loading: true,
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ] as any,
      },
    },
    "Disabled": {
      props: {
        label: "Select Options",
        disabled: true,
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
          { label: "Option 3", value: "3" },
        ] as any,
      },
    },
    "With Disabled Options": {
      props: {
        label: "Select Items",
        options: [
          { label: "Available", value: "1" },
          { label: "Sold Out", value: "2", disabled: true },
          { label: "In Stock", value: "3" },
          { label: "Pre-order", value: "4", disabled: true },
        ] as any,
      },
    },
    "Pre-selected Values": {
      props: {
        label: "Select Fruits",
        options: [
          { label: "Apple", value: "apple" },
          { label: "Banana", value: "banana" },
          { label: "Cherry", value: "cherry" },
          { label: "Date", value: "date" },
        ] as any,
      },
    },
  },
  docs: {
    description:
      "Checkbox Dropdown allows multiple selection from a dropdown list with checkboxes. Features include select all option, avatar support, loading states, error handling, and disabled states. Fully accessible with keyboard navigation.",
    usage: {
      react: `<CheckboxDropdown options={[{ label: 'Option 1', value: '1' }]} />`,
      angular: `<ui-checkbox-dropdown-angular [options]="[{ label: 'Option 1', value: '1' }]"></ui-checkbox-dropdown-angular>`,
      wc: `<ui-checkbox-dropdown options='[{"label":"Option 1","value":"1"}]'></ui-checkbox-dropdown>`,
    },
    examples: [
      {
        title: "Basic",
        description: `<CheckboxDropdown options={options} />`,
      },
      {
        title: "With Label",
        description: `<CheckboxDropdown label="Select Items" options={options} />`,
      },
      {
        title: "With Avatars",
        description: `<CheckboxDropdown showAvatar options={avatarOptions} />`,
      },
      {
        title: "Loading State",
        description: `<CheckboxDropdown loading options={options} />`,
      },
    ],
  },
};

export default checkboxDropdownStory;
