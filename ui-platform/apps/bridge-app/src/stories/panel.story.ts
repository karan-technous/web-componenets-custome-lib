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
    rounded: {
      type: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "full"],
      default: "md",
      description: "Border radius scale of panel corners",
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
        rounded: "md",
      },
      slots: {
        header: `<div style="font-weight: 600;">Header</div>`,
        default: `<div style="color: var(--ui-text-muted);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>`,
      },
    },
    Collapsible: {
      props: {
        collapsible: true,
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Collapsible Panel</div>`,
        default: `<div style="line-height: 1.6; color: var(--ui-text-muted);">Click the header to expand or collapse this panel.</div>`,
      },
    },
    Controlled: {
      props: {
        collapsible: true,
        expanded: true,
        variant: "outlined",
      },
      slots: {
        header: `<div style="font-weight: 600;">Controlled Panel</div>`,
        actions: `<span style="font-size: 12px; color: var(--ui-text-muted);">controlled</span>`,
        default: `<div style="line-height: 1.6; color: var(--ui-text-muted);">This panel is controlled externally via <code>expanded</code>.</div>`,
      },
    },
    Loading: {
      props: {
        loading: true,
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Loading Panel</div>`,
        default: `<div style="line-height: 1.6; color: var(--ui-text-muted);">Content is loading...</div>`,
      },
    },
    WithActions: {
      props: {
        collapsible: true,
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Amy Elsner</div>`,
        actions: `<button style="padding: 6px 10px; border: 1px solid var(--ui-border); border-radius: 8px; background: var(--ui-bg); color: var(--ui-text); cursor: pointer;" onclick="event.stopPropagation()">Action</button>`,
        default: `<div style="color: var(--ui-text-muted);">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>`,
        footer: `<div style="display:flex;justify-content:space-between;width:100%;color:var(--ui-text-muted);"><span>Profile</span><span>Updated 2 hours ago</span></div>`,
      },
    },
    LongContent: {
      props: {
        collapsible: true,
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Long Content</div>`,
        default: `<div style="line-height: 1.6; color: var(--ui-text-muted);"><p>Line 1 - Example content</p><p>Line 2 - Example content</p><p>Line 3 - Example content</p><p>Line 4 - Example content</p><p>Line 5 - Example content</p><p>Line 6 - Example content</p><p>Line 7 - Example content</p><p>Line 8 - Example content</p><p>Line 9 - Example content</p><p>Line 10 - Example content</p><p>Line 11 - Example content</p><p>Line 12 - Example content</p><p>Line 13 - Example content</p><p>Line 14 - Example content</p><p>Line 15 - Example content</p><p>Line 16 - Example content</p><p>Line 17 - Example content</p><p>Line 18 - Example content</p><p>Line 19 - Example content</p><p>Line 20 - Example content</p></div>`,
      },
    },
    Disabled: {
      props: {
        variant: "default",
        disabled: true,
        collapsible: true,
      },
      slots: {
        header: `<div style="font-weight: 600;">Disabled Panel</div>`,
        default: `<div style="line-height: 1.6; color: var(--ui-text-muted);">Set <code>disabled=true</code> from controls to test disabled behavior.</div>`,
      },
    },
    VariantOutlined: {
      props: {
        variant: "outlined",
        size: "md",
      },
      slots: {
        header: `<div style="font-weight: 600;">Outlined Variant</div>`,
        default: `<div style="color: var(--ui-text-muted);">Outlined has stronger border so variant change is clearly visible.</div>`,
      },
    },
    VariantElevated: {
      props: {
        variant: "elevated",
        size: "md",
      },
      slots: {
        header: `<div style="font-weight: 600;">Elevated Variant</div>`,
        default: `<div style="color: var(--ui-text-muted);">Elevated uses shadow to make panel lift from background.</div>`,
      },
    },
    SizeSmall: {
      props: {
        size: "sm",
        variant: "default",
        rounded: "md",
      },
      slots: {
        header: `<div style="font-weight: 600;">Small Size</div>`,
        default: `<div style="color: var(--ui-text-muted);">Compact padding and tighter typography.</div>`,
      },
    },
    SizeLarge: {
      props: {
        size: "lg",
        variant: "default",
        rounded: "md",
      },
      slots: {
        header: `<div style="font-weight: 600;">Large Size</div>`,
        default: `<div style="color: var(--ui-text-muted);">Large spacing with roomier content layout.</div>`,
      },
    },
    RoundedXS: {
      props: {
        rounded: "xs",
        variant: "default",
      },
      slots: {
        header: `<div style="font-weight: 600;">Rounded XS</div>`,
        default: `<div style="color: var(--ui-text-muted);">Extra small corner radius.</div>`,
      },
    },
    RoundedLG: {
      props: {
        rounded: "lg",
        variant: "elevated",
      },
      slots: {
        header: `<div style="font-weight: 600;">Rounded LG</div>`,
        default: `<div style="color: var(--ui-text-muted);">Large corner radius with elevated style.</div>`,
      },
    },
  },
};

export default panelStory;
