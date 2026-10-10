/**
 * @file extract-party-logos.mjs
 * @description Extract embedded images from EC register PDF; map to party ids when possible
 * @onboarding
 * - Requires notes/assets/ec-register-logos-2026-09-29.pdf (browser download if Incapsula blocks curl)
 * - Writes notes/assets/ec-extracted/*.png for manual/auto mapping
 * - Does not overwrite party-website logos unless --apply is passed
 * - Dependencies: pdfjs-dist, magick optional
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const pdfPath = path.join(
  root,
  "notes/assets/ec-register-logos-2026-09-29.pdf",
);
const outDir = path.join(root, "notes/assets/ec-extracted");
const apply = process.argv.includes("--apply");

fs.mkdirSync(outDir, { recursive: true });

if (!fs.existsSync(pdfPath)) {
  console.error("Missing EC PDF at", pdfPath);
  process.exit(1);
}

const require = createRequire(import.meta.url);
const pdfjsPath = path.join(
  root,
  "node_modules/pdfjs-dist/legacy/build/pdf.mjs",
);
const pdfjs = await import(pathToFileURL(pdfjsPath).href);

const data = new Uint8Array(fs.readFileSync(pdfPath));
const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
console.log("pages", doc.numPages);

let imgIndex = 0;
const saved = [];

for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const ops = await page.getOperatorList();
  const fns = pdfjs.OPS;
  for (let i = 0; i < ops.fnArray.length; i++) {
    if (ops.fnArray[i] !== fns.paintImageXObject) continue;
    const name = ops.argsArray[i][0];
    let img;
    try {
      img = await new Promise((resolve, reject) => {
        page.objs.get(name, resolve);
        setTimeout(() => reject(new Error("timeout " + name)), 5000);
      });
    } catch {
      try {
        img = page.objs.get(name);
      } catch {
        continue;
      }
    }
    if (!img || !img.width || !img.data) continue;
    // Skip tiny icons / noise
    if (img.width < 40 || img.height < 40) continue;
    const pngPath = path.join(
      outDir,
      `p${String(p).padStart(2, "0")}-${String(imgIndex).padStart(3, "0")}-${img.width}x${img.height}.ppm`,
    );
    // Write raw RGB as PPM then convert via magick if present
    const { width, height, data: rgba } = img;
    const channels = rgba.length / (width * height);
    let rgb = Buffer.alloc(width * height * 3);
    if (channels >= 3) {
      for (let px = 0; px < width * height; px++) {
        rgb[px * 3] = rgba[px * channels];
        rgb[px * 3 + 1] = rgba[px * channels + 1];
        rgb[px * 3 + 2] = rgba[px * channels + 2];
      }
    } else {
      continue;
    }
    const header = Buffer.from(`P6\n${width} ${height}\n255\n`);
    fs.writeFileSync(pngPath, Buffer.concat([header, rgb]));
    const outPng = pngPath.replace(/\.ppm$/, ".png");
    try {
      const { execFileSync } = await import("child_process");
      execFileSync("magick", [pngPath, outPng], { stdio: "ignore" });
      fs.unlinkSync(pngPath);
      saved.push(outPng);
    } catch {
      saved.push(pngPath);
    }
    imgIndex++;
  }
}

console.log("extracted", saved.length, "images to", outDir);
fs.writeFileSync(
  path.join(outDir, "index.json"),
  JSON.stringify({ count: saved.length, files: saved.map((f) => path.basename(f)) }, null, 2),
);

if (apply) {
  console.log("--apply: map images manually or via size heuristics; skipping auto-overwrite");
}

void require;
