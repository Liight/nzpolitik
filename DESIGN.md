# nzpolitik — Design Decisions

## Stack: React + Vite + TypeScript + Tailwind + Vitest

### What

Static SPA with curated JSON data and client-side routing.

### Why this over alternatives

- **Next.js**: unnecessary SSR/API surface for content that is curated offline
- **CMS**: slower to stand up; research already lives in git-tracked notes
- **Python backend**: no dynamic personalisation in MVP

### How it works

Vite builds static assets. React Router serves Home, Parties, Party detail, Compare, About. Data is imported from `src/data/*.json` and validated with Zod at test time (and optionally at runtime load helpers).

## Data model: research notes -> JSON -> UI

### What

Four JSON files: `election.json`, `parties.json`, `lists.json`, `policies.json`, keyed by party slug.

### Why this over alternatives

- Keeps citations auditable in markdown while giving the UI a stable schema
- Avoids scraping (ToS / fragility)
- Zod tests catch missing parties or unsourced policy rows

### How it works

Agents update notes and sources first, then sync JSON fields. UI components never hardcode policy text.

## Tax dossier: structured instruments with status

### What

`taxes.json` stores per-party tax/fiscal proposals by instrument (income, CGT, wealth, land, GST, company, carbon/ETS, KiwiSaver, other), each with `status`.

### Why this over alternatives

- Flattening tax into `economy_tax` hid rates and leak-vs-announce distinctions (e.g. Labour CGT).
- A CMS was unnecessary for curated static content.

### How it works

Party detail renders `TaxDossier`; `/compare/tax` picks the strongest-status row per instrument. Tests require every party to have at least one cited tax row.

## Track record: campaign vs delivery (~20 years)

### What

`track-record.json` stores cited pledge/outcome rows across five term windows (~2005–2026) for the six parties with parliamentary power or support roles: `national`, `labour`, `green`, `act`, `nz-first`, `te-pati-maori`. Windows: 2005–2008 Labour-led; 2008–2017 National-led; 2017–2020 Labour–NZ First–Greens; 2020–2023 Labour-led; 2023–2026 National–ACT–NZ First. Status enum: `delivered | partial | not_delivered | blocked_coalition | superseded | ongoing | unknown`. Role: `governing | support | opposition`.

### Why this over alternatives

- Voters already see platforms; credibility needs evidence of past delivery under MMP constraints.
- Two recent terms alone miss National 2008–2017 delivery and Labour 2005–2008 / 2017–2020 coalition bargains that still shape 2026 debates.
- A multi-decade scandal feed or uncited Hansard dump would amplify cherry-picking and defamation risk; five labelled government windows keep the bar evidence-first.
- Alliance (1999–2002 coalition) stays off the compare pool: history is pre-window and the 2026 registry entity lacks ≥3 in-window cited rows.

### How it works

Each row requires ≥2 `sourceIds` (pledge + outcome). Party detail renders `TrackRecordSection` between Tax and Policy with a window filter derived from `trackRecordFile.windows`. `/compare/track-record` uses the same window list and picks the best status per issue for selected parties. Other parties get an empty state linking to taxes/policies. Schema tests require five windows and ≥3 rows for each of `TRACK_RECORD_PARTY_IDS`. TPM 2008–2017 rows are Maori Party support lineage under National-led governments, labelled in outcomes.

## Neutrality: short cited summaries

### What

Each issue axis gets a short factual summary plus `sourceIds`. Missing evidence becomes `stance: "unknown"`.

### Why this over alternatives

- Primary-source links only: harder for voters to skim
- Rich pros/cons editorials: higher bias risk and legal/editorial burden

### How it works

`CODE_RULES.md` forbids UI policy text without sourceIds. Compare matrix shows stance label + summary + citation chips. Citation chips display the human-readable `usedFor` label from `sources.json` (not bare `Sxx` ids); run `npm run links:check` to catch 404s.

## Visual direction: civic fern/ink

### What

