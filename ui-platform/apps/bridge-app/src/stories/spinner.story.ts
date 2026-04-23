import type { StoryDefinition } from "../state/storyTypes";

const spinnerStory: StoryDefinition = {
  id: "spinner",
  title: "Spinner",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "UiSpinner" },
    angular: { exportName: "SpinnerComponent" },
    wc: { tagName: "ui-spinner" },
  },
  props: {
    variant: {
      type: "select",
      default: "circular",
      options: ["circular", "dots", "bars", "pulse", "ring"],
      description: "Animation variant style",
    },
    size: {
      type: "select",
      default: "md",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the spinner (preset)",
    },
    customSize: {
      type: "string",
      default: "24",
      description: "Custom size in pixels (overrides size prop)",
    },
    speed: {
      type: "select",
      default: "normal",
      options: ["slow", "normal", "fast"],
      description: "Animation speed",
    },
    customSpeed: {
      type: "string",
      default: "1",
      description: "Custom speed in seconds (overrides speed prop)",
    },
    color: {
      type: "string",
      default: "",
      description: "Primary color (CSS color value)",
    },
    trackColor: {
      type: "string",
      default: "",
      description: "Background/track color (CSS color value)",
    },
    loading: {
      type: "boolean",
      default: true,
      description: "Whether the spinner is visible",
    },
    overlay: {
      type: "boolean",
      default: false,
      description: "Display as fullscreen/container overlay",
    },
    inline: {
      type: "boolean",
      default: false,
      description: "Display inline with text (no flex center)",
    },
    center: {
      type: "boolean",
      default: false,
      description: "Center the spinner in its container",
    },
    label: {
      type: "string",
      default: "",
      description: "Primary label text (e.g., 'Loading...')",
    },
    subLabel: {
      type: "string",
      default: "",
      description: "Secondary label text (e.g., 'Please wait')",
    },
  },
  stories: {
    Default: {
      props: {
        variant: "circular",
        size: "md",
        loading: true,
      },
    },
    "Variants Showcase": {
      props: {
        loading: true,
        variant: "dots",
      },
    },
    Sizes: {
      props: {
        loading: true,
        size: "lg",
      },
    },
    Colors: {
      props: {
        loading: true,
        color: "red",
      },
    },
    "Speed Variations": {
      props: {
        loading: true,
        speed: "slow",
      },
    },
    "With Label": {
      props: {
        loading: true,
        label: "Loading...",
      },
    },
    "With SubLabel": {
      props: {
        loading: true,
        label: "Loading data",
        subLabel: "Please wait while we process your request",
      },
    },
    "Inline Usage": {
      props: {
        loading: true,
        inline: true,
        size: "sm",
      },
    },
    "Centered Spinner": {
      props: {
        loading: true,
        center: true,
        label: "Loading...",
      },
    },
    "Overlay Mode": {
      props: {
        loading: true,
        overlay: true,
        label: "Loading...",
      },
    },
    "Toggle Loading State": {
      props: {
        loading: true,
        label: "Loading data...",
      },
    },
  },
  docs: {
    description:
      "Spinner component provides visual feedback during loading states. Supports multiple animation variants (circular, dots, bars, pulse, ring), customizable sizes, colors, and speeds. Can be used inline, centered, or as an overlay. Fully accessible with proper ARIA attributes.",
    usage: {
      react: `<UiSpinner variant="circular" size="md" loading={true} label="Loading..." />`,
      angular: `<ui-spinner-angular variant="circular" size="md" [loading]="true" label="Loading..."></ui-spinner-angular>`,
      wc: `<ui-spinner variant="circular" size="md" loading label="Loading..."></ui-spinner>`,
    },
    examples: [
      {
        title: "Basic Usage",
        description: `<UiSpinner variant="circular" size="md" />`,
      },
      {
        title: "With Label",
        description: `<UiSpinner variant="circular" size="md" label="Loading data..." />`,
      },
      {
        title: "Inline",
        description: `<UiSpinner variant="dots" size="sm" inline /> Loading...`,
      },
      {
        title: "Overlay",
        description: `<UiSpinner variant="circular" size="md" overlay label="Loading..." />`,
      },
      {
        title: "Custom Color",
        description: `<UiSpinner variant="circular" size="md" color="#3b82f6" />`,
      },
      {
        title: "Different Variants",
        description: `<UiSpinner variant="dots" size="md" />`,
      },
    ],
  },
};

export default spinnerStory;
