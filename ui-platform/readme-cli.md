# UI Platform CLI Guide

## Purpose

This guide explains how to:

- build the `ui-platform` package
- generate a tarball
- install that tarball into another React or Angular project
- verify auto-detection
- run `npx ui-platform init`

## What is inside the package

The published `ui-platform` tarball includes:

- `dist/web-components`
- `dist/react`
- `dist/angular`
- `dist/core`
- `dist/loader`
- `dist/components`
- `dist/types`
- `bin/cli.js`
- `scripts/detect.js`

Important:

- this is a single tarball package
- React and Angular wrapper files both exist inside the tarball
- auto-detection does not remove files from the tarball
- auto-detection only detects the consumer project and guides setup

## Detection logic

Framework detection checks the consumer project's `package.json` in this order:

1. Angular if `@angular/core` exists in `dependencies` or `devDependencies`
2. React if `react` exists in `dependencies` or `devDependencies`
3. Web Components otherwise

## Step 1: install workspace dependencies

From the `ui-platform` workspace root:

```bash
pnpm install
```

## Step 2: build all packages

Build everything and assemble the final root `dist`:

```bash
pnpm run build
```

This runs the workspace builds and then:

```bash
node scripts/build-all.js
```

## Step 3: create the tarball

Create the package tarball:

```bash
pnpm run pack:tarball
```

You can also run:

```bash
npm pack
```

After that, you should get a file like:

```bash
ui-platform-1.0.0.tgz
```

## Step 4: copy the tarball into another project

Copy `ui-platform-1.0.0.tgz` into the consumer project root.

Example consumer projects:

- `demo-react`
- `demo-angular`

Example final structure:

```bash
demo-react/
  package.json
  ui-platform-1.0.0.tgz
```

## Step 5: install the tarball in another project

### npm

Inside the consumer project:

```bash
npm install ./ui-platform-1.0.0.tgz
```

Then install the app dependencies:

```bash
npm install
```

Or install everything in one normal flow if `ui-platform` is already listed in `package.json`.

### pnpm

Inside the consumer project:

```bash
pnpm add ./ui-platform-1.0.0.tgz
```

Or if it is already in `package.json`:

```bash
pnpm install
```

## Step 6: allow postinstall for pnpm

If the consumer uses `pnpm` v10+, dependency scripts may be blocked by default.

If that happens, you will see a warning like:

```bash
Ignored build scripts: ui-platform
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

To allow `ui-platform` auto-detection to run during install, add this to the consumer project's `package.json`:

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["ui-platform"]
  }
}
```

Then run again:

```bash
pnpm install
```

You can also use:

```bash
pnpm approve-builds
```

## Step 7: verify automatic detection

When `postinstall` is allowed to run, the package executes:

```bash
node scripts/detect.js
```

Expected output in a React project:

```bash
[ui-platform] Detected: react
[ui-platform] Run: npx ui-platform init
```

Expected output in an Angular project:

```bash
[ui-platform] Detected: angular
[ui-platform] Run: npx ui-platform init
```

Expected output in a non-React and non-Angular project:

```bash
[ui-platform] Detected: web-components
[ui-platform] Run: npx ui-platform init
```

## Step 8: run the CLI manually

After install, run:

```bash
npx ui-platform init
```

The CLI:

1. reads the consumer project's `package.json`
2. detects the framework
3. checks the package manager
4. asks for confirmation
5. installs only missing peer dependencies

## React project test flow

### Consumer project package.json example

```json
{
  "name": "demo-react",
  "private": true,
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "ui-platform": "file:./ui-platform-1.0.0.tgz"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["ui-platform"]
  }
}
```

### Install

```bash
pnpm install
```

### Expected detection output

```bash
[ui-platform] Detected: react
[ui-platform] Run: npx ui-platform init
```

### Run CLI

```bash
npx ui-platform init
```

### Expected CLI behavior

- detects `react`
- checks `react` and `react-dom`
- installs them only if they are missing

### Runtime guard

If the React wrapper is used without React installed:

```bash
[ui-platform] React wrapper used but React is not installed.
Run: npm install react react-dom
```

## Angular project test flow

### Consumer project package.json example

```json
{
  "name": "demo-angular",
  "private": true,
  "dependencies": {
    "@angular/common": "^21.2.3",
    "@angular/core": "^21.2.3",
    "ui-platform": "file:./ui-platform-1.0.0.tgz"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["ui-platform"]
  }
}
```

### Install

```bash
pnpm install
```

### Expected detection output

```bash
[ui-platform] Detected: angular
[ui-platform] Run: npx ui-platform init
```

### Run CLI

```bash
npx ui-platform init
```

### Expected CLI behavior

- detects `angular`
- checks `@angular/core` and `@angular/common`
- installs them only if they are missing

### Runtime guard

If the Angular wrapper is used without Angular installed:

```bash
[ui-platform] Angular wrapper used but Angular is not installed.
Run: npm install @angular/core
```

## Web Components project test flow

### Consumer project package.json example

```json
{
  "name": "demo-web",
  "private": true,
  "dependencies": {
    "ui-platform": "file:./ui-platform-1.0.0.tgz"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["ui-platform"]
  }
}
```

### Install

```bash
pnpm install
```

### Expected detection output

```bash
[ui-platform] Detected: web-components
[ui-platform] Run: npx ui-platform init
```

### Run CLI

```bash
npx ui-platform init
```

### Expected CLI behavior

- detects `web-components`
- prints that no peer dependency installation is required

## Full end-to-end test example

### Build and pack in the workspace

```bash
cd C:\angular-web-component\web-componenets-custome-lib\ui-platform
pnpm install
pnpm run build
pnpm run pack:tarball
```

### Move to a React consumer app

```bash
cd C:\angular-web-component\use-tarball-file\demo-react
```

### Put the tarball in the app root and update package.json

```json
{
  "dependencies": {
    "ui-platform": "file:./ui-platform-1.0.0.tgz"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["ui-platform"]
  }
}
```

### Install

```bash
pnpm install
```

### Verify auto-detection

```bash
[ui-platform] Detected: react
[ui-platform] Run: npx ui-platform init
```

### Run manual setup

```bash
npx ui-platform init
```

## Important behavior

- `postinstall` only detects the consumer project
- `postinstall` never removes React or Angular folders from the installed tarball
- `postinstall` never rebuilds the package inside the consumer project
- `npx ui-platform init` is the command that performs guided setup
- for `pnpm`, consumer approval is required if build scripts are blocked
