# Story Authoring Guide

## Goal
Add a new component by creating only one file in:

`apps/bridge-app/src/stories/*.story.ts`

No other bridge/sidebar/control/store edits are required.

## File Template
```ts
import type { StoryDefinition } from "../state/storyTypes";

const myStory: StoryDefinition = {
  id: "my-component",
  title: "My Component",
  framework: ["react", "angular", "wc"],
  renderers: {
    react: { exportName: "UiMyComponent", childrenProp: "label" },
    angular: { exportName: "MyComponentComponent", projectedProp: "label" },
    wc: { tagName: "ui-my-component", textProp: "label" },
  },
  props: {
    label: {
      type: "string",
      default: "Hello",
      description: "Visible text",
    },
    variant: {
      type: "select",
      options: ["primary", "secondary"],
      default: "primary",
      description: "Visual style",
    },
    disabled: {
      type: "boolean",
      default: false,
      description: "Disable interaction",
    },
  },
  stories: {
    Default: { props: {} },
    Secondary: { props: { variant: "secondary" } },
  },
  docs: {
    description: "Markdown supported description.",
    examples: [
      { title: "Primary", props: { variant: "primary", label: "Primary" } },
      { title: "Secondary", props: { variant: "secondary", label: "Secondary" } },
    ],
    usage: {
      react: `<UiMyComponent variant="primary">Click</UiMyComponent>`,
      angular: `<ui-my-component-angular [variant]="'primary'"></ui-my-component-angular>`,
      wc: `<ui-my-component variant="primary"></ui-my-component>`,
    },
  },
};

export default myStory;
```

## Required Fields
- `id`: stable component key used in payload/renderer lookup
- `title`: sidebar label
- `framework`: supported renderers (`react`, `angular`, `wc`)
- `props`: control schema (type/default/options/description)

## Optional Fields
- `renderers.react.exportName`: explicit export from `@karan9186/react`
- `renderers.react.childrenProp`: prop to map as React children
- `renderers.angular.exportName`: explicit export from `@karan9186/angular`
- `renderers.angular.projectedProp`: prop mapped to projected content
- `renderers.wc.tagName`: custom element tag
- `renderers.wc.textProp`: prop mapped to `textContent`
- `stories`: named variants; each merges with prop defaults
- `docs.description`: Markdown description shown in Docs mode
- `docs.examples`: live examples rendered in Docs mode
- `docs.usage`: usage snippets per framework (`react`/`angular`/`wc`)

## Control Types
- `string` -> text input
- `select` -> dropdown (requires `options`)
- `boolean` -> checkbox

## Naming Fallbacks (if no explicit renderer export provided)
- React: tries `Ui${PascalCase(id)}`, then `${PascalCase(id)}`
- Angular: tries `${PascalCase(id)}Component`, then `Ui${PascalCase(id)}Component`
- WC: defaults to `ui-${id}`

## Verify
1. `pnpm dev`
2. Open bridge app
3. New component appears in sidebar automatically
4. Controls and variants render automatically in all selected frameworks
