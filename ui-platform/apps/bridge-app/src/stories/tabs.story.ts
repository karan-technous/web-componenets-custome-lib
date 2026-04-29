import type { StoryDefinition } from "../state/storyTypes";

const tabsStory: StoryDefinition = {
  id: "tabs",
  title: "Tabs",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "Tabs" },
    angular: { exportName: "UiTabsComponent" },
    wc: { tagName: "ui-tabs" },
  },
  props: {
    tabs: {
      type: "string",
      default: '[{"key":"overview","label":"Overview"},{"key":"details","label":"Details"},{"key":"settings","label":"Settings"}]',
      description: "JSON string array of tab items with key and label",
    },
    activeIndex: {
      type: "string",
      default: "0",
      description: "Currently active tab index as string (controlled)",
    },
    defaultActiveIndex: {
      type: "string",
      default: "0",
      description: "Default active tab index as string (uncontrolled)",
    },
    scrollable: {
      type: "boolean",
      default: false,
      description: "Enable horizontal scrolling for tabs",
    },
    tagColor: {
      type: "string",
      default: "blue",
      description: "Color for tab tags/badges",
    },
  },
  stories: {
    Default: {
      props: {
        tabs: '[{"key":"overview","label":"Overview"},{"key":"details","label":"Details"},{"key":"settings","label":"Settings"}]',
        activeIndex: "0",
      },
    },
    WithIcons: {
      props: {
        tabs: '[{"key":"home","label":"Home","icon":"home"},{"key":"profile","label":"Profile","icon":"user"},{"key":"settings","label":"Settings","icon":"settings"}]',
        activeIndex: "0",
      },
    },
    Scrollable: {
      props: {
        tabs: '[{"key":"tab1","label":"Tab 1"},{"key":"tab2","label":"Tab 2"},{"key":"tab3","label":"Tab 3"},{"key":"tab4","label":"Tab 4"},{"key":"tab5","label":"Tab 5"},{"key":"tab6","label":"Tab 6"},{"key":"tab7","label":"Tab 7"},{"key":"tab8","label":"Tab 8"},{"key":"tab9","label":"Tab 9"},{"key":"tab10","label":"Tab 10"}]',
        activeIndex: "0",
        scrollable: true,
      },
    },
    WithDisabledTab: {
      props: {
        tabs: '[{"key":"active","label":"Active"},{"key":"disabled","label":"Disabled","disabled":true},{"key":"enabled","label":"Enabled"}]',
        activeIndex: "0",
      },
    },
    WithCustomColor: {
      props: {
        tabs: '[{"key":"red","label":"Red Tab"},{"key":"green","label":"Green Tab"},{"key":"blue","label":"Blue Tab"}]',
        activeIndex: "0",
        tagColor: "red",
      },
    },
    ManyTabs: {
      props: {
        tabs: JSON.stringify(Array.from({ length: 15 }, (_, i) => ({
          key: `tab-${i + 1}`,
          label: `Tab ${i + 1}`,
        }))),
        activeIndex: "0",
        scrollable: true,
      },
    },
  },
};

export default tabsStory;
