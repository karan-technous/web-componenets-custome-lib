import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publishDir = path.join(rootDir, ".publish");

async function main() {
  const versions = await getWorkspaceVersions();

  await fs.rm(publishDir, { recursive: true, force: true });
  await fs.mkdir(publishDir, { recursive: true });

  await stageAngularPackage(versions);

  process.stdout.write("Prepared publish staging in .publish\n");
}

async function getWorkspaceVersions() {
  const manifests = [
    "packages/core/package.json",
    "packages/web-components/package.json",
    "packages/react/package.json",
    "packages/angular/projects/ui-lib/package.json",
    "meta/karan9186/package.json"
  ];

  const entries = await Promise.all(
    manifests.map(async (relativePath) => {
      const pkgJson = await readJson(path.join(rootDir, relativePath));
      return [pkgJson.name, pkgJson.version];
    })
  );

  return Object.fromEntries(entries);
}

async function stageAngularPackage(versions) {
  const sourceDir = path.join(rootDir, "packages/angular/dist/ui-lib");
  const targetDir = path.join(publishDir, "angular");

  await ensureExists(sourceDir, "Angular dist package is missing. Run the workspace build first.");
  await fs.cp(sourceDir, targetDir, { recursive: true });

  const packageJsonPath = path.join(targetDir, "package.json");
  const pkgJson = await readJson(packageJsonPath);

  replaceWorkspaceProtocols(pkgJson, versions);
  pkgJson.publishConfig = {
    ...(pkgJson.publishConfig || {}),
    access: "public"
  };

  await writeJson(packageJsonPath, pkgJson);
}

function replaceWorkspaceProtocols(pkgJson, versions) {
  for (const field of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies"
  ]) {
    const deps = pkgJson[field];

    if (!deps) {
      continue;
    }

    for (const [name, range] of Object.entries(deps)) {
      if (typeof range !== "string" || !range.startsWith("workspace:")) {
        continue;
      }

      const version = versions[name];

      if (!version) {
        throw new Error(`Cannot resolve workspace dependency version for ${name}.`);
      }

      deps[name] = version;
    }
  }
}

async function ensureExists(targetPath, message) {
  try {
    await fs.access(targetPath);
  } catch {
    throw new Error(message);
  }
}

async function readJson(filePath) {
  const contents = await fs.readFile(filePath, "utf8");
  return JSON.parse(contents);
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Unexpected error."}\n`);
  process.exit(1);
});
