# nzpolitik - Agent Onboarding

> Unofficial NZ 2026 election site: browse, research, and compare party-vote parties with cited summaries.

## Quick Context

| Attribute | Value |
|-----------|-------|
| **Type** | Web App (static) |
| **Stack** | React, TypeScript, Vite, Tailwind, Vitest, Zod |
| **Status** | Active |

## Quick Start

```powershell
cd d:\_AI_REPOS\nzpolitik
npm install
npm run dev
npm test
```

## Architecture Overview

```
notes/sources.md + notes/parties/*.md  -->  src/data/*.json  -->  React pages
                                                      |
                                               Zod schemas + tests
```

- Research corpus is the source of truth
- UI only renders validated JSON
- Never invent a policy stance; use `unknown` with a source noting the search

## Key Files

| File | Purpose |
|------|---------|
| `src/main.tsx` | App entry |
| `src/App.tsx` | Routes |
| `src/data/*.json` | Election, parties, lists, policies |
| `src/lib/schema.ts` | Zod schemas |
| `src/lib/compare.ts` | Compare selection helpers |
| `src/lib/sources.ts` | Source ID lookup |
| `notes/sources.md` | Cited URL access log |
| `notes/parties/` | Per-party research notes |

## Testing

```powershell
npm test
npm run typecheck
```

### Test Strategy

- Unit: Zod schema validation for all data files
- Unit: compare selection (min/max parties)
- Unit: every policy row has at least one sourceId
- Unit: party count is 17

## Common Tasks

### Mobile layout check

1. DevTools device mode at **375px** width (spot-check 390)
2. Confirm header is a single row with hamburger; open menu, navigate, confirm panel closes
3. On each `/compare*` route with 2–4 parties selected: swipe hint visible, table scrolls inside its box (no page-level horizontal scroll), sticky row labels stay readable
4. Nav is drawer below `md`; desktop horizontal links from `md` up
5. `/democracy` should read as stacked cards/timeline with no horizontal page scroll

### Add a democracy timeline event or why-vote block

1. Add citation URLs to `notes/sources.md` + `src/data/sources.json` (new Sxx IDs)
2. Edit `src/data/civic.json` (`history` or `whyVote`); keep every item with `sourceIds`
3. If changing the turnout worked example numbers, update `turnoutExample` and confirm `src/lib/turnout.test.ts` still matches
4. Note research in `notes/2026-10-11-democracy-civic.md` (or a new dated note)
5. Stay non-prescriptive — no party preference language
6. Run `npm test`

### Citation chips and link health

- UI chips show `sources.json` **`usedFor`** text (e.g. "MMP threshold…"), not bare `S05`. Keep `usedFor` short and descriptive when adding sources.
- After adding or changing URLs: `npm run links:check` → report in `notes/*-link-check.md`. Fix any **dead** (404/410) before shipping. **Blocked** (403/timeout) often means bot walls — verify in a real browser before deleting.
- Archive: first audit notes in `notes/2026-10-11-link-check.md`.

### Add or update a party policy

1. Find/add URL in `notes/sources.md` (new Sxx ID) with a clear `usedFor` label
2. Update `notes/parties/<slug>.md`
3. Update `src/data/policies.json` with summary + sourceIds + lastVerified
4. Sync `src/data/sources.json` if you added source IDs
5. Run `npm test` and `npm run links:check` if URLs changed

### Add a tax row

1. Add citation to `notes/sources.md` + `src/data/sources.json`
2. Append a row in `src/data/taxes.json` under the party id (`status`: announced/reported/denied/withdrawn/unknown)
3. Update the Tax dossier table in `notes/parties/<slug>.md`
4. Refresh `economy_tax` summary in `policies.json` if the headline tax story changed
5. Run `npm test`

### Add or refresh coalition / viability rows

