#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { execSync } from "node:child_process";
import {
  configureInstalledPackage,
  detectFramework,
  getBinPackageRoot,
  getImportPath
} from "../scripts/install-config.js";

function getPackageManager(projectRoot) {
  if (fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) {
    return "yarn";
  }

  return "npm";
}

function getMissingPeers(framework, pkgJson) {
  const deps = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
    ...pkgJson.peerDependencies
  };

  if (framework === "angular") {
    return ["@angular/core", "@angular/common", "@angular/forms"].filter(
      (name) => !deps[name]
    );
  }

  if (framework === "react") {
    return ["react", "react-dom"].filter((name) => !deps[name]);
  }

  return [];
}

function buildInstallCommand(packageManager, packages) {
  if (packages.length === 0) {
    return "";
  }

  if (packageManager === "pnpm") {
    return `pnpm add ${packages.join(" ")}`;
  }

  if (packageManager === "yarn") {
    return `yarn add ${packages.join(" ")}`;
  }

  return `npm install ${packages.join(" ")}`;
}

function askConfirmation(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  const command = process.argv[2];

  if (command !== "init") {
    console.error("[ui-platform] Usage: ui-platform init");
    process.exit(1);
  }

  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.error("[ui-platform] No package.json found in the current directory.");
    process.exit(1);
  }

  let pkgJson;

  try {
    pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  } catch {
    console.error("[ui-platform] Failed to read package.json.");
    process.exit(1);
  }

  const framework = detectFramework(pkgJson);
  const missingPeers = getMissingPeers(framework, pkgJson);
  const packageManager = getPackageManager(process.cwd());
  const importPath = getImportPath(framework);
  const packageRoot = getBinPackageRoot(import.meta.url);

  configureInstalledPackage(packageRoot, framework);

  console.log(`[ui-platform] Detected: ${framework}`);
  console.log(`[ui-platform] Import path: ${importPath}`);

  if (framework === "web-components") {
    console.log("[ui-platform] No peer dependency installation is required.");
    return;
  }

  if (missingPeers.length === 0) {
    console.log("[ui-platform] Required peer dependencies are already installed.");
    return;
  }

  const answer = await askConfirmation(
    `[ui-platform] Install missing peer dependencies (${missingPeers.join(", ")})? (y/n) `
  );

  if (answer !== "y" && answer !== "yes") {
    console.log("[ui-platform] Installation cancelled.");
    return;
  }

  const installCommand = buildInstallCommand(packageManager, missingPeers);

  try {
    execSync(installCommand, {
      cwd: process.cwd(),
      stdio: "inherit",
      env: {
        ...process.env,
        UI_PLATFORM_SKIP: "true"
      }
    });
  } catch {
    console.error("[ui-platform] Failed to install peer dependencies.");
    process.exit(1);
  }
}

main().catch(() => {
  console.error("[ui-platform] Unexpected error.");
  process.exit(1);
});
