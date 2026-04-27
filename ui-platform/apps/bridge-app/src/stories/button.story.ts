import type { StoryDefinition } from "../state/storyTypes";
import type { ButtonEventDetail } from "@karan9186/core";

const buttonStory: StoryDefinition = {
  id: "button",
  title: "Button",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "UiButton", childrenProp: "label" },
    angular: { exportName: "ButtonComponent", projectedProp: "label" },
    wc: { tagName: "ui-button", textProp: "label" },
  },
  props: {
    label: {
      type: "string",
      default: "",
      description: "Text content of the button",
    },
    variant: {
      type: "select",
      options: ["default", "secondary", "outline", "ghost", "destructive", "link"],
      default: "default",
      description: "Visual style variant following shadcn/ui patterns",
    },
    size: {
      type: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
      default: "default",
      description: "Button size preset including icon variants",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disables interaction and dims the button",
    },
    loading: {
      type: "boolean",
      default: false,
      description: "Shows a loading spinner alongside text",
    },
    fullWidth: {
      type: "boolean",
      default: false,
      description: "Makes the button take full width of its container",
    },
    animated: {
      type: "boolean",
      default: false,
      description: "Enables press animation (translateY + scale on click)",
    },
    rounded: {
      type: "select",
      options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
      default: "md",
      description: "Border radius size (none, sm, md, lg, xl, 2xl, full)",
    },
    iconLeft: {
      type: "string",
      default: "",
      description: "Icon name for left side (from lucide icons - e.g. 'plus', 'search', 'arrow-left')",
    },
    iconRight: {
      type: "string",
      default: "",
      description: "Icon name for right side (from lucide icons - e.g. 'arrow-right', 'check', 'x')",
    },
    icon: {
      type: "string",
      default: "",
      description: "Icon name for center (for icon-only buttons - e.g. 'search', 'plus', 'settings')",
    },
  },
  stories: {
    Default: {
      props: {
        label: "Get Started",
        variant: "default",
      },
      code: {
        react: `<UiButton variant={"default"}>Get Started</UiButton>`,
        angular: `<ui-button-angular [variant]="'default'">Get Started</ui-button-angular>`,
        wc: `<ui-button variant="default">Get Started</ui-button>`,
      },
    },
    Secondary: {
      props: {
        label: "Learn More",
        variant: "secondary",
      },
      code: {
        react: `<UiButton variant={"secondary"}>Learn More</UiButton>`,
        angular: `<ui-button-angular [variant]="'secondary'">Learn More</ui-button-angular>`,
        wc: `<ui-button variant="secondary">Learn More</ui-button>`,
      },
    },
    Outline: {
      props: {
        label: "View Details",
        variant: "outline",
      },
      code: {
        react: `<UiButton variant={"outline"}>View Details</UiButton>`,
        angular: `<ui-button-angular [variant]="'outline'">View Details</ui-button-angular>`,
        wc: `<ui-button variant="outline">View Details</ui-button>`,
      },
    },
    Ghost: {
      props: {
        label: "Ghost Button",
        variant: "ghost",
      },
      code: {
        react: `<UiButton variant={"ghost"}>Ghost Button</UiButton>`,
        angular: `<ui-button-angular [variant]="'ghost'">Ghost Button</ui-button-angular>`,
        wc: `<ui-button variant="ghost">Ghost Button</ui-button>`,
      },
    },
    Destructive: {
      props: {
        label: "Delete Item",
        variant: "destructive",
      },
      code: {
        react: `<UiButton variant={"destructive"}>Delete Item</UiButton>`,
        angular: `<ui-button-angular [variant]="'destructive'">Delete Item</ui-button-angular>`,
        wc: `<ui-button variant="destructive">Delete Item</ui-button>`,
      },
    },
    Link: {
      props: {
        label: "View Documentation",
        variant: "link",
      },
      code: {
        react: `<UiButton variant={"link"}>View Documentation</UiButton>`,
        angular: `<ui-button-angular [variant]="'link'">View Documentation</ui-button-angular>`,
        wc: `<ui-button variant="link">View Documentation</ui-button>`,
      },
    },
    Small: {
      props: {
        label: "Small Button",
        variant: "default",
        size: "sm",
      },
      code: {
        react: `<UiButton variant={"default"} size={"sm"}>Small Button</UiButton>`,
        angular: `<ui-button-angular [variant]="'default'" [size]="'sm'">Small Button</ui-button-angular>`,
        wc: `<ui-button variant="default" size="sm">Small Button</ui-button>`,
      },
    },
    Large: {
      props: {
        label: "Large Button",
        variant: "default",
        size: "lg",
      },
      code: {
        react: `<UiButton variant={"default"} size={"lg"}>Large Button</UiButton>`,
        angular: `<ui-button-angular [variant]="'default'" [size]="'lg'">Large Button</ui-button-angular>`,
        wc: `<ui-button variant="default" size="lg">Large Button</ui-button>`,
      },
    },
    ExtraSmall: {
      props: {
        label: "XS Button",
        variant: "default",
        size: "xs",
      },
      code: {
        react: `<UiButton variant={"default"} size={"xs"}>XS Button</UiButton>`,
        angular: `<ui-button-angular [variant]="'default'" [size]="'xs'">XS Button</ui-button-angular>`,
        wc: `<ui-button variant="default" size="xs">XS Button</ui-button>`,
      },
    },
    RoundedFull: {
      props: {
        label: "Pill Shape",
        variant: "default",
        rounded: "full",
      },
      code: {
        react: `<UiButton variant={"default"} rounded={"full"}>Pill Shape</UiButton>`,
        angular: `<ui-button-angular [variant]="'default'" [rounded]="'full'">Pill Shape</ui-button-angular>`,
        wc: `<ui-button variant="default" rounded="full">Pill Shape</ui-button>`,
      },
    },
    Animated: {
      props: {
        label: "Click Me (Animated)",
        variant: "default",
        animated: true,
      },
      code: {
        react: `<UiButton variant={"default"} animated={true}>Click Me (Animated)</UiButton>`,
        angular: `<ui-button-angular [variant]="'default'" [animated]="true">Click Me (Animated)</ui-button-angular>`,
        wc: `<ui-button variant="default" animated>Click Me (Animated)</ui-button>`,
      },
    },
    Loading: {
      props: {
        label: "Loading...",
        variant: "default",
        loading: true,
      },
      code: {
        react: `<UiButton variant={"default"} loading={true}>Loading...</UiButton>`,
        angular: `<ui-button-angular [variant]="'default'" [loading]="true">Loading...</ui-button-angular>`,
        wc: `<ui-button variant="default" loading>Loading...</ui-button>`,
      },
    },
    Disabled: {
      props: {
        label: "Disabled",
        variant: "default",
        disabled: true,
      },
      code: {
        react: `<UiButton variant={"default"} disabled={true}>Disabled</UiButton>`,
        angular: `<ui-button-angular [variant]="'default'" [disabled]="true">Disabled</ui-button-angular>`,
        wc: `<ui-button variant="default" disabled>Disabled</ui-button>`,
      },
    },
    FullWidth: {
      props: {
        label: "Full Width Button",
        variant: "default",
        fullWidth: true,
      },
      code: {
        react: `<UiButton variant={"default"} fullWidth={true}>Full Width Button</UiButton>`,
        angular: `<ui-button-angular [variant]="'default'" [fullWidth]="true">Full Width Button</ui-button-angular>`,
        wc: `<ui-button variant="default" full-width>Full Width Button</ui-button>`,
      },
    },
    WithLeftIcon: {
      props: {
        label: "Add New",
        variant: "default",
        iconLeft: "Plus",
      },
      code: {
        react: `<UiButton variant={"default"} iconLeft={"Plus"}>Add New</UiButton>`,
        angular: `<ui-button-angular [variant]="'default'" [iconLeft]="'Plus'">Add New</ui-button-angular>`,
        wc: `<ui-button variant="default" icon-left="Plus">Add New</ui-button>`,
      },
    },
    WithRightIcon: {
      props: {
        label: "Next",
        variant: "outline",
        iconRight: "ArrowRight",
      },
      code: {
        react: `<UiButton variant={"outline"} iconRight={"ArrowRight"}>Next</UiButton>`,
        angular: `<ui-button-angular [variant]="'outline'" [iconRight]="'ArrowRight'">Next</ui-button-angular>`,
        wc: `<ui-button variant="outline" icon-right="ArrowRight">Next</ui-button>`,
      },
    },
    WithBothIcons: {
      props: {
        label: "Search",
        variant: "secondary",
        iconLeft: "Search",
        iconRight: "ArrowRight",
      },
      code: {
        react: `<UiButton variant={"secondary"} iconLeft={"Search"} iconRight={"ArrowRight"}>Search</UiButton>`,
        angular: `<ui-button-angular [variant]="'secondary'" [iconLeft]="'Search'" [iconRight]="'ArrowRight'">Search</ui-button-angular>`,
        wc: `<ui-button variant="secondary" icon-left="Search" icon-right="ArrowRight">Search</ui-button>`,
      },
    },
    CustomCode: {
      props: {
        label: "Deploy Now",
        variant: "outline",
        size: "lg",
        rounded: "full",
        animated: true,
        iconLeft: "Rocket",
        iconRight: "ArrowRight",
      },
      code: {
        react: `<UiButton variant={"outline"} size={"lg"} rounded={"full"} animated={true} iconLeft={"Rocket"} iconRight={"ArrowRight"}>Deploy Now</UiButton>`,
        angular: `<ui-button-angular [variant]="'outline'" [size]="'lg'" [rounded]="'full'" [animated]="true" [iconLeft]="'Rocket'" [iconRight]="'ArrowRight'">Deploy Now</ui-button-angular>`,
        wc: `<ui-button variant="outline" size="lg" rounded="full" animated icon-left="Rocket" icon-right="ArrowRight">Deploy Now</ui-button>`,
      },
    },
    IconButton: {
      props: {
        icon: "Search",
        variant: "default",
        size: "icon",
      },
      code: {
        react: `<UiButton variant={"default"} size={"icon"} icon={"Search"} />`,
        angular: `<ui-button-angular [variant]="'default'" [size]="'icon'" [icon]="'Search'"></ui-button-angular>`,
        wc: `<ui-button variant="default" size="icon" icon="Search"></ui-button>`,
      },
    },
  },
  docs: {
    description:
      "Buttons trigger user actions and enable interaction. They communicate actionability and intent throughout the interface.\n\nThis modern button component follows shadcn/ui design patterns with support for multiple variants, sizes, states, and animations.\n\n- Use `default` for the main action in a view\n- Use `secondary` for supporting or alternative actions\n- Use `outline` for neutral or less-prominent choices\n- Use `ghost` for subtle actions that shouldn't draw attention\n- Use `destructive` for dangerous actions (delete, remove)\n- Use `link` for navigation-style actions\n\nKeep labels short and action-oriented (e.g. Save, Cancel, Continue).",
    examples: [
      {
        title: "Default",
        storyName: "Default",
        description:
          "The main call-to-action. Use for the single most important action on screen.",
        props: { variant: "default", label: "Get Started", disabled: false },
      },
      {
        title: "Secondary",
        storyName: "Secondary",
        description:
          "Supporting action with lower emphasis. Pairs well alongside a primary button.",
        props: { variant: "secondary", label: "Learn More", disabled: false },
      },
      {
        title: "Outline",
        storyName: "Outline",
        description:
          "Stroke-only button. Best for neutral or contextual actions on any background.",
        props: { variant: "outline", label: "View Details", disabled: false },
      },
      {
        title: "Ghost",
        storyName: "Ghost",
        description:
          "Subtle button with no background. Best for icon actions or secondary contexts.",
        props: { variant: "ghost", label: "Ghost Button", disabled: false },
      },
      {
        title: "Destructive",
        storyName: "Destructive",
        description:
          "Red-colored button for dangerous actions like delete or remove.",
        props: { variant: "destructive", label: "Delete Item", disabled: false },
      },
      {
        title: "Link",
        storyName: "Link",
        description:
          "Button styled as a link. Useful for navigation or secondary actions.",
        props: { variant: "link", label: "View Documentation", disabled: false },
      },
      {
        title: "Icon Button",
        storyName: "IconButton",
        description:
          "Square button optimized for icons. Use for icon-only actions.",
        props: { variant: "default", label: "🔔", size: "icon" },
      },
      {
        title: "Loading State",
        storyName: "Loading",
        description:
          "Shows a spinner and disables interaction during async operations.",
        props: { variant: "default", label: "Loading...", loading: true },
      },
      {
        title: "Custom Code",
        storyName: "CustomCode",
        description:
          "Exercises the transformed framework-specific code path with multiple props and projected button content.",
        props: {
          variant: "outline",
          size: "lg",
          rounded: "full",
          animated: true,
          label: "Deploy Now",
          iconLeft: "Rocket",
          iconRight: "ArrowRight",
        },
      },
    ],
    usage: {
      react: `import { UiButton, IconName } from "@karan9186/react";

// Basic usage
<UiButton variant="default">Get Started</UiButton>

// With loading state
<UiButton variant="default" loading>Loading...</UiButton>

// With icons (iconLeft/iconRight accept IconName)
<UiButton variant="default" iconLeft="plus">Add New</UiButton>
<UiButton variant="outline" iconRight="arrow-right">Next</UiButton>
<UiButton variant="secondary" iconLeft="search" iconRight="arrow-right">Search</UiButton>`,
      angular: `<!-- Basic usage -->
<ui-button-angular variant="default">Get Started</ui-button-angular>

<!-- With icons and all props -->
<ui-button-angular
  variant="secondary"
  size="lg"
  [animated]="true"
  [rounded]="true"
  [loading]="isLoading"
  (uiClick)="handleClick($event)"
>
  <span icon-left><lucide-icon name="Plus"></lucide-icon></span>
  Click Me
  <span icon-right><lucide-icon name="ArrowRight"></lucide-icon></span>
</ui-button-angular>

<!-- Using the directive -->
<button uiButton variant="default" size="md">Click Me</button>`,
      wc: `<!-- Basic usage -->
<ui-button variant="default">Get Started</ui-button>

<!-- With icons and all props -->
<ui-button
  variant="secondary"
  size="lg"
  animated="true"
  rounded="true"
  loading="true"
>
  <span slot="icon-left">👈</span>
  Click Me
  <span slot="icon-right">👉</span>
</ui-button>`,
    },
    api: [
      {
        name: "variant",
        type: "'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'",
        defaultValue: "'default'",
        description: "Visual style variant following shadcn/ui patterns",
      },
      {
        name: "size",
        type: "'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'",
        defaultValue: "'default'",
        description: "Button size preset including icon variants",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables interaction and dims the button",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description: "Shows a loading spinner alongside text",
      },
      {
        name: "fullWidth",
        type: "boolean",
        defaultValue: "false",
        description: "Makes the button take full width of its container",
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: "false",
        description: "Enables press animation (translateY + scale on click)",
      },
      {
        name: "rounded",
        type: "boolean",
        defaultValue: "false",
        description: "Uses pill/rounded shape instead of standard radius",
      },
      {
        name: "onUiClick",
        type: "(detail: ButtonEventDetail) => void",
        defaultValue: "-",
        description: "Callback fired on user click with event details",
      },
      {
        name: "onUiFocus",
        type: "() => void",
        defaultValue: "-",
        description: "Callback fired when button receives focus",
      },
      {
        name: "onUiBlur",
        type: "() => void",
        defaultValue: "-",
        description: "Callback fired when button loses focus",
      },
      {
        name: "icon-left",
        type: "slot",
        defaultValue: "-",
        description: "Slot for left-side icon",
      },
      {
        name: "icon-right",
        type: "slot",
        defaultValue: "-",
        description: "Slot for right-side icon",
      },
    ],
  },
};

export default buttonStory;
