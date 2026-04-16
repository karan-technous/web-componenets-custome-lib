import type { StoryDefinition } from "../state/storyTypes";
import type { ButtonGroupEventDetail } from "@karan9186/core";

const buttonGroupStory: StoryDefinition = {
  id: "button-group",
  title: "ButtonGroup",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "UiButtonGroup", childrenProp: "buttons" },
    angular: { exportName: "ButtonGroupComponent", projectedProp: "buttons" },
    wc: { tagName: "ui-button-group", textProp: "buttons" },
  },
  props: {
    variant: {
      type: "select",
      options: ["inherit", "primary", "secondary", "ghost", "danger"],
      default: "inherit",
      description: "Variant inheritance for child buttons",
    },
    size: {
      type: "select",
      options: ["inherit", "default", "sm", "lg"],
      default: "inherit",
      description: "Size inheritance for child buttons",
    },
    segmented: {
      type: "boolean",
      default: false,
      description: "Whether buttons are segmented (no gaps, shared borders)",
    },
    orientation: {
      type: "select",
      options: ["horizontal", "vertical"],
      default: "horizontal",
      description: "Orientation of the button group",
    },
    gap: {
      type: "select",
      options: ["xs", "sm", "md", "lg", "none"],
      default: "md",
      description: "Gap between buttons",
    },
    attached: {
      type: "boolean",
      default: false,
      description: "Whether buttons are attached (no gaps)",
    },
    fullWidth: {
      type: "boolean",
      default: false,
      description: "Whether the group takes full width",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Whether the entire group is disabled",
    },
    rounded: {
      type: "select",
      options: ["none", "sm", "md", "lg", "full"],
      default: "md",
      description: "Border radius size for the button group",
    },
    selectionMode: {
      type: "select",
      options: ["none", "single", "multiple"],
      default: "none",
      description: "Selection mode: none (no tracking), single (radio-style), or multiple (checkbox-style)",
    },
    value: {
      type: "string",
      default: "",
      description: "Controlled value for selected button(s). Single mode: string, Multiple mode: JSON string array e.g. '[\"option1\",\"option2\"]'",
    },
    buttons: {
      type: "string",
      default: "",
      description: "JSON string array of button objects with value, label, variant, size, iconLeft, iconRight",
    },
    buttonLoading: {
      type: "boolean",
      default: false,
      description: "Whether child buttons are in loading state",
    },
    buttonAnimated: {
      type: "boolean",
      default: false,
      description: "Whether to enable click animation on child buttons (press effect)",
    },
    buttonFullWidth: {
      type: "boolean",
      default: false,
      description: "Whether child buttons should take full width",
    },
  },
  stories: {
    Default: {
      props: {
        orientation: "horizontal",
        selectionMode: "none",
        buttons: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"},{"value":"option3","label":"Option 3"}]',
      },
    },
    Horizontal: {
      props: {
        orientation: "horizontal",
        selectionMode: "none",
        buttons: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"},{"value":"option3","label":"Option 3"}]',
      },
    },
    Vertical: {
      props: {
        orientation: "vertical",
        selectionMode: "none",
        buttons: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"},{"value":"option3","label":"Option 3"}]',
      },
    },
    Segmented: {
      props: {
        orientation: "horizontal",
        segmented: true,
        selectionMode: "single",
        buttons: '[{"value":"day","label":"Day"},{"value":"week","label":"Week"},{"value":"month","label":"Month"}]',
      },
    },
    Attached: {
      props: {
        orientation: "horizontal",
        attached: true,
        selectionMode: "none",
        buttons: '[{"value":"prev","label":"Previous"},{"value":"next","label":"Next"}]',
      },
    },
    SingleSelect: {
      props: {
        orientation: "horizontal",
        selectionMode: "single",
        value: "option1",
        buttons: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"},{"value":"option3","label":"Option 3"}]',
      },
    },
    MultiSelect: {
      props: {
        orientation: "horizontal",
        selectionMode: "multiple",
        value: '["option1","option2"]',
        buttons: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"},{"value":"option3","label":"Option 3"}]',
      },
    },
    FullWidth: {
      props: {
        orientation: "horizontal",
        fullWidth: true,
        selectionMode: "none",
        buttons: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"},{"value":"option3","label":"Option 3"}]',
      },
    },
    Disabled: {
      props: {
        orientation: "horizontal",
        disabled: true,
        selectionMode: "none",
        buttons: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"},{"value":"option3","label":"Option 3"}]',
      },
    },
    WithVariantOverride: {
      props: {
        orientation: "horizontal",
        variant: "outline",
        selectionMode: "none",
        buttons: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"},{"value":"option3","label":"Option 3"}]',
      },
    },
    WithSizeOverride: {
      props: {
        orientation: "horizontal",
        size: "sm",
        buttonFullWidth: true,
        selectionMode: "none",
        buttons: '[{"value":"option1","label":"Option 1"},{"value":"option2","label":"Option 2"},{"value":"option3","label":"Option 3"}]',
      },
    },
    VerticalSegmented: {
      props: {
        orientation: "vertical",
        segmented: true,
        selectionMode: "single",
        buttonFullWidth: true,
        buttons: '[{"value":"day","label":"Day"},{"value":"week","label":"Week"},{"value":"month","label":"Month"}]',
      },
    },
  },
  docs: {
    description:
      "ButtonGroup composes Button components with layout control and selection logic. It provides grouped behavior for related actions and enables single or multiple selection patterns.\n\nKey features:\n- **Layout Control**: Horizontal or vertical orientation with spacing options\n- **Group Styling**: Segmented (pill-style) and attached (merged) modes\n- **Selection Logic**: None, single-select (radio), or multi-select (checkbox) modes\n- **Accessibility**: Proper ARIA roles and attributes for screen readers\n- **Framework Parity**: Same API across Web Component, Angular, and React\n\nUse ButtonGroup when:\n- You have related actions that belong together\n- You need single selection from mutually exclusive options\n- You need multi-selection from a list of options\n- You want to present a segmented control interface",
    examples: [
      {
        title: "Default Group",
        storyName: "Default",
        description:
          "A basic horizontal button group without selection. Buttons maintain their individual behavior.",
        props: { orientation: "horizontal", selectionMode: "none" },
      },
      {
        title: "Segmented Control",
        storyName: "Segmented",
        description:
          "Pill-style segmented control for single selection. Best for switching between views or options.",
        props: { orientation: "horizontal", segmented: true, selectionMode: "single" },
      },
      {
        title: "Single Selection",
        storyName: "SingleSelect",
        description:
          "Radio-style single selection. Only one button can be active at a time.",
        props: { orientation: "horizontal", selectionMode: "single" },
      },
      {
        title: "Multiple Selection",
        storyName: "MultiSelect",
        description:
          "Checkbox-style multiple selection. Multiple buttons can be active simultaneously.",
        props: { orientation: "horizontal", selectionMode: "multiple" },
      },
      {
        title: "Attached Group",
        storyName: "Attached",
        description:
          "Buttons with no gaps between them. Borders merge for a unified appearance.",
        props: { orientation: "horizontal", attached: true, selectionMode: "none" },
      },
      {
        title: "Vertical Group",
        storyName: "Vertical",
        description:
          "Vertical orientation for stacked button groups. Useful for toolbar or sidebar layouts.",
        props: { orientation: "vertical", selectionMode: "none" },
      },
    ],
    usage: {
      react: `import { UiButtonGroup, UiButton } from "@karan9186/react";
import { useButtonGroup } from "@karan9186/react";

// Basic group without selection
<UiButtonGroup orientation="horizontal">
  <UiButton value="option1">Option 1</UiButton>
  <UiButton value="option2">Option 2</UiButton>
  <UiButton value="option3">Option 3</UiButton>
</UiButtonGroup>

// Single selection with controlled value
const [selected, setSelected] = useState('option1');

<UiButtonGroup
  orientation="horizontal"
  selectionMode="single"
  value={selected}
  onUiChange={(e) => setSelected(e.value)}
>
  <UiButton value="option1">Option 1</UiButton>
  <UiButton value="option2">Option 2</UiButton>
  <UiButton value="option3">Option 3</UiButton>
</UiButtonGroup>

// Multi selection
const [selected, setSelected] = useState<string[]>([]);

<UiButtonGroup
  orientation="horizontal"
  selectionMode="multiple"
  value={selected}
  onUiChange={(e) => setSelected(e.value as string[])}
>
  <UiButton value="option1">Option 1</UiButton>
  <UiButton value="option2">Option 2</UiButton>
  <UiButton value="option3">Option 3</UiButton>
</UiButtonGroup>

// Using the hook
const { value, handleButtonClick, isSelected } = useButtonGroup({
  selectionMode: 'single',
  defaultValue: 'option1',
  onChange: (value) => console.log('Selected:', value)
});

<UiButtonGroup orientation="horizontal" selectionMode="single" value={value}>
  <UiButton value="option1" onClick={() => handleButtonClick('option1')}>Option 1</UiButton>
  <UiButton value="option2" onClick={() => handleButtonClick('option2')}>Option 2</UiButton>
  <UiButton value="option3" onClick={() => handleButtonClick('option3')}>Option 3</UiButton>
</UiButtonGroup>

// Segmented control
<UiButtonGroup
  orientation="horizontal"
  segmented
  selectionMode="single"
  value={selected}
>
  <UiButton value="day">Day</UiButton>
  <UiButton value="week">Week</UiButton>
  <UiButton value="month">Month</UiButton>
</UiButtonGroup>`,
      angular: `<!-- Basic group without selection -->
<ui-button-group-angular orientation="horizontal">
  <ui-button-angular value="option1">Option 1</ui-button-angular>
  <ui-button-angular value="option2">Option 2</ui-button-angular>
  <ui-button-angular value="option3">Option 3</ui-button-angular>
</ui-button-group-angular>

<!-- Single selection with ngModel -->
<ui-button-group-angular
  orientation="horizontal"
  selectionMode="single"
  [(value)]="selectedValue"
  (uiChange)="handleSelection($event)"
>
  <ui-button-angular value="option1">Option 1</ui-button-angular>
  <ui-button-angular value="option2">Option 2</ui-button-angular>
  <ui-button-angular value="option3">Option 3</ui-button-angular>
</ui-button-group-angular>

<!-- Multi selection -->
<ui-button-group-angular
  orientation="horizontal"
  selectionMode="multiple"
  [(value)]="selectedValues"
  (uiChange)="handleMultiSelection($event)"
>
  <ui-button-angular value="option1">Option 1</ui-button-angular>
  <ui-button-angular value="option2">Option 2</ui-button-angular>
  <ui-button-angular value="option3">Option 3</ui-button-angular>
</ui-button-group-angular>

<!-- Segmented control -->
<ui-button-group-angular
  orientation="horizontal"
  [segmented]="true"
  selectionMode="single"
  [(value)]="selectedValue"
>
  <ui-button-angular value="day">Day</ui-button-angular>
  <ui-button-angular value="week">Week</ui-button-angular>
  <ui-button-angular value="month">Month</ui-button-angular>
</ui-button-group-angular>

<!-- Vertical orientation -->
<ui-button-group-angular orientation="vertical">
  <ui-button-angular value="top">Top</ui-button-angular>
  <ui-button-angular value="middle">Middle</ui-button-angular>
  <ui-button-angular value="bottom">Bottom</ui-button-angular>
</ui-button-group-angular>

<!-- Using directive -->
<div uiButtonGroup orientation="horizontal" selectionMode="single">
  <button uiButton value="option1">Option 1</button>
  <button uiButton value="option2">Option 2</button>
  <button uiButton value="option3">Option 3</button>
</div>`,
      wc: `<!-- Basic group without selection -->
<ui-button-group orientation="horizontal">
  <ui-button value="option1">Option 1</ui-button>
  <ui-button value="option2">Option 2</ui-button>
  <ui-button value="option3">Option 3</ui-button>
</ui-button-group>

<!-- Single selection -->
<ui-button-group
  orientation="horizontal"
  selectionMode="single"
  value="option1"
>
  <ui-button value="option1">Option 1</ui-button>
  <ui-button value="option2">Option 2</ui-button>
  <ui-button value="option3">Option 3</ui-button>
</ui-button-group>

<!-- Multi selection -->
<ui-button-group
  orientation="horizontal"
  selectionMode="multiple"
  value='["option1","option2"]'
>
  <ui-button value="option1">Option 1</ui-button>
  <ui-button value="option2">Option 2</ui-button>
  <ui-button value="option3">Option 3</ui-button>
</ui-button-group>

<!-- Segmented control -->
<ui-button-group
  orientation="horizontal"
  segmented
  selectionMode="single"
  value="day"
>
  <ui-button value="day">Day</ui-button>
  <ui-button value="week">Week</ui-button>
  <ui-button value="month">Month</ui-button>
</ui-button-group>

<!-- Attached group -->
<ui-button-group
  orientation="horizontal"
  attached
>
  <ui-button value="prev">Previous</ui-button>
  <ui-button value="next">Next</ui-button>
</ui-button-group>

<!-- Vertical orientation -->
<ui-button-group orientation="vertical">
  <ui-button value="top">Top</ui-button>
  <ui-button value="middle">Middle</ui-button>
  <ui-button value="bottom">Bottom</ui-button>
</ui-button-group>

<!-- With event listeners -->
<script>
  const group = document.querySelector('ui-button-group');
  group.addEventListener('uiChange', (e) => {
    console.log('Selection changed:', e.detail.value);
  });
</script>`,
    },
    api: [
      {
        name: "orientation",
        type: "'horizontal' | 'vertical'",
        defaultValue: "'horizontal'",
        description: "Orientation of the button group layout",
      },
      {
        name: "variant",
        type: "'inherit' | ButtonVariant",
        defaultValue: "'inherit'",
        description: "Variant inheritance for child buttons. Use 'inherit' to keep button's own variant",
      },
      {
        name: "size",
        type: "'inherit' | ButtonSize",
        defaultValue: "'inherit'",
        description: "Size inheritance for child buttons. Use 'inherit' to keep button's own size",
      },
      {
        name: "segmented",
        type: "boolean",
        defaultValue: "false",
        description: "Whether buttons are segmented (pill-style with shared borders)",
      },
      {
        name: "attached",
        type: "boolean",
        defaultValue: "false",
        description: "Whether buttons are attached (no gaps, merged borders)",
      },
      {
        name: "fullWidth",
        type: "boolean",
        defaultValue: "false",
        description: "Whether the group takes full width of its container",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Whether the entire group is disabled (disables all child buttons)",
      },
      {
        name: "selectionMode",
        type: "'none' | 'single' | 'multiple'",
        defaultValue: "'none'",
        description: "Selection mode: none (no tracking), single (radio-style), or multiple (checkbox-style)",
      },
      {
        name: "value",
        type: "string | string[] | undefined",
        defaultValue: "undefined",
        description: "Controlled value for selected button(s). Single mode: string, Multiple mode: string[]",
      },
      {
        name: "onValueChange",
        type: "(value: string | string[]) => void",
        defaultValue: "-",
        description: "Callback fired when value changes. New API - emits the new value directly",
      },
      {
        name: "onUiChange",
        type: "(detail: ButtonGroupEventDetail) => void",
        defaultValue: "-",
        description: "Legacy callback fired when selection changes. Emits { value, selectionMode }",
      },
      {
        name: "onUiClick",
        type: "(detail: ButtonGroupEventDetail) => void",
        defaultValue: "-",
        description: "Proxy callback for child button click events",
      },
    ],
  },
};

export default buttonGroupStory;
