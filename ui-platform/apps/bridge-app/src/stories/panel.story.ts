import type { StoryDefinition } from "../state/storyTypes";

const panelStory: StoryDefinition = {
  id: "panel",
  title: "Panel",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "Panel", childrenProp: "children" },
    angular: { exportName: "UiPanelComponent", projectedProp: "children" },
    wc: { tagName: "ui-panel", textProp: "children" },
  },
  props: {
    variant: {
      type: "select",
      options: ["default", "outlined", "elevated"],
      default: "default",
      description: "Visual variant of the panel",
    },
    size: {
      type: "select",
      options: ["sm", "md", "lg"],
      default: "md",
      description: "Size of the panel",
    },
    collapsible: {
      type: "boolean",
      default: false,
      description: "Whether the panel is collapsible",
    },
    expanded: {
      type: "boolean",
      default: true,
      description: "Expanded state (controlled)",
    },
    defaultExpanded: {
      type: "boolean",
      default: true,
      description: "Default expanded state (uncontrolled)",
    },
    loading: {
      type: "boolean",
      default: false,
      description: "Whether the panel is in loading state",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Whether the panel is disabled",
    },
  },
  stories: {
    Default: {
      props: {
        variant: "default",
        size: "md",
      },
      slots: {
        header: `<div style="font-weight: 600;">Panel Title</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This is a sample panel content. You can place any UI here such as text, forms, tables, or other components.</div>`,
        footer: `<div style="display: flex; justify-content: flex-end; gap: 8px;"><ui-button>Cancel</ui-button><ui-button>Save</ui-button></div>`,
      },
    },
    WithHeader: {
      props: {
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Panel with Header</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This panel has a header section. The content should be visible with this text.</div>`,
      },
    },
    WithHeaderAndFooter: {
      props: {
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Panel with Header and Footer</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This panel has both a header and footer section. The panel should be visible with this content.</div>`,
        footer: `<div style="display: flex; justify-content: flex-end; gap: 8px;"><button>Cancel</button><button style="background: var(--ui-primary); color: #fff;">Save</button></div>`,
      },
    },
    WithActions: {
      props: {
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Panel with Actions</div>`,
        actions: `<button>⋯</button>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This panel has action buttons in the header. The panel should be visible with this text.</div>`,
      },
    },
    Collapsible: {
      props: {
        collapsible: true,
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Collapsible Panel</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">Click the header to collapse or expand this panel. The panel should be visible with this text content.</div>`,
      },
    },
    CollapsibleDefaultCollapsed: {
      props: {
        collapsible: true,
        defaultExpanded: false,
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Collapsed by Default</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This panel starts in a collapsed state. Click the header to expand it and see this content.</div>`,
      },
    },
    Loading: {
      props: {
        loading: true,
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Loading Panel</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This panel is in a loading state with an overlay. The content should be visible underneath the loading spinner.</div>`,
      },
    },
    Disabled: {
      props: {
        disabled: true,
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Disabled Panel</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This panel is disabled and cannot be interacted with. The panel should still be visible with this text content.</div>`,
      },
    },
    Outlined: {
      props: {
        variant: "outlined",
      },
      slots: {
        header: `<div style="font-weight: 600;">Outlined Panel</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This panel has an outlined border style. The panel should be visible with this content.</div>`,
      },
    },
    Elevated: {
      props: {
        variant: "elevated",
      },
      slots: {
        header: `<div style="font-weight: 600;">Elevated Panel</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This panel has a shadow/elevated style. The panel should be visible with this text content.</div>`,
      },
    },
    Small: {
      props: {
        size: "sm",
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Small Panel</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This panel has a smaller size. The panel should be visible with this text content.</div>`,
      },
    },
    Large: {
      props: {
        size: "lg",
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Large Panel</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This panel has a larger size. The panel should be visible with this text content.</div>`,
      },
    },
    LongContent: {
      props: {
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Panel with Long Content</div>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">This panel has a lot of content to test scrolling behavior. The panel should be visible with this text content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>`,
      },
    },
    Playground: {
      props: {
        variant: "default",
        size: "md",
        collapsible: false,
        loading: false,
        disabled: false,
      },
      slots: {
        header: `<div style="font-weight: 600;">Playground</div>`,
        actions: `<button>⋯</button>`,
        default: `<div style="padding: 8px 0; color: var(--ui-text-muted);">Customize the panel using the controls on the right. The panel should be visible with this text content.</div>`,
        footer: `<div style="display: flex; justify-content: flex-end; gap: 8px;"><button>Cancel</button><button style="background: var(--ui-primary); color: #fff;">Save</button></div>`,
      },
    },
  },
};

export default panelStory;
