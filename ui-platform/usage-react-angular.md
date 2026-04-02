# UI Library Consumer Setup

This guide shows how to use `ui-library` in a React project or an Angular project.

## What gets installed

When you install the base package:

```bash
npm install ui-library
```

you get:

- `@ui-library/core`
- `@ui-library/web-components`

Framework wrappers are installed only when you run the CLI setup command.

## React Setup

### 1. Create or open a React project

Example:

```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
```

### 2. Install the base package

With npm:

```bash
npm install ui-library
```

With pnpm:

```bash
pnpm add ui-library
```

With yarn:

```bash
yarn add ui-library
```

### 3. Install the React wrapper

Run:

```bash
npx ui-library init
```

The CLI detects `react` in `package.json` and installs:

```bash
@ui-library/react
```

### 4. Import React wrappers

Example `src/App.tsx`:

```tsx
import { UiButton, UiInput, Toggle } from "@ui-library/react";

export default function App() {
  return (
    <div>
      <UiInput value="" onChange={(value) => console.log(value)} />
      <UiButton onClick={() => console.log("clicked")}>Save</UiButton>
      <Toggle />
    </div>
  );
}
```

### 5. Run the app

```bash
npm run dev
```

Notes:

- `@ui-library/react` already handles custom element registration.
- You do not need to call `defineCustomElements()` manually in React.

## Angular Setup

### 1. Create or open an Angular project

Example:

```bash
npx @angular/cli new my-angular-app
cd my-angular-app
```

### 2. Install the base package

With npm:

```bash
npm install ui-library
```

With pnpm:

```bash
pnpm add ui-library
```

With yarn:

```bash
yarn add ui-library
```

### 3. Install the Angular wrapper

Run:

```bash
npx ui-library init
```

The CLI detects `@angular/core` in `package.json` and installs:

```bash
@ui-library/angular
```

### 4. Import Angular components

Example `src/app/app.ts` for a standalone component:

```ts
import { Component } from "@angular/core";
import { ButtonComponent, InputComponent, UiToggleComponent } from "@ui-library/angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ButtonComponent, InputComponent, UiToggleComponent],
  template: `
    <ui-button>Save</ui-button>
    <ui-input></ui-input>
    <ui-toggle></ui-toggle>
  `
})
export class AppComponent {}
```

### 5. Run the app

```bash
npm start
```

Notes:

- `@ui-library/angular` already ensures the custom elements are registered.
- For standalone usage, import the wrapper components into the Angular component where you use them.

## Common Commands

Install the correct wrapper:

```bash
npx ui-library init
```

Add a component and get the import hint:

```bash
npx ui-library add button
```

Force a framework when auto-detection is not enough:

```bash
npx ui-library init --framework react
npx ui-library init --framework angular
```

## Troubleshooting

### No `package.json`

Run the CLI from the root of your app.

### Both React and Angular are present

The CLI asks which framework to configure.

### Wrapper already installed

The CLI does not reinstall it.

### Vanilla project

No extra wrapper is installed. Use:

- `ui-library/web-components`
- `ui-library/loader`
