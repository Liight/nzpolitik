/**
 * @file fetch-party-logos.mjs
 * @description Download party logos (website/og) into public/party-logos and write branding.json
 * @onboarding
 * - EC register PDF is preferred but often Incapsula-blocked from scripts
 * - logoSource is party_website unless EC extract succeeds later
 * - Uses ImageMagick `magick` to normalize PNGs when available
 * - Dependencies: Node fetch, parties.json, magick optional
 * @see ONBOARDING.md Refresh party logos
 */
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "party-logos");
const parties = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/parties.json"), "utf8"),
);

fs.mkdirSync(outDir, { recursive: true });

/** Curated direct logo URLs (party sites / known CDN). Prefer these over HTML scrape. */
const CURATED = {
  act: "https://www.act.org.nz/assets/logo.png",
  alliance: "https://allianceparty.nz/wp-content/uploads/2024/01/alliance-logo.png",
  "animal-justice":
    "https://animaljustice.org.nz/wp-content/uploads/2023/07/AJP-logo.png",
  alcp: "https://www.alcp.org.nz/images/logo.png",
  conservative: "https://conservatives.org.nz/wp-content/uploads/logo.png",
  "free-palestine": "https://www.palfree.nz/logo.png",
  green: "https://www.greens.org.nz/assets/Green-Party-logo.png",
  labour: "https://www.labour.org.nz/assets/logo.png",
  national: "https://www.national.org.nz/assets/logo.png",
  "nz-first": "https://www.nzfirst.nz/assets/logo.png",
  "nz-loyal": "https://nzloyal.com/wp-content/uploads/logo.png",
  "outdoors-freedom": "https://nzofp.co.nz/logo.png",
  opportunity: "https://www.opportunity.org.nz/assets/logo.png",
  "te-pati-maori": "https://www.maoriparty.org.nz/assets/logo.png",
  "te-tai-tokerau": "https://tetaitokerauparty.org.nz/logo.png",
  vision: "https://www.vision.org.nz/assets/logo.png",
  "womens-rights": "https://womensrightsparty.nz/logo.png",
};

