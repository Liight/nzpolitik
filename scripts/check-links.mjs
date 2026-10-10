/**
 * @file check-links.mjs
 * @description Audit outbound URLs in sources.json and hard-coded src hrefs
 * @onboarding
 * - Run: npm run links:check
 * - Writes notes/YYYY-MM-DD-link-check.md (or path via --out)
 * - HEAD then GET; 404/410 = dead; 401/403/timeout/Incapsula = blocked
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const today = new Date().toISOString().slice(0, 10);
const outFlag = process.argv.indexOf("--out");
const positionalOut = process.argv.find(
  (a, i) => i >= 2 && !a.startsWith("-") && a.endsWith(".md"),
);
const outPath =
  outFlag >= 0
    ? process.argv[outFlag + 1]
    : positionalOut || path.join(root, "notes", `${today}-link-check.md`);

const UA =
  "nzpolitik-link-check/1.0 (+https://github.com/local; research audit)";

function collectFromSources() {
  const sources = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/sources.json"), "utf8"),
  );
  /** @type {{ url: string, refs: string[] }[]} */
  const rows = [];
  for (const [id, rec] of Object.entries(sources)) {
    if (rec?.url) rows.push({ url: rec.url, refs: [`sources.json:${id}`] });
  }
  return rows;
}

function collectHardCoded() {
  const srcDir = path.join(root, "src");
  const hrefRe = /https?:\/\/[^\s"'`)]+/g;
  /** @type {Map<string, string[]>} */
  const map = new Map();
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        if (name === "node_modules" || name === "dist") continue;
        walk(full);
        continue;
      }
      if (!/\.(tsx?|jsx?|json)$/.test(name)) continue;
      if (full.endsWith(`${path.sep}sources.json`)) continue;
      const text = fs.readFileSync(full, "utf8");
      const rel = path.relative(root, full).replace(/\\/g, "/");
      for (const match of text.matchAll(hrefRe)) {
        let url = match[0].replace(/[.,;]+$/, "");
        if (!map.has(url)) map.set(url, []);
        map.get(url).push(rel);
      }
    }
  }
  walk(srcDir);
  const election = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/election.json"), "utf8"),
  );
  for (const url of Object.values(election.links || {})) {
    if (typeof url === "string" && url.startsWith("http")) {
      if (!map.has(url)) map.set(url, []);
      map.get(url).push("src/data/election.json");
    }
  }
  return [...map.entries()].map(([url, refs]) => ({ url, refs }));
}

function mergeUrlLists(...lists) {
  /** @type {Map<string, Set<string>>} */
  const map = new Map();
  for (const list of lists) {
    for (const { url, refs } of list) {
      if (!map.has(url)) map.set(url, new Set());
      for (const r of refs) map.get(url).add(r);
    }
  }
  return [...map.entries()].map(([url, refs]) => ({
    url,
    refs: [...refs].sort(),
  }));
}

async function probe(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": UA, accept: "*/*" },
    });
    if (res.status === 405 || res.status === 501 || res.status === 403) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": UA, accept: "text/html,*/*" },
      });
    }
    const bodySnippet =
      res.status >= 400
        ? (await res.text().catch(() => "")).slice(0, 200)
        : "";
    clearTimeout(timer);
    const blockedHint =
      /incapsula|access denied|captcha|cloudflare/i.test(bodySnippet) ||
      res.status === 401 ||
      res.status === 403;
    if (res.status === 404 || res.status === 410) {
      return { status: "dead", http: res.status, finalUrl: res.url };
    }
    if (blockedHint) {
      return { status: "blocked", http: res.status, finalUrl: res.url };
    }
    if (res.status >= 200 && res.status < 400) {
      return { status: "ok", http: res.status, finalUrl: res.url };
    }
    if (res.status >= 500) {
      return { status: "blocked", http: res.status, finalUrl: res.url };
    }
    return { status: "blocked", http: res.status, finalUrl: res.url };
  } catch (err) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : String(err);
    return { status: "blocked", http: 0, finalUrl: url, error: msg };
  }
}

async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

const urls = mergeUrlLists(collectFromSources(), collectHardCoded());
console.log(`Checking ${urls.length} unique URLs...`);

const probed = await mapPool(urls, 6, async (row) => {
  const result = await probe(row.url);
  process.stdout.write(".");
  return { ...row, ...result };
});
console.log("");

const ok = probed.filter((r) => r.status === "ok");
const dead = probed.filter((r) => r.status === "dead");
const blocked = probed.filter((r) => r.status === "blocked");

function bulletList(rows) {
  if (rows.length === 0) return "_None_\n";
  return rows
    .map(
      (r) =>
        `- \`${r.http || "?"}\` ${r.url}\n  - refs: ${r.refs.join(", ")}${
          r.error ? `\n  - error: ${r.error}` : ""
        }`,
    )
    .join("\n");
}

const md = `# Link check ${today}

Automated \`npm run links:check\` against \`sources.json\` and hard-coded \`https://\` URLs under \`src/\`.

| Status | Count |
|--------|------:|
| ok | ${ok.length} |
| dead (404/410) | ${dead.length} |
| blocked / error | ${blocked.length} |
| total unique | ${probed.length} |

## Dead

${bulletList(dead)}

## Blocked / timeout / bot walls

These were **not** auto-removed. Spot-check in a real browser if the URL is user-facing.

${bulletList(blocked)}

## OK (sample)

Showing first 20 ok URLs:

${bulletList(ok.slice(0, 20))}
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, md);
console.log(`Wrote ${outPath}`);
console.log(
  `ok=${ok.length} dead=${dead.length} blocked=${blocked.length}`,
);
if (dead.length) {
  console.log("DEAD URLS:");
  for (const d of dead) console.log(`  ${d.http} ${d.url}`);
}
