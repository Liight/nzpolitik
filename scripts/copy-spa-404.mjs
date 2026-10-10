/**
 * @file copy-spa-404.mjs
 * @description Copy dist/index.html to dist/404.html for GitHub Pages SPA deep links
 * @onboarding
 * - Run via npm postbuild after vite build
 * - GitHub Pages serves 404.html for unknown paths; SPA then boots and routes client-side
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "dist", "index.html");
const notFoundPath = path.join(root, "dist", "404.html");

if (!fs.existsSync(indexPath)) {
  console.error("copy-spa-404: dist/index.html missing; run vite build first");
  process.exit(1);
}

fs.copyFileSync(indexPath, notFoundPath);
console.log("Wrote dist/404.html for GitHub Pages SPA fallback");
