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

  await rewriteReactImportsForUnifiedTarball(
    path.join(root, "dist/react")
  );

  console.log("Unified dist ready");
}

/**
 * Tarball layout: dist/react/* must resolve web-components loader via relative
 * path (same package). Workspace builds keep @ui-platform/web-components imports.
 */
async function rewriteReactImportsForUnifiedTarball(reactDistDir) {
  const exists = await fs.pathExists(reactDistDir);
  if (!exists) return;

  const files = await collectJsFiles(reactDistDir);
  const fromRe = /from\s+["']@ui-platform\/web-components\/loader["']/g;
  const importRe = /import\s+["']@ui-platform\/web-components\/loader["']/g;

  for (const file of files) {
    let text = await fs.readFile(file, "utf8");
    const next = text
      .replace(fromRe, 'from "../loader/index.js"')
      .replace(importRe, 'import "../loader/index.js"');
    if (next !== text) {
      await fs.writeFile(file, next, "utf8");
    }
  }
}

async function collectJsFiles(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await collectJsFiles(full, out);
    } else if (e.isFile() && e.name.endsWith(".js")) {
      out.push(full);
    }
  }
  return out;
}

build();
