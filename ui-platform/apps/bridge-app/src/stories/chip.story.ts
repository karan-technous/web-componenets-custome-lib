import type { StoryDefinition } from "../state/storyTypes";
import type { ChipEventDetail } from "@karan9186/core";

const chipStory: StoryDefinition = {
  id: "chip",
  title: "Chip",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "Chip" },
    angular: { exportName: "UiChipComponent" },
    wc: { tagName: "ui-chip" },
  },
  props: {
    label: {
      type: "string",
      default: "",
      description: "Text content displayed on the chip",
    },
    value: {
      type: "string",
      default: "",
      description: "Unique value associated with the chip for identification",
    },
    active: {
      type: "boolean",
      default: false,
      description: "Whether the chip is in an active/selected state",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disables interaction and dims the chip",
    },
    iconName: {
      type: "string",
      default: "",
      description: "Icon name from lucide icons (e.g. 'user', 'tag', 'star')",
    },
    badgeCounter: {
      type: "string",
      default: '1',
      description: "Number to display as a badge on the chip",
    },
    removable: {
      type: "boolean",
      default: false,
      description: "Shows a remove button to allow deletion of the chip",
    },
    size: {
      type: "select",
      default: "md",
      description: "Size of the chip (sm, md, lg, xl)",
      options: ["sm", "md", "lg", "xl"],
    },
  },
  stories: {
    Default: {
      props: {
        label: "Default Chip",
        value: "default",
      },
    },
    Active: {
      props: {
        label: "Active Chip",
        value: "active",
        active: true,
      },
    },
    Disabled: {
      props: {
        label: "Disabled Chip",
        value: "disabled",
        disabled: true,
      },
    },
    WithIcon: {
      props: {
        label: "User",
        value: "user",
        iconName: "User",
      },
    },
    WithBadge: {
      props: {
        label: "Notifications",
        value: "notifications",
        badgeCounter: "5",
      },
    },
    Removable: {
      props: {
        label: "Removable Chip",
        value: "removable",
        removable: true,
      },
    },
    Small: {
      props: {
        label: "Small Chip",
        value: "small",
        size: "sm",
      },
    },
    Large: {
      props: {
        label: "Large Chip",
        value: "large",
        size: "lg",
      },
    },
    Complete: {
      props: {
        label: "Premium",
        value: "premium",
        active: true,
        iconName: "Star",
        badgeCounter: "1",
        removable: true,
        size: "md",
      },
    },
  },
  docs: {
    description:
      "Chips represent complex entities in small blocks, such as contacts, tags, or categories. They can be interactive, removable, and display additional information like badges.\n\nThis chip component supports selection states, icons, badges, and removal functionality for flexible UI patterns.\n\n- Use for filtering, selection, or categorization\n- Add icons for visual context\n- Use badges for counts or status indicators\n- Enable removable for dynamic lists",
    examples: [
      {
        title: "Default",
        storyName: "Default",
        description: "Basic chip with label and value.",
        props: { label: "Tag", value: "tag" },
      },
      {
        title: "Active",
        storyName: "Active",
        description: "Chip in selected/active state.",
        props: { label: "Selected", value: "selected", active: true },
      },
      {
        title: "With Icon",
        storyName: "WithIcon",
        description: "Chip with an icon for better visual identification.",
        props: { label: "Person", value: "person", iconName: "User" },
      },
      {
        title: "With Badge",
        storyName: "WithBadge",
        description: "Chip displaying a count or status with a badge.",
        props: { label: "Messages", value: "messages", badgeCounter: "3" },
      },
      {
        title: "Removable",
        storyName: "Removable",
        description: "Chip that can be removed by the user.",
        props: { label: "Filter", value: "filter", removable: true },
      },
      {
        title: "Complete",
        storyName: "Complete",
        description: "Chip with all features enabled.",
        props: {
          label: "Premium",
          value: "premium",
          active: true,
          iconName: "Star",
          badgeCounter: "1",
          removable: true,
        },
      },
    ],
    usage: {
      react: `import { Chip } from "@karan9186/react";

// Basic usage
<Chip label="Tag" value="tag" />

// With all features
<Chip
  label="Premium"
  value="premium"
  active={true}
  iconName="Star"
  badgeCounter={1}
  removable={true}
  size="lg"
  onActiveChange={(active, value) => console.log(active, value)}
  onRemove={(detail) => console.log('removed', detail)}
/>`,
      angular: `<!-- Basic usage -->
<ui-chip-angular label="Tag" value="tag"></ui-chip-angular>

<!-- With all features -->
<ui-chip-angular
  label="Premium"
  value="premium"
  [(active)]="isActive"
  iconName="Star"
  [badgeCounter]="1"
  [removable]="true"
  size="lg"
  (activeChange)="onActiveChange($event)"
  (remove)="onRemove($event)"
></ui-chip-angular>`,
      wc: `<!-- Basic usage -->
<ui-chip label="Tag" value="tag"></ui-chip>

<!-- With all features -->
<ui-chip
  label="Premium"
  value="premium"
  active
  icon-name="Star"
  badge-counter="1"
  removable
  size="lg"
></ui-chip>`,
    },
    api: [
      {
        name: "label",
        type: "string",
        defaultValue: '""',
        description: "Text content displayed on the chip",
      },
      {
        name: "value",
        type: "string",
        defaultValue: '""',
        description: "Unique value for identification and event handling",
      },
      {
        name: "active",
        type: "boolean",
        defaultValue: "false",
        description: "Whether the chip is in an active/selected state",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables interaction and dims the chip",
      },
      {
        name: "iconName",
        type: "IconName",
        defaultValue: "undefined",
        description: "Icon name from lucide icons for visual context",
      },
      {
        name: "badgeCounter",
        type: "number",
        defaultValue: "undefined",
        description: "Number to display as a badge",
      },
      {
        name: "removable",
        type: "boolean",
        defaultValue: "false",
        description: "Shows a remove button for deletion",
      },
      {
        name: "size",
        type: "string",
        defaultValue: '"md"',
        description: "Size of the chip (sm, md, lg, xl)",
      },
      {
        name: "onActiveChange",
        type: "(active: boolean, value: string) => void",
        defaultValue: "-",
        description: "Callback when active state changes",
      },
      {
        name: "onChipClick",
        type: "(value: ChipEventDetail) => void",
        defaultValue: "-",
        description: "Callback when chip is clicked",
      },
      {
        name: "onRemove",
        type: "(value: ChipEventDetail) => void",
        defaultValue: "-",
        description: "Callback when remove button is clicked",
      },
      {
        name: "onIconClick",
        type: "(value: ChipEventDetail) => void",
        defaultValue: "-",
        description: "Callback when icon is clicked",
      },
    ],
  },
};

export default chipStory;