#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import prompts from "prompts";
import chalk from "chalk";
import ora from "ora";

const FRAMEWORKS = ["react", "angular", "vanilla"];
const WRAPPER_PACKAGES = {
  react: "@karan9186/react",
  angular: "@karan9186/angular"
};
const COMPONENT_REGISTRY = {
  button: {
    reactImport: 'import { UiButton } from "@karan9186/react";',
    angularImport: 'import { ButtonComponent } from "@karan9186/angular";',
    vanillaUsage:
      'Use <ui-button></ui-button> after calling defineCustomElements() from "@karan9186/loader".'
  },
  input: {
    reactImport: 'import { UiInput } from "@karan9186/react";',
    angularImport: 'import { InputComponent } from "@karan9186/angular";',
    vanillaUsage:
      'Use <ui-input></ui-input> after calling defineCustomElements() from "@karan9186/loader".'
  },
  toggle: {
    reactImport: 'import { Toggle } from "@karan9186/react";',
    angularImport: 'import { UiToggleComponent } from "@karan9186/angular";',
    vanillaUsage:
      'Use <ui-toggle></ui-toggle> after calling defineCustomElements() from "@karan9186/loader".'
  }
};

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const options = parseOptions(rest);
  const projectRoot = process.cwd();

  try {
    switch (command) {
      case "init":
        await runInit(projectRoot, options);
        return;
      case "add":
        await runAdd(projectRoot, options.positionals[0], options);
        return;
      case "help":
      case "--help":
      case "-h":
      case undefined:
        printHelp();
        return;
      default:
        throw new Error(`Unknown command "${command}".`);
    }
  } catch (error) {
    logError(error instanceof Error ? error.message : "Unexpected error.");
    process.exitCode = 1;
  }
}

async function runInit(projectRoot, options) {
  const packageManager = detectPackageManager(projectRoot);
  const pkgJson = readProjectPackageJson(projectRoot);

  ensureBasePackageInstalled(pkgJson, packageManager);

  const framework = await resolveFramework(pkgJson, options.framework);

  if (framework === "vanilla") {
    logSuccess("Vanilla project detected. The base package already includes web components.");
    logInfo('Import web components from "@karan9186/web-components" and the loader from "@karan9186/loader".');
    return;
  }

  const wrapperPackage = WRAPPER_PACKAGES[framework];

  if (hasDeclaredDependency(pkgJson, wrapperPackage)) {
    logSuccess(`${wrapperPackage} is already installed.`);
    logInfo(getFrameworkImportHint(framework));
    return;
  }

  await installPackages(projectRoot, packageManager, [toVersionedPackage(wrapperPackage)]);

  logSuccess(`Installed ${wrapperPackage}.`);
  logInfo(getFrameworkImportHint(framework));
}

async function runAdd(projectRoot, componentName, options) {
  const component = componentName?.toLowerCase();
  const packageManager = detectPackageManager(projectRoot);
  const pkgJson = readProjectPackageJson(projectRoot);

  ensureBasePackageInstalled(pkgJson, packageManager);

  if (!component) {
    throw new Error('Usage: karan9186 add <component-name>. Example: "@karan9186 add button".');
  }

  const manifest = COMPONENT_REGISTRY[component];

  if (!manifest) {
    throw new Error(
      `Unknown component "${component}". Available components: ${Object.keys(COMPONENT_REGISTRY).join(", ")}.`
    );
  }

  const framework = await resolveFramework(pkgJson, options.framework);

  if (framework !== "vanilla") {
    const wrapperPackage = WRAPPER_PACKAGES[framework];

    if (!hasDeclaredDependency(pkgJson, wrapperPackage)) {
      await installPackages(projectRoot, packageManager, [toVersionedPackage(wrapperPackage)]);
      logSuccess(`Installed ${wrapperPackage} for ${framework}.`);
    } else {
      logSuccess(`${wrapperPackage} is already installed.`);
    }
  } else {
    logSuccess("Vanilla project detected. No extra wrapper package is required.");
  }

  logInfo(`"${component}" is already available in this design system.`);
  logInfo(getComponentUsage(component, framework, manifest));
  logInfo("The registry inside this CLI is ready for future component-level package installs.");
}

function parseOptions(args) {
  let framework;
  const positionals = [];

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];

    if (value === "--framework" || value === "-f") {
      framework = args[index + 1];
      index += 1;
      continue;
    }

    if (value.startsWith("--framework=")) {
      framework = value.slice("--framework=".length);
      continue;
    }

    if (!value.startsWith("-")) {
      positionals.push(value);
    }
  }

  if (framework && !FRAMEWORKS.includes(framework)) {
    throw new Error(`Invalid framework "${framework}". Use one of: ${FRAMEWORKS.join(", ")}.`);
  }

  return { framework, positionals };
}

function readProjectPackageJson(projectRoot) {
  const packageJsonPath = path.join(projectRoot, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error("No package.json found in the current directory.");
  }

  try {
    return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  } catch {
    throw new Error("Failed to read package.json.");
  }
}

function ensureBasePackageInstalled(pkgJson, packageManager) {
  if (hasDeclaredDependency(pkgJson, "@karan9186/main")) {
    return;
  }

  throw new Error(
    `This project does not list "@karan9186/main". Run "${buildInstallCommand(packageManager, ["@karan9186/main"])}" first.`
  );
}

