# nzpolitik — Code Rules

## Citations (non-negotiable)

- Every policy summary shown in the UI MUST have at least one `sourceId` that exists in `notes/sources.md` and `src/data/sources.json`.
- Do not invent party positions. Use `stance: "unknown"` and note the search date.
- Source priority: Electoral Commission / vote.nz > party official sites > Hansard/Beehive > established NZ news. Wikipedia is discovery only.
- Tax rows in `taxes.json` MUST set `status` correctly: use `reported` for news/leak coverage; never label a leak as `announced` without a party announcement.
- Track-record rows in `track-record.json` MUST have ≥2 `sourceIds` (pledge + outcome). Use status enum only — no lie/betrayal language. Use `blocked_coalition` only with evidenced partner veto.
- Party logos MUST be local files under `public/party-logos/` referenced from `branding.json`. Do not hotlink. Do not retheme pages with party colours (accent/monogram only).
- Coalition and viability copy MUST stay non-prescriptive (no “don’t vote for X”). Use `unknown` when unpublished; never invent coalition maths.

## File headers

Every source file under `src/` starts with the monorepo `@file` / `@description` / `@onboarding` block.

## Tests

- TDD for logic and data validation
- Party count must remain 17 for the 2026 party-vote MVP unless Electoral Commission publishes a change (then update RESEARCH.md)

## Mermaid

Follow root AGENTS.md mermaid rules (no spaces in node IDs, quote special labels, no inline colours).

## Neutrality

- No endorsements, rankings, or "best party" language
- No scraped paywalled content pasted into the repo
- Disclaimer visible on home and about pages
