import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function detectFramework(pkgJson) {
  if (
    pkgJson.dependencies?.["@angular/core"] ||
    pkgJson.devDependencies?.["@angular/core"]
  ) {
    return "angular";
  }

  if (pkgJson.dependencies?.react || pkgJson.devDependencies?.react) {
    return "react";
  }

  return "web-components";
}

export function getImportPath(framework) {
  if (framework === "react") {
    return "ui-platform/react";
  }

  if (framework === "angular") {
    return "ui-platform/angular";
  }

  return "ui-platform/web-components";
}

export function getScriptsPackageRoot(moduleUrl) {
  return path.resolve(path.dirname(fileURLToPath(moduleUrl)), "..");
}

export function getBinPackageRoot(moduleUrl) {
  return path.resolve(path.dirname(fileURLToPath(moduleUrl)), "..");
}

export function configureInstalledPackage(packageRoot, framework) {
  if (!isInstalledPackage(packageRoot)) {
    return false;
  }

  const packageJsonPath = path.join(packageRoot, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const nextPkgJson = createProjectSpecificManifest(pkgJson, framework);

  writePackageJson(packageJsonPath, nextPkgJson);
  pruneFrameworkDirectories(packageRoot, framework);

  return true;
}

function isInstalledPackage(packageRoot) {
  return packageRoot.includes(`${path.sep}node_modules${path.sep}`);
}

function createProjectSpecificManifest(pkgJson, framework) {
  const nextPkgJson = {
    ...pkgJson,
    exports: { ...(pkgJson.exports || {}) },
    peerDependencies: { ...(pkgJson.peerDependencies || {}) },
    peerDependenciesMeta: { ...(pkgJson.peerDependenciesMeta || {}) }
  };

  if (framework === "react") {
    delete nextPkgJson.exports["./angular"];
    delete nextPkgJson.peerDependencies["@angular/common"];
    delete nextPkgJson.peerDependencies["@angular/core"];
    delete nextPkgJson.peerDependencies["@angular/forms"];
    delete nextPkgJson.peerDependenciesMeta["@angular/common"];
    delete nextPkgJson.peerDependenciesMeta["@angular/core"];
    delete nextPkgJson.peerDependenciesMeta["@angular/forms"];
  } else if (framework === "angular") {
    delete nextPkgJson.exports["./react"];
    delete nextPkgJson.peerDependencies.react;
    delete nextPkgJson.peerDependencies["react-dom"];
    delete nextPkgJson.peerDependenciesMeta.react;
    delete nextPkgJson.peerDependenciesMeta["react-dom"];
  } else {
    delete nextPkgJson.exports["./react"];
    delete nextPkgJson.exports["./angular"];
    nextPkgJson.peerDependencies = {};
    nextPkgJson.peerDependenciesMeta = {};
  }

  nextPkgJson.sideEffects = getProjectSideEffects(framework);

  return nextPkgJson;
}

function getProjectSideEffects(framework) {
  const sideEffects = [
    "./dist/web-components/*.js",
    "./dist/loader/*.js"
  ];

  if (framework === "react") {
    sideEffects.push("./dist/react/setup.js", "./dist/react/index.js");
  }

  return sideEffects;
}

function pruneFrameworkDirectories(packageRoot, framework) {
  if (framework === "react") {
    fs.rmSync(path.join(packageRoot, "dist/angular"), {
      recursive: true,
      force: true
    });
    return;
  }

  if (framework === "angular") {
    fs.rmSync(path.join(packageRoot, "dist/react"), {
      recursive: true,
      force: true
    });
    return;
  }

  fs.rmSync(path.join(packageRoot, "dist/react"), {
    recursive: true,
    force: true
  });
  fs.rmSync(path.join(packageRoot, "dist/angular"), {
    recursive: true,
    force: true
  });
}

function writePackageJson(packageJsonPath, pkgJson) {
  const tempPath = `${packageJsonPath}.tmp`;
  const content = `${JSON.stringify(pkgJson, null, 2)}\n`;

  fs.writeFileSync(tempPath, content, "utf8");
  fs.rmSync(packageJsonPath, { force: true });
  fs.renameSync(tempPath, packageJsonPath);
}
