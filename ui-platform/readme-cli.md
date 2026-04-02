# UI Library CLI

`ui-library` is the base package for the design system.

For step-by-step consumer setup, see [usage-react-angular.md](./usage-react-angular.md).

It installs only:

- `@ui-library/core`
- `@ui-library/web-components`

It does not install framework wrappers during `npm install`.

## Commands

### Initialize a project

```bash
npx ui-library init
```

The command:

1. reads the current project's `package.json`
2. detects `react`, `@angular/core`, or falls back to a prompt
3. detects the package manager from `pnpm-lock.yaml`, `yarn.lock`, or defaults to npm
4. installs only the required framework wrapper:
   - React: `@ui-library/react`
   - Angular: `@ui-library/angular`
   - Vanilla: no additional install

### Add a component

```bash
npx ui-library add button
```

The component registry is intentionally simple today. It verifies the framework package is present and prints the import or usage hint for that component. This keeps the CLI surface stable for future component-level packages.

## Package Layout

```text
packages/
  core/
  web-components/
  react/
  angular/

meta/
  ui-library/
    cli.js
    package.json
```

## Examples

React project:

```bash
npm install ui-library
npx ui-library init
```

Output:

```text
[ui-library] Detected React from package.json.
[ui-library] Installed @ui-library/react.
[ui-library] Import wrappers from "@ui-library/react".
```

Vanilla project:

```bash
npm install ui-library
npx ui-library init --framework vanilla
```

Output:

```text
[ui-library] Vanilla project detected. The base package already includes web components.
[ui-library] Import web components from "ui-library/web-components" and the loader from "ui-library/loader".
```

## Important Rules

- no `postinstall`
- no wrapper auto-installs during package install
- no `optionalDependencies` trick for framework wrappers
- no duplicate wrapper installation when the dependency is already declared
