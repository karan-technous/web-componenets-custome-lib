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

  console.log("Unified dist ready");
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

    const fromRe = /from\s+["']@ui-platform\/web-components\/loader["']/g;
    const importRe = /import\s+["']@ui-platform\/web-components\/loader["']/g;
    const dynamicImportRe =
      /import\(\s*["']@ui-platform\/web-components\/loader["']\s*\)/g;
    const rootFromRe = /from\s+["']@ui-platform\/web-components["']/g;
    const rootImportRe = /import\s+["']@ui-platform\/web-components["']/g;
    const rootDynamicImportRe =
      /import\(\s*["']@ui-platform\/web-components["']\s*\)/g;

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

build();