function detectPackageManager(projectRoot) {
  if (findUp(projectRoot, "pnpm-lock.yaml")) {
    return "pnpm";
  }

  if (findUp(projectRoot, "yarn.lock")) {
    return "yarn";
  }

  return "npm";
}

function findUp(startDir, fileName) {
  let currentDir = startDir;

  while (true) {
    const candidate = path.join(currentDir, fileName);

    if (fs.existsSync(candidate)) {
      return candidate;
    }

    const parentDir = path.dirname(currentDir);

    if (parentDir === currentDir) {
      return "";
    }

    currentDir = parentDir;
  }
}

function hasDeclaredDependency(pkgJson, packageName) {
  return Boolean(
    pkgJson.dependencies?.[packageName] ||
      pkgJson.devDependencies?.[packageName] ||
      pkgJson.peerDependencies?.[packageName]
  );
}

async function resolveFramework(pkgJson, explicitFramework) {
  if (explicitFramework) {
    return explicitFramework;
  }

  const hasReact = hasDeclaredDependency(pkgJson, "react");
  const hasAngular = hasDeclaredDependency(pkgJson, "@angular/core");

  if (hasReact && hasAngular) {
    return promptForFramework(
      "React and Angular were both detected. Which framework should karan9186 configure?"
    );
  }

  if (hasReact) {
    logInfo("Detected React from package.json.");
    return "react";
  }

  if (hasAngular) {
    logInfo("Detected Angular from package.json.");
    return "angular";
  }

  return promptForFramework("Which framework are you using?");
}

async function promptForFramework(message) {
  ensureInteractiveTerminal();

  const response = await prompts({
    type: "select",
    name: "framework",
    message,
    choices: [
      { title: "react", value: "react" },
      { title: "angular", value: "angular" },
      { title: "vanilla", value: "vanilla" }
    ]
  });

  if (!response.framework) {
    throw new Error("Prompt cancelled.");
  }

  return response.framework;
}

function ensureInteractiveTerminal() {
  if (process.stdin.isTTY && process.stdout.isTTY) {
    return;
  }

  throw new Error("Cannot prompt in a non-interactive terminal. Pass --framework react|angular|vanilla.");
}

async function installPackages(projectRoot, packageManager, packages) {
  const spinner = ora({
    text: `Installing ${packages.join(", ")} with ${packageManager}...`,
    color: "cyan"
  }).start();

  try {
    execSync(buildInstallCommand(packageManager, packages), {
      cwd: projectRoot,
      stdio: "pipe",
      encoding: "utf8"
    });
    spinner.succeed(`Installation finished: ${packages.join(", ")}.`);
  } catch (error) {
    spinner.fail("Installation failed.");

    const stdout = error?.stdout?.toString().trim();
    const stderr = error?.stderr?.toString().trim();

    if (stdout) {
      process.stderr.write(`${stdout}\n`);
    }

    if (stderr) {
      process.stderr.write(`${stderr}\n`);
    }

    throw new Error(`Unable to install ${packages.join(", ")}.`);
  }
}

function buildInstallCommand(packageManager, packages) {
  if (packageManager === "pnpm") {
    return `pnpm add ${packages.join(" ")}`;
  }

  if (packageManager === "yarn") {
    return `yarn add ${packages.join(" ")}`;
  }

  return `npm install ${packages.join(" ")}`;
}

function toVersionedPackage(packageName) {
  const version = readCliPackageVersion();
  return version ? `${packageName}@${version}` : packageName;
}

function readCliPackageVersion() {
  const packageJsonPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "package.json"
  );

  try {
    const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    return pkgJson.version || "";
  } catch {
    return "";
  }
}

function getFrameworkImportHint(framework) {
  if (framework === "react") {
    return 'Import wrappers from "@karan9186/react".';
  }

  if (framework === "angular") {
    return 'Import wrappers from "@karan9186/angular".';
  }

  return 'Import web components from "@karan9186/web-components".';
}

function getComponentUsage(component, framework, manifest) {
  if (framework === "react") {
    return `${manifest.reactImport} You can now use the ${component} component in React.`;
  }

  if (framework === "angular") {
    return `${manifest.angularImport} You can now use the ${component} component in Angular.`;
  }

  return manifest.vanillaUsage;
}

function printHelp() {
  const lines = [
    `${formatPrefix(chalk.bold("Usage"))}`,
    "  karan9186 init [--framework react|angular|vanilla]",
    "  karan9186 add <component-name> [--framework react|angular|vanilla]",
    "",
    `${formatPrefix(chalk.bold("Examples"))}`,
    "  npx karan9186 init",
    "  npx karan9186 add button",
    "  npx karan9186 init --framework react"
  ];

  process.stdout.write(`${lines.join("\n")}\n`);
}

function formatPrefix(message) {
  return `${chalk.cyan("[karan9186]")} ${message}`;
}

function logInfo(message) {
  process.stdout.write(`${formatPrefix(chalk.white(message))}\n`);
}

function logSuccess(message) {
  process.stdout.write(`${formatPrefix(chalk.green(message))}\n`);
}

function logError(message) {
  process.stderr.write(`${formatPrefix(chalk.red(message))}\n`);
}

main();
