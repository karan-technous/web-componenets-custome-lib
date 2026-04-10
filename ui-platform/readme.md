# UI Platform Project Structure

This document lists the full current file and folder structure of the `ui-platform` workspace.

```text
ui-platform/
|-- .gitignore
|-- .npmrc
|-- apps/
|   |-- angular-renderer/
|   |   |-- angular.json
|   |   |-- package.json
|   |   |-- src/
|   |   |   |-- app/
|   |   |   |   \-- app.component.ts
|   |   |   |-- index.html
|   |   |   |-- main.ts
|   |   |   \-- styles.css
|   |   |-- tsconfig.app.json
|   |   \-- tsconfig.json
|   |-- bridge-app/
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- postcss.config.js
|   |   |-- src/
|   |   |   |-- App.tsx
|   |   |   |-- components/
|   |   |   |   |-- ActionsPanel.tsx
|   |   |   |   |-- BottomPanel.tsx
|   |   |   |   |-- ControlsTable.tsx
|   |   |   |   |-- PreviewCanvas.tsx
|   |   |   |   |-- Sidebar.tsx
|   |   |   |   \-- Toolbar.tsx
|   |   |   |-- docs/
|   |   |   |   \-- DocsPage.tsx
|   |   |   |-- index.css
|   |   |   |-- main.tsx
|   |   |   |-- state/
|   |   |   |   |-- frameworkStore.ts
|   |   |   |   |-- storyStore.ts
|   |   |   |   \-- storyTypes.ts
|   |   |   |-- stories/
|   |   |   |   |-- button.story.ts
|   |   |   |   |-- checkbox.story.ts
|   |   |   |   |-- input.story.ts
|   |   |   |   \-- toggle.story.ts
|   |   |   |-- theme.css
|   |   |   \-- theme/
|   |   |       \-- themeManager.ts
|   |   |-- STORY_AUTHORING.md
|   |   |-- tailwind.config.js
|   |   |-- tsconfig.json
|   |   |-- tsconfig.tsbuildinfo
|   |   \-- vite.config.ts
|   |-- react-renderer/
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- src/
|   |   |   |-- App.js
|   |   |   |-- App.tsx
|   |   |   |-- main.js
|   |   |   |-- main.tsx
|   |   |   \-- theme.css
|   |   |-- tsconfig.json
|   |   |-- tsconfig.tsbuildinfo
|   |   \-- vite.config.ts
|   \-- wc-renderer/
|       |-- index.html
|       |-- package.json
|       |-- src/
|       |   |-- main.js
|       |   |-- main.ts
|       |   \-- theme.css
|       |-- tsconfig.json
|       |-- tsconfig.tsbuildinfo
|       \-- vite.config.ts
|-- meta/
|   \-- karan9186/
|       |-- cli.js
|       |-- core.d.ts
|       |-- core.js
|       |-- loader.d.ts
|       |-- loader.js
|       |-- package.json
|       |-- web-components.d.ts
|       \-- web-components.js
|-- package.json
|-- packages/
|   |-- angular/
|   |   |-- .editorconfig
|   |   |-- .gitignore
|   |   |-- angular.json
|   |   |-- package.json
|   |   |-- projects/
|   |   |   \-- ui-lib/
|   |   |       |-- ng-package.json
|   |   |       |-- package.json
|   |   |       |-- README.md
|   |   |       |-- src/
|   |   |       |   |-- lib/
|   |   |       |   |   |-- button/
|   |   |       |   |   |   |-- button.component.html
|   |   |       |   |   |   \-- button.component.ts
|   |   |       |   |   |-- checkbox/
|   |   |       |   |   |   |-- checkbox.component.html
|   |   |       |   |   |   \-- checkbox.component.ts
|   |   |       |   |   |-- input/
|   |   |       |   |   |   |-- input.component.html
|   |   |       |   |   |   \-- input.component.ts
|   |   |       |   |   |-- register-custom-elements.ts
|   |   |       |   |   |-- toggle/
|   |   |       |   |   |   |-- toggle.component.html
|   |   |       |   |   |   \-- toggle.component.ts
|   |   |       |   |   |-- ui-lib.module.ts
|   |   |       |   |   |-- ui-lib.spec.ts
|   |   |       |   |   \-- ui-lib.ts
|   |   |       |   \-- public-api.ts
|   |   |       |-- tsconfig.lib.json
|   |   |       |-- tsconfig.lib.prod.json
|   |   |       \-- tsconfig.spec.json
|   |   |-- README.md
|   |   \-- tsconfig.json
|   |-- core/
|   |   |-- package.json
|   |   |-- src/
|   |   |   |-- index.ts
|   |   |   \-- theme/
|   |   |       |-- theme.ts
|   |   |       \-- theme-manager.ts
|   |   \-- tsconfig.json
|   |-- react/
|   |   |-- package.json
|   |   |-- src/
|   |   |   |-- components/
|   |   |   |   |-- button/
|   |   |   |   |   |-- Button.tsx
|   |   |   |   |   \-- index.ts
|   |   |   |   |-- checkbox/
|   |   |   |   |   |-- Checkbox.tsx
|   |   |   |   |   \-- index.ts
|   |   |   |   |-- input/
|   |   |   |   |   |-- index.ts
|   |   |   |   |   \-- Input.tsx
|   |   |   |   \-- toggle/
|   |   |   |       |-- index.ts
|   |   |   |       \-- Toggle.tsx
|   |   |   |-- index.ts
|   |   |   |-- setup.ts
|   |   |   \-- types/
|   |   |       \-- web-components.d.ts
|   |   \-- tsconfig.json
|   \-- web-components/
|       |-- .editorconfig
|       |-- .gitignore
|       |-- .prettierrc.json
|       |-- LICENSE
|       |-- package.json
|       |-- readme.md
|       |-- src/
|       |   |-- components.d.ts
|       |   |-- components/
|       |   |   |-- icons/
|       |   |   |   \-- icon.registry.ts
|       |   |   |-- ui-button/
|       |   |   |   |-- readme.md
|       |   |   |   |-- ui-button.css
|       |   |   |   \-- ui-button.tsx
|       |   |   |-- ui-checkbox/
|       |   |   |   |-- readme.md
|       |   |   |   |-- ui-checkbox.css
|       |   |   |   \-- ui-checkbox.tsx
|       |   |   |-- ui-icon/
|       |   |   |   |-- readme.md
|       |   |   |   |-- ui-icon.css
|       |   |   |   \-- ui-icon.tsx
|       |   |   |-- ui-input/
|       |   |   |   |-- readme.md
|       |   |   |   |-- ui-input.css
|       |   |   |   \-- ui-input.tsx
|       |   |   \-- ui-toggle/
|       |   |       |-- readme.md
|       |   |       |-- ui-toggle.css
|       |   |       \-- ui-toggle.tsx
|       |   |-- index.html
|       |   |-- index.ts
|       |   |-- theme.cmp.test.ts
|       |   |-- theme.ts
|       |   |-- theme.unit.test.ts
|       |   \-- utils/
|       |       |-- utils.ts
|       |       \-- utils.unit.test.ts
|       |-- stencil.config.ts
|       |-- tsconfig.json
|       |-- vitest.config.ts
|       \-- vitest-setup.ts
|-- pnpm-workspace.yaml
|-- readme.md
|-- readme-cli.md
|-- scripts/
|   |-- build-all.js
|   |-- prepare-publish.js
|   \-- publish-packages.js
|-- test/
|   |-- angular-test/
|   |   |-- .editorconfig
|   |   |-- .gitignore
|   |   |-- angular.json
|   |   |-- package.json
|   |   |-- public/
|   |   |   \-- favicon.ico
|   |   |-- README.md
|   |   |-- src/
|   |   |   |-- app/
|   |   |   |   |-- app.config.ts
|   |   |   |   |-- app.css
|   |   |   |   |-- app.html
|   |   |   |   |-- app.routes.ts
|   |   |   |   |-- app.spec.ts
|   |   |   |   |-- app.ts
|   |   |   |   \-- test/
|   |   |   |       |-- button-test/
|   |   |   |       |   |-- button-test.css
|   |   |   |       |   |-- button-test.html
|   |   |   |       |   |-- button-test.spec.ts
|   |   |   |       |   \-- button-test.ts
|   |   |   |       \-- input-test/
|   |   |   |           |-- input-test.css
|   |   |   |           |-- input-test.html
|   |   |   |           |-- input-test.spec.ts
|   |   |   |           \-- input-test.ts
|   |   |   |-- index.html
|   |   |   |-- main.ts
|   |   |   \-- styles.css
|   |   |-- tsconfig.app.json
|   |   |-- tsconfig.json
|   |   \-- tsconfig.spec.json
|   \-- react-test/
|       |-- .gitignore
|       |-- eslint.config.js
|       |-- index.html
|       |-- package.json
|       |-- package-lock.json
|       |-- public/
|       |   |-- favicon.svg
|       |   \-- icons.svg
|       |-- README.md
|       |-- src/
|       |   |-- App.css
|       |   |-- App.tsx
|       |   |-- assets/
|       |   |   |-- hero.png
|       |   |   |-- react.svg
|       |   |   \-- vite.svg
|       |   |-- index.css
|       |   |-- main.tsx
|       |   \-- test/
|       |       |-- checkbox.test.tsx
|       |       |-- input.test.tsx
|       |       \-- toggle.test.tsx
|       |-- tsconfig.app.json
|       |-- tsconfig.json
|       |-- tsconfig.node.json
|       \-- vite.config.ts
\-- usage-react-angular.md
```
