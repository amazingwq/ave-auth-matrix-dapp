import { spawnSync } from "node:child_process";

const projects = [
  "ave-auth-whitelist",
  "ave-auth-low",
  "ave-auth-unknown",
  "ave-auth-caution",
  "ave-auth-danger",
  "ave-auth-blacklist"
];

for (const project of projects) {
  console.log(`\nDeploying ${project}.pages.dev`);
  const result = spawnSync(
    "npx",
    ["wrangler", "pages", "deploy", "dist", "--project-name", project, "--branch", "main"],
    { stdio: "inherit", shell: process.platform === "win32" }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

