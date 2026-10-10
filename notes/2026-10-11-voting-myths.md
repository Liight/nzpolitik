# Voting myths — 2026-10-11

## Scope

Cited MMP literacy rebuttals on `/democracy` (Voting myths), plus mobile compare scroll cue when results appear below a long party picker.

## Myths in `civic.json`

| id | Claim focus | Sources |
|----|-------------|---------|
| minor-wasted | Smaller party vote “wasted” | S05, S147 |
| only-electorate-matters | Only electorate vote matters | S02, S05 |
| must-vote-big-two | Must vote big party for government | S05, S147 |
| one-vote-useless | Single ballot cannot matter | S147, S02 |
| ticket-split-invalid | Ticket-split invalid/wrong | S02, S05 |

Non-prescriptive: explain the system; honest that below-threshold + no electorate means no list MPs; link About for threshold.

## Mobile compare cue

`CompareResultsAnchor` on policy / tax / coalition / track-record compare: when selection becomes ready, show md:hidden “Results ready — scroll down” + View results, and auto-scroll once to the matrix.

## Verify

`npm test` / `npm run build`. Live via `Liight/nzpolitik` gh-pages deploy.
