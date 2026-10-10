# Track-record ~20-year deep dive — 2026-10-11

## Scope

Extended `track-record.json` from two windows (2020–2026) to five term windows covering ~2005–2026 for the six parliamentary / support parties. Research target for expanding the compare pool: Alliance and any other 2026 ballot party with verified coalition / confidence-and-supply roles.

## Windows

| id | Label |
|----|--------|
| `2005-2008` | 2005-2008 Labour-led government |
| `2008-2017` | 2008-2017 National-led governments |
| `2017-2020` | 2017-2020 Labour–NZ First–Greens |
| `2020-2023` | 2020-2023 Labour-led government |
| `2023-2026` | 2023-2026 National–ACT–NZ First |

UI filters derive from `trackRecordFile.windows` (party detail + `/compare/track-record`).

## Row counts after merge (`scripts/merge-track-record-20yr.mjs`)

| Party | Rows | Distinct windows |
|-------|------|------------------|
| national | 14 | 4 (power: 2008–2017, 2023–2026) |
| labour | 18 | 5 (power: 2005–2008, 2017–2020, 2020–2023) |
| green | 9 | 4 |
| act | 11 | 4 |
| nz-first | 9 | 3 |
| te-pati-maori | 8 | 3 (2008–2017 rows are Maori Party support lineage) |

Every row: pledge + outcome + status + role + ≥2 `sourceIds` + `lastVerified`. New sources **S159–S215** in `notes/sources.md` / `sources.json`.

## Alliance / pool decision

- Alliance government role is **1999–2002** (pre-window). No ≥3 in-window cited rows → **not** added to `TRACK_RECORD_PARTY_IDS`.
- No other 2026 ballot parties (outside the six) had verified government/C&S/coalition roles inside 2005–2026. United Future / Progressives are not on the 2026 party-vote list.

## Rituals

- Schema: `TRACK_RECORD_WINDOW_IDS` length 5; tests require five windows + ≥3 cited rows per track-record party.
- Docs: DESIGN What/Why/How; ONBOARDING older-window row steps; ROADMAP 20y item done.
- Archive: `plans-archive/nzpolitik/2026-10-11-track-record-20yr-deep-dive.md`

## Out of scope (unchanged)

Seat calculator, values quiz, scandal feeds, inventing outcomes without sources, full Hansard module.