Deep ink blues/greens, fern accent, Fraunces display + Source Sans body.

### Why this over alternatives

Avoids default AI purple gradients and cream/terracotta cliches while staying readable and NZ-coded without party colours as branding.

### How it works

CSS variables / Tailwind theme tokens in `tailwind.config.js` and `src/index.css`.

Below `md`, primary nav collapses to a hamburger panel in `Layout.tsx` (closes on navigate, Escape, or outside tap). Compare matrices use `CompareScroll` for swipe hint, edge fade, and sticky first-column cells so phones can pan without page-level horizontal scroll.

## Coalition preferences and MMP viability

### What

`coalition.json` stores published prefers / rules-out / bottom lines with stance (`open|selective|ruling_out|unknown`). `viability.json` stores short MMP threshold notes, electorate strategy, and list length per party.

### Why this over alternatives

- Platforms alone omit who can form government and what gets vetoed under MMP.
- Seat calculators and polls are deferred (volatility / third-party labelling).
- Invented deal maths would mislead; unknown is preferred over speculation.

### How it works

Party detail shows Coalition section + MMP context line. `/compare/coalition` matrices rows; About explains the 5% threshold without telling anyone how to vote. Track-record compare at `/compare/track-record` uses the five-window rows for the six parliamentary / support parties.

## Civic education: democracy & why vote

### What

`/democracy` presents cited why-vote copy (including a low-turnout arithmetic example) and a NZ democratic history timeline from `civic.json`.

### Why this over alternatives

- Party compare alone assumes voters already know why turnout matters and how the franchise evolved.
- A separate values quiz or seat calculator would push toward prescription or prediction; this page stays explanatory.
- Two nav destinations would crowd chrome; one page with Why vote first then History is enough.

### How it works

Content is Zod-validated JSON with `sourceIds` on every block. `turnout.ts` computes effective share of enrolled electors for the worked example. Official enrol/vote links reuse `election.links`. MMP threshold detail stays on `/about`.

## Hosting: GitHub Pages (dedicated repo)

### What

Public site at `https://liight.github.io/nzpolitik/` from repo `Liight/nzpolitik`, deployed by Actions from `dist/` after `npm run build:pages`.

### Why this over alternatives

- Monorepo `Liight/wave-survivour` already owns that repo's single Pages site (Wave Survivor); adding nzpolitik there would overwrite it.
- Project Pages under `/nzpolitik/` needs Vite `base` + React Router `basename` + `404.html` SPA fallback; a root user site (`liight.github.io`) would force a different deploy layout.
- Vercel/Netlify work but the account already uses GitHub Pages elsewhere; one Actions workflow keeps deploy in-repo.

### How it works

`GITHUB_PAGES=true` (via `npm run build:pages`) sets Vite `base` to `/nzpolitik/`. `BrowserRouter` uses `import.meta.env.BASE_URL`. `postbuild` copies `index.html` to `404.html` so deep links refresh on Pages. Workflow: test → build:pages → `upload-pages-artifact` → `deploy-pages`. Enable **Settings → Pages → Source: GitHub Actions** once.

## Party logos (identification only)

### What

`branding.json` + `public/party-logos/{id}.png` store ballot/registered logos (Electoral Commission register PDF preferred) with website/monogram fallbacks. Each row has `primaryHex` / `secondaryHex` for accents.

### Why this over alternatives

- Hotlinking party CDNs breaks and mixes trademarks into runtime dependency.
- Full party-colour page themes would fight the civic fern/ink site brand and imply endorsement.
- EC register logos match ballot recognition better than marketing OG images.

### How it works

`PartyLogo` renders the local PNG (monogram fallback on error). Parties/Detail/Compare show logos; cards may use a 3px `primaryHex` top border only. Refresh via `scripts/extract-party-logos.mjs` + `scripts/fetch-party-logos.mjs` (EC PDF often Incapsula-blocked from curl — use a real browser download into `notes/assets/`).
