/**
 * @file build-pages.mjs
 * @description Production build with GITHUB_PAGES=true (base /nzpolitik/)
 * @onboarding
 * - Prefer npm run build:pages on Windows; CI can also set GITHUB_PAGES=true
 * - Runs npm run build so postbuild copies 404.html
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = { ...process.env, GITHUB_PAGES: "true" };
const result = spawnSync("npm", ["run", "build"], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: true,
});
process.exit(result.status ?? 1);
