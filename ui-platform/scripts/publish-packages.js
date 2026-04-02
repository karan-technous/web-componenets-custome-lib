import { spawnSync } from "node:child_process";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const options = parseOptions(process.argv.slice(2));

const packages = [
  {
    name: "@karan9186/core",
    dir: path.join(rootDir, "packages/core"),
    access: "public",
  },
  {
    name: "@karan9186/web-components",
    dir: path.join(rootDir, "packages/web-components"),
    access: "public",
  },
  {
    name: "@karan9186/react",
    dir: path.join(rootDir, "packages/react"),
    access: "public",
  },
  {
    name: "@karan9186/angular",
    dir: path.join(rootDir, ".publish/angular"),
    access: "public",
  },
  {
    name: "@karan9186/main",
    dir: path.join(rootDir, "meta/karan9186"),
    access: "public",
  },
];

async function main() {
  if (!options.dryRun) {
    ensureNpmAuth();
  }

  run(`pnpm run publish:prepare`, rootDir);

  for (const pkg of packages) {
    await publishPackage(pkg);
  }
}

function ensureNpmAuth() {
  run("npm whoami", rootDir);
}

async function publishPackage(pkg) {
  let otp = options.otp;
  let attemptedOtpRetry = false;

  if (!options.dryRun && options.promptForOtp) {
    otp = await promptForOtp(pkg.name);
  }

  while (true) {
    const command = buildPublishCommand(pkg, otp);

    process.stdout.write(
      `Publishing ${pkg.name}${options.dryRun ? " (dry-run)" : ""}${otp ? " with OTP" : ""}\n`,
    );

    const result = run(command, pkg.dir, { allowFailure: true });

    if (result.ok) {
      return;
    }

    if (
      !options.dryRun &&
      !attemptedOtpRetry &&
      isTwoFactorError(result.output) &&
      canPromptForOtp()
    ) {
      process.stderr.write(
        [
          "",
          "Publish failed because npm requires a 2FA code or a publish-capable token.",
          "Enter a fresh OTP to retry this package, or cancel and switch to a granular token with bypass 2FA enabled.",
          "",
        ].join("\n"),
      );
      otp = await promptForOtp(pkg.name);
      attemptedOtpRetry = true;
      continue;
    }

    throw new Error(buildPublishError(pkg.name, result.output));
  }
}

function buildPublishCommand(pkg, otp) {
  const command = [
    "npm publish",
    pkg.access ? `--access ${pkg.access}` : "",
    options.dryRun ? "--dry-run" : "",
    otp ? `--otp ${otp}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return command;
}

function run(command, cwd, { allowFailure = false } = {}) {
  const result = spawnSync(command, {
    cwd,
    shell: true,
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status === 0) {
    return {
      ok: true,
      output: `${result.stdout || ""}\n${result.stderr || ""}`,
    };
  }

  if (allowFailure) {
    return {
      ok: false,
      output: `${result.stdout || ""}\n${result.stderr || ""}`,
    };
  }

  throw new Error(`Command failed: ${command}`);
}

function parseOptions(args) {
  let otp = "";
  let promptForOtp = false;

  for (const arg of args) {
    if (arg === "--dry-run") {
      continue;
    }

    if (arg === "--otp-prompt") {
      promptForOtp = true;
      continue;
    }

    if (arg.startsWith("--otp=")) {
      otp = arg.slice("--otp=".length);
    }
  }

  return {
    dryRun: args.includes("--dry-run"),
    otp,
    promptForOtp,
  };
}

function canPromptForOtp() {
  return Boolean(input.isTTY && output.isTTY);
}

async function promptForOtp(packageName) {
  if (!canPromptForOtp()) {
    throw new Error(
      "npm requested a 2FA code, but this terminal is not interactive. Use a granular access token with bypass 2FA enabled or rerun with an interactive shell.",
    );
  }

  const rl = createInterface({ input, output });

  try {
    const code = (
      await rl.question(`Enter npm OTP for ${packageName}: `)
    ).trim();

    if (!code) {
      throw new Error("An OTP is required to continue publishing.");
    }

    return code;
  } finally {
    rl.close();
  }
}

function isTwoFactorError(output) {
  return /two-factor authentication|bypass 2fa|one-time password|EOTP/i.test(
    output,
  );
}

function buildPublishError(packageName, output) {
  if (!isTwoFactorError(output)) {
    return `Publishing ${packageName} failed.\n\n${output.trim()}`;
  }

  return [
    `Publishing ${packageName} failed because npm requires a 2FA code or a publish-capable token.`,
    "",
    "Use one of these fixes:",
    "1. Run `pnpm run publish:all -- --otp-prompt` and enter a fresh npm OTP when prompted.",
    "2. Replace your current npm token with a granular access token that has package publish permission and bypass 2FA enabled.",
    "3. Remove token-based auth, run `npm login`, and publish from an interactive terminal.",
    "",
    output.trim(),
  ].join("\n");
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Unexpected publish error."}\n`,
  );
  process.exit(1);
});