/** Known brand colours for monogram / accent (not site theming). */
const COLOURS = {
  act: ["#FFD100", "#000000"],
  alliance: ["#E31837", "#FFFFFF"],
  "animal-justice": ["#2E8B57", "#FFFFFF"],
  alcp: ["#228B22", "#FFFFFF"],
  conservative: ["#1B4F72", "#FFFFFF"],
  "free-palestine": ["#CE1126", "#007A3D"],
  green: ["#00A651", "#FFFFFF"],
  labour: ["#D82A20", "#FFFFFF"],
  national: ["#005BBB", "#FFFFFF"],
  "nz-first": ["#000000", "#FFFFFF"],
  "nz-loyal": ["#0B3D91", "#FFFFFF"],
  "outdoors-freedom": ["#2E7D32", "#FFFFFF"],
  opportunity: ["#6B2D8B", "#FFFFFF"],
  "te-pati-maori": ["#000000", "#FFFFFF"],
  "te-tai-tokerau": ["#0D47A1", "#FFFFFF"],
  vision: ["#6A1B9A", "#FFFFFF"],
  "womens-rights": ["#C2185B", "#FFFFFF"],
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 nzpolitik-logo-fetch/1.0";

function hasMagick() {
  try {
    execFileSync("magick", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("text/html")) throw new Error(`HTML not image: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function absUrl(base, href) {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

async function discoverFromWebsite(website) {
  const res = await fetch(website, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`site HTTP ${res.status}`);
  const html = await res.text();
  const finalUrl = res.url;
  const candidates = [];

  const og =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    );
  if (og) candidates.push(absUrl(finalUrl, og[1]));

  const apple = html.match(
    /<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i,
  );
  if (apple) candidates.push(absUrl(finalUrl, apple[1]));

  const icon = html.match(
    /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i,
  );
  if (icon) candidates.push(absUrl(finalUrl, icon[1]));

  for (const m of html.matchAll(
    /<img[^>]+(?:class|alt|src)=["'][^"']*logo[^"']*["'][^>]*>/gi,
  )) {
    const src = m[0].match(/src=["']([^"']+)["']/i);
    if (src) candidates.push(absUrl(finalUrl, src[1]));
  }

  return [...new Set(candidates.filter(Boolean))];
}

function writePng(rawPath, destPng) {
  if (hasMagick()) {
    execFileSync(
      "magick",
      [
        rawPath,
        "-background",
        "none",
        "-resize",
        "512x512>",
        "-gravity",
        "center",
        "-extent",
        "512x512",
        destPng,
      ],
      { stdio: "inherit" },
    );
  } else {
    fs.copyFileSync(rawPath, destPng);
  }
}

function writeMonogramPng(id, abbreviation, primaryHex, destPng) {
  const label = abbreviation.slice(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="64" fill="${primaryHex}"/>
  <text x="256" y="290" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${label.length > 3 ? 96 : 140}" font-weight="700" fill="#ffffff">${label}</text>
</svg>`;
  const svgPath = path.join(outDir, `${id}.monogram.svg`);
  fs.writeFileSync(svgPath, svg);
  if (hasMagick()) {
    execFileSync("magick", [svgPath, destPng], { stdio: "inherit" });
    fs.unlinkSync(svgPath);
  } else {
    fs.copyFileSync(svgPath, destPng.replace(/\.png$/, ".svg"));
  }
}

async function resolveLogo(party) {
  const tries = [];
  if (CURATED[party.id]) tries.push(CURATED[party.id]);
  try {
    const discovered = await discoverFromWebsite(party.website);
    tries.push(...discovered);
  } catch (e) {
    console.warn(`discover ${party.id}:`, e.message);
  }
  // Common NationBuilder / WP patterns
  const origin = new URL(party.website).origin;
  tries.push(
    `${origin}/assets/logo.png`,
    `${origin}/logo.png`,
    `${origin}/images/logo.png`,
    `${origin}/wp-content/uploads/logo.png`,
  );

  for (const url of [...new Set(tries)]) {
    try {
      const buf = await fetchBuffer(url);
      if (buf.length < 500) continue;
      return { url, buf };
    } catch {
      /* try next */
    }
  }
  return null;
}

const branding = { parties: {} };
const report = [];

for (const party of parties) {
  const [primaryHex, secondaryHex] = COLOURS[party.id] || [
    "#0F1C24",
    "#FFFFFF",
  ];
  const dest = path.join(outDir, `${party.id}.png`);
  let logoSource = "none";
  let sourceUrl = null;

  const found = await resolveLogo(party);
  if (found) {
    const extGuess = found.url.includes(".svg")
      ? ".svg"
      : found.url.includes(".webp")
        ? ".webp"
        : found.url.includes(".jpg") || found.url.includes(".jpeg")
          ? ".jpg"
          : ".bin";
    const raw = path.join(outDir, `${party.id}.raw${extGuess}`);
    fs.writeFileSync(raw, found.buf);
    try {
      writePng(raw, dest);
      logoSource = "party_website";
      sourceUrl = found.url;
      fs.unlinkSync(raw);
    } catch (e) {
      console.warn(`convert ${party.id}:`, e.message);
      writeMonogramPng(party.id, party.abbreviation, primaryHex, dest);
      logoSource = "none";
    }
  } else {
    writeMonogramPng(party.id, party.abbreviation, primaryHex, dest);
    logoSource = "none";
  }

  branding.parties[party.id] = {
    logoFile: `${party.id}.png`,
    logoSource,
    primaryHex,
    secondaryHex,
    sourceIds: logoSource === "party_website" ? ["S130"] : ["S129", "S06"],
    lastVerified: "2026-10-11",
    ...(sourceUrl ? { sourceUrl } : {}),
  };
  report.push({
    id: party.id,
    logoSource,
    ok: fs.existsSync(dest),
    sourceUrl,
  });
  console.log(party.id, logoSource, sourceUrl || "(monogram)");
}

fs.writeFileSync(
  path.join(root, "src/data/branding.json"),
  JSON.stringify(branding, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(root, "notes/assets/logo-fetch-report.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log("wrote branding.json", report.filter((r) => r.logoSource !== "none").length, "website logos");
