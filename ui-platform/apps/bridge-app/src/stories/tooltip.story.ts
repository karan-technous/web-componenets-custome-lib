import type { StoryDefinition } from "../state/storyTypes";

const tooltipStory: StoryDefinition = {
  id: "tooltip",
  title: "Tooltip",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "Tooltip" },
    angular: { exportName: "UiTooltipComponent" },
    wc: { tagName: "ui-tooltip" },
  },
  props: {
    content: {
      type: "string",
      default: "Tooltip",
      description: "Simple text content for the tooltip",
    },
    position: {
      type: "select",
      options: ["top", "bottom", "left", "right"],
      default: "top",
      description: "Preferred tooltip placement relative to the trigger",
    },
    trigger: {
      type: "select",
      options: ["hover", "click", "focus"],
      default: "hover",
      description: "Interaction that opens the tooltip",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disables tooltip behavior entirely",
    },
    delay: {
      type: "string",
      default: "150",
      description: "Delay in milliseconds before opening on hover",
    },
    variant: {
      type: "select",
      options: ["simple"],
      default: "simple",
      description: "Simple text tooltip or richer slot-based content",
    },
  },
  stories: {
    Default: {
      code: {
        react: `<Tooltip content="Hello"><ui-button>Hover me</ui-button></Tooltip>`,
        angular: `<ui-tooltip-angular [content]="'Hello'"><ui-button>Hover me</ui-button></ui-tooltip-angular>`,
        wc: `<ui-tooltip content="Hello"><ui-button>Hover me</ui-button></ui-tooltip>`,
      },
    },
    ClickTrigger: {
      code: {
        react: `<Tooltip content="Hello" position="bottom" trigger="click"><ui-button>Click me</ui-button></Tooltip>`,
        angular: `<ui-tooltip-angular [content]="'Hello'" [position]="'bottom'" [trigger]="'click'"><ui-button>Click me</ui-button></ui-tooltip-angular>`,
        wc: `<ui-tooltip content="Hello" position="bottom" trigger="click"><ui-button>Click me</ui-button></ui-tooltip>`,
      },
    },
    FocusTrigger: {
      code: {
        react: `<Tooltip content="Hello" position="right" trigger="focus"><ui-button>Focus me</ui-button></Tooltip>`,
        angular: `<ui-tooltip-angular [content]="'Hello'" [position]="'right'" [trigger]="'focus'"><ui-button>Focus me</ui-button></ui-tooltip-angular>`,
        wc: `<ui-tooltip content="Hello" position="right" trigger="focus"><ui-button>Focus me</ui-button></ui-tooltip>`,
      },
    },
  },
  docs: {
    description:
      "Tooltip provides contextual help and status details without disturbing layout. It supports hover, focus, and click triggers with simple text or richer content.",
    usage: {
      react: `<Tooltip content="Hello"><ui-button>Hover me</ui-button></Tooltip>`,
      angular: `<ui-tooltip-angular [content]="'Hello'"><ui-button>Hover me</ui-button></ui-tooltip-angular>`,
      wc: `<ui-tooltip content="Hello"><ui-button>Hover me</ui-button></ui-tooltip>`,
    },
  },
};

export default tooltipStory;