1. Research published preferences (party site, RNZ/Stuff/Herald, signed coalition PDFs)
2. Update `src/data/coalition.json` and/or `src/data/viability.json` (or re-run `node scripts/build-coalition-viability.mjs` after editing that script's curated block)
3. Sync new source IDs into `notes/sources.md` + `src/data/sources.json`
4. Append **Coalition** / **Viability** sections in `notes/parties/<slug>.md`
5. Use `unknown` / empty arrays when nothing clear is published — do not invent deals
6. Run `npm test`

### Refresh party logos

1. Download the latest EC *Register of Political Parties and Logos* PDF into `notes/assets/ec-register-logos-YYYY-MM-DD.pdf` (browser required if Incapsula blocks curl)
2. Point `scripts/extract-party-logos.mjs` at that path if the filename changed; run `node scripts/extract-party-logos.mjs`
3. Map new extracts via `notes/assets/ec-logo-map.json` into `public/party-logos/{id}.png` (ImageMagick `magick`)
4. For parties with no registered logo (e.g. Free Palestine, NZ Loyal), run `node scripts/fetch-party-logos.mjs` or keep monogram; set `logoSource` in `branding.json`
5. Cite the register PDF as S129 (or new id); run `npm test`

### Add a track-record row

1. Confirm the party is one of: `national`, `labour`, `green`, `act`, `nz-first`, `te-pati-maori` (others stay empty-state unless research adds ≥3 cited in-window rows and updates `TRACK_RECORD_PARTY_IDS`)
2. Pick a window id from `track-record.json` `windows` (`2005-2008`, `2008-2017`, `2017-2020`, `2020-2023`, `2023-2026`) and a valid `issueId`
3. Add pledge source + outcome source to `notes/sources.md` and `src/data/sources.json` (same citation bar for older windows — Beehive, legislation.govt.nz, Budget, Hansard, established NZ news, party archives)
4. Append the row in `src/data/track-record.json` with `status`, `role`, ≥2 `sourceIds`, `lastVerified`
5. Document the row under **Track record** in `notes/parties/<slug>.md`
6. Use `blocked_coalition` only when partner veto is evidenced; never invent opposition "government delivery"
7. Prefer governing/support rows; opposition only when a clear campaign pledge vs later parliamentary outcome is citable
8. Run `npm test` (filters auto-pick up new windows from `trackRecordFile.windows` — no hardcoded UI enum chase)
9. Bulk historical merges: `node scripts/merge-track-record-20yr.mjs` is idempotent by row id (re-run only when extending that script's defs)

### Refresh after Electoral Commission update

1. Re-fetch party lists PDF and register
2. Update `lists.json` / `parties.json` / `election.json`
3. Bump access dates in `notes/sources.md`
4. Run tests

### Deploy to GitHub Pages

1. Repo is **`Liight/nzpolitik`** (dedicated, **public** — private repos need a paid Pages plan)
2. Pages source: branch **`gh-pages`** / root (workflow publishes `dist/` there)
3. Push `main` → workflow `Deploy GitHub Pages` runs `npm run build:pages` then `peaceiris/actions-gh-pages`
4. Live URL (keep trailing slash): `https://liight.github.io/nzpolitik/`
5. Locally verify Pages base: `npm run build:pages` then `npm run preview` (asset paths under `/nzpolitik/`)

## Gotchas & Pitfalls

- PowerShell: use `;` not `&&`
- GitHub Pages project URL needs `base: /nzpolitik/` — use `npm run build:pages`, not plain `npm run build`, for that target
- iPhone/Safari: bare `.../nzpolitik` (no slash) hit a platform 404 about `index.html`; prefer the slash URL; `gh-pages` branch deploy should redirect bare → slash
- Do not point monorepo `origin` at `Liight/nzpolitik`; keep a separate git remote inside `nzpolitik/`
- Official register page may be blocked by bot protection; use PDF downloads and vote.nz assets
- EC logo register PDF is often Incapsula-blocked from curl/PowerShell — open in a real browser and save to `notes/assets/`, then extract with `scripts/extract-party-logos.mjs`
- PowerShell does not support bash heredocs (`<<'EOF'`); write `.mjs` scripts instead
- Wikipedia is discovery only — never sole citation
- Te Pati Maori official list may be very short (electorate-focused strategy); do not invent list members
- After editing `notes/sources.md`, regenerate `src/data/sources.json` (keep IDs in sync) or tests that check source IDs will fail
- `npm run build` runs `tsc --noEmit` then Vite; do not use `tsc -b` (no project references)

## Roadmap

See [ROADMAP.md](ROADMAP.md).

---

*Last updated: October 2026*
