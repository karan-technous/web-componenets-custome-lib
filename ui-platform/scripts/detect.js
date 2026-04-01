#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  configureInstalledPackage,
  detectFramework,
  getScriptsPackageRoot
} from "./install-config.js";

function main() {
  if (process.env.UI_PLATFORM_SKIP === "true") {
    return;
  }

  const projectRoot = process.env.INIT_CWD || process.cwd();
  const packageJsonPath = path.join(projectRoot, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  let pkgJson;

  try {
    pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  } catch {
    return;
  }

  const framework = detectFramework(pkgJson);
  const packageRoot = getScriptsPackageRoot(import.meta.url);

  configureInstalledPackage(packageRoot, framework);

  console.log(`[ui-platform] Detected: ${framework}`);
  console.log("[ui-platform] Run: npx ui-platform init");
}

main();
