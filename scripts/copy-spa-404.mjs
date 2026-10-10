/**
 * @file copy-spa-404.mjs
 * @description Harden dist for GitHub Pages: 404.html SPA fallback, .nojekyll, bare-path redirect
 * @onboarding
 * - Run via npm postbuild after vite build
 * - 404.html lets deep client routes boot the SPA
 * - Bare /nzpolitik without trailing slash is a platform pitfall; inject client redirect if our HTML is served
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const indexPath = path.join(distDir, "index.html");
const notFoundPath = path.join(distDir, "404.html");
const noJekyllPath = path.join(distDir, ".nojekyll");

/** Redirect /nzpolitik -> /nzpolitik/ before the SPA boots (Safari often drops the slash). */
const barePathRedirect = `<script>(function(){var p=location.pathname;if(p==="/nzpolitik"){location.replace("/nzpolitik/"+location.search+location.hash);}})();</script>`;

if (!fs.existsSync(indexPath)) {
  console.error("copy-spa-404: dist/index.html missing; run vite build first");
  process.exit(1);
}

let html = fs.readFileSync(indexPath, "utf8");
if (!html.includes('pathname==="/nzpolitik"') && !html.includes("pathname===\"/nzpolitik\"")) {
  if (html.includes("<head>")) {
    html = html.replace("<head>", `<head>\n    ${barePathRedirect}`);
  } else {
    html = barePathRedirect + html;
  }
  fs.writeFileSync(indexPath, html);
}

fs.copyFileSync(indexPath, notFoundPath);
fs.writeFileSync(noJekyllPath, "");
console.log("Wrote dist/404.html, dist/.nojekyll, bare-path redirect in index/404");
