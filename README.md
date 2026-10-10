# nzpolitik

Research and compare New Zealand political parties for the **2026 general election** (7 November 2026).

Unofficial voter-information site. Not affiliated with the Electoral Commission. Always verify enrolment and voting details on [vote.nz](https://vote.nz/).

## Purpose

- Browse all parties contesting the **party vote**
- Read short, cited policy summaries
- Compare parties side-by-side on fixed issue axes
- Follow links to primary sources (party sites, Electoral Commission)

## Setup

```powershell
cd d:\_AI_REPOS\nzpolitik
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm test` | Vitest suite (single run) |
| `npm run build` | Production build to `dist/` (base `/`) |
| `npm run build:pages` | Production build with base `/nzpolitik/` + `dist/404.html` |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript check |

## Deploy

**Live (GitHub Pages):** [https://liight.github.io/nzpolitik/](https://liight.github.io/nzpolitik/)

Use the **trailing slash** in the URL. Safari/iPhone often strips it; without `/` at the end GitHub used to show a platform 404 about missing `index.html`. Deploy from the `gh-pages` branch restores `/nzpolitik` → `/nzpolitik/` redirect.

Hosted from the dedicated **public** repo [`Liight/nzpolitik`](https://github.com/Liight/nzpolitik) (not the monorepo). Free GitHub Pages requires a public repo. Push to `main` runs [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml): `npm ci` → `npm test` → `npm run build:pages` → publish `dist/` to branch `gh-pages`.

First-time setup: repo **public**; **Settings → Pages → Deploy from a branch** → `gh-pages` / `/` (not GitHub Actions).

Local Pages-shaped build:

```powershell
cd d:\_AI_REPOS\nzpolitik
npm run build:pages
npm run preview
```

Other hosts: deploy `dist/` after `npm run build` (root base `/`) — Vercel, Azure Static Web Apps, Netlify.
## Disclaimer

Policy summaries are curated from cited primary sources and may lag party updates. Unknown positions are labelled as such — we do not invent stances. This site does not tell you how to vote.

Party logos are trademarks of their respective parties. They are stored locally (preferring Electoral Commission registered logos) for identification only on this unofficial, non-commercial site.

## Research refresh

Until election day, re-check weekly:

1. [Party lists PDF](https://vote.nz/assets/pagecomponent-file-files/Party-lists-for-the-2026-General-Election.pdf)
2. [Electoral Commission register](https://elections.nz/democracy-in-nz/political-parties-in-new-zealand/register-of-political-parties)
3. Party official websites linked from each party page

Update `notes/sources.md` with access dates when you refresh.

## Docs for agents

See [ONBOARDING.md](ONBOARDING.md), [DESIGN.md](DESIGN.md), [RESEARCH.md](RESEARCH.md), [CODE_RULES.md](CODE_RULES.md).
