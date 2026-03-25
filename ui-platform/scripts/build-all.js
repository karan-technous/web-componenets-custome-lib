import fs from "fs-extra";

async function build() {
  await fs.remove("dist");

  // web-components (IMPORTANT)
  await fs.copy("packages/web-components/dist", "dist");

  // react
  await fs.copy("packages/react/dist", "dist/react");

  // angular
  await fs.copy("packages/angular/dist/ui-lib", "dist/angular/ui-lib");

  // core
  await fs.copy("packages/core/dist", "dist/core");

  console.log("Unified dist ready");
}

build();
