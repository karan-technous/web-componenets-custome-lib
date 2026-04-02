import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

async function build() {
  await fs.remove(path.join(root, "dist"));

  await fs.copy(
    path.join(root, "packages/web-components/dist"),
    path.join(root, "dist")
  );
  await fs.copy(
    path.join(root, "packages/react/dist"),
    path.join(root, "dist/react")
  );
  await fs.copy(
    path.join(root, "packages/angular/dist/ui-lib"),
    path.join(root, "dist/angular/ui-lib")
  );
  await fs.copy(
    path.join(root, "packages/core/dist"),
    path.join(root, "dist/core")
  );

  await rewriteLoaderImportsForUnifiedTarball(path.join(root, "dist/react"));
  await rewriteLoaderImportsForUnifiedTarball(
    path.join(root, "dist/angular/ui-lib")
  );
  await createGuardedFrameworkEntrypoints();

  console.log("Unified dist ready");
}

async function createGuardedFrameworkEntrypoints() {
  await createReactGuardEntrypoint(path.join(root, "dist/react"));
  await createAngularGuardEntrypoint(path.join(root, "dist/angular"));
}

async function createReactGuardEntrypoint(reactDistDir) {
  const entryFile = path.join(reactDistDir, "index.js");
  const exists = await fs.pathExists(entryFile);
  if (!exists) return;

  const internalEntryFile = path.join(reactDistDir, "index.internal.js");
  const sourceEntryFile = path.join(root, "packages/react/dist/index.js");
  const internalSource = (await fs.pathExists(sourceEntryFile))
    ? sourceEntryFile
    : entryFile;
  await fs.copy(internalSource, internalEntryFile, { overwrite: true });
  await fs.writeFile(entryFile, getReactGuardEntrypoint(), "utf8");
}

async function createAngularGuardEntrypoint(angularDistDir) {
  const bundleFile = path.join(
    angularDistDir,
    "ui-lib/fesm2022/karan9186-angular.mjs"
  );
  const exists = await fs.pathExists(bundleFile);
  if (!exists) return;

  await fs.writeFile(
    path.join(angularDistDir, "index.js"),
    getAngularGuardEntrypoint(),
    "utf8"
  );
}

/**
 * Tarball layout: copied React and Angular bundles must resolve the loader
 * through the unified package dist/loader directory instead of workspace names.
 */
async function rewriteLoaderImportsForUnifiedTarball(packageDistDir) {
  const exists = await fs.pathExists(packageDistDir);
  if (!exists) return;

  const files = await collectTextFiles(packageDistDir);

  for (const file of files) {
    const loaderImport = toPosixPath(
      path.relative(path.dirname(file), path.join(root, "dist/loader/index.js"))
    );
    const relativeLoaderImport = loaderImport.startsWith(".")
      ? loaderImport
      : `./${loaderImport}`;
    const rootImport = toPosixPath(
      path.relative(path.dirname(file), path.join(root, "dist/index.js"))
    );
    const relativeRootImport = rootImport.startsWith(".")
      ? rootImport
      : `./${rootImport}`;

    const fromRe = /from\s+["']@karan9186\/web-components\/loader["']/g;
    const importRe = /import\s+["']@karan9186\/web-components\/loader["']/g;
    const dynamicImportRe =
      /import\(\s*["']@karan9186\/web-components\/loader["']\s*\)/g;
    const rootFromRe = /from\s+["']@karan9186\/web-components["']/g;
    const rootImportRe = /import\s+["']@karan9186\/web-components["']/g;
    const rootDynamicImportRe =
      /import\(\s*["']@karan9186\/web-components["']\s*\)/g;

    const text = await fs.readFile(file, "utf8");
    const next = text
      .replace(fromRe, `from "${relativeLoaderImport}"`)
      .replace(importRe, `import "${relativeLoaderImport}"`)
      .replace(dynamicImportRe, `import("${relativeLoaderImport}")`)
      .replace(rootFromRe, `from "${relativeRootImport}"`)
      .replace(rootImportRe, `import "${relativeRootImport}"`)
      .replace(rootDynamicImportRe, `import("${relativeRootImport}")`);
    if (next !== text) {
      await fs.writeFile(file, next, "utf8");
    }
  }
}

async function collectTextFiles(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await collectTextFiles(full, out);
    } else if (
      e.isFile() &&
      [".js", ".mjs", ".cjs", ".map"].includes(path.extname(e.name))
    ) {
      out.push(full);
    }
  }
  return out;
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function getReactGuardEntrypoint() {
  return `import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function ensureReactRuntime() {
  try {
    require.resolve("react");
    require.resolve("react-dom");
  } catch {
    throw new Error(
      "[karan9186] React wrapper used but React is not installed.\\nRun: npm install react react-dom"
    );
  }
}

ensureReactRuntime();

const mod = await import("./index.internal.js");

export const UiButton = mod.UiButton;
export const UiInput = mod.UiInput;
export const Toggle = mod.Toggle;
`;
}

function getAngularGuardEntrypoint() {
  return `import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function ensureAngularRuntime() {
  try {
    require.resolve("@angular/core");
  } catch {
    throw new Error(
      "[karan9186] Angular wrapper used but Angular is not installed.\\nRun: npm install @angular/core"
    );
  }
}

ensureAngularRuntime();

const mod = await import("./ui-lib/fesm2022/karan9186-angular.mjs");

export const ButtonComponent = mod.ButtonComponent;
export const InputComponent = mod.InputComponent;
export const UiLibModule = mod.UiLibModule;
export const UiToggleComponent = mod.UiToggleComponent;
`;
}

build();
