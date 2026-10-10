# nzpolitik — Research Reference

**Last verified**: 2026-10-11 (tax dossier added; see `notes/2026-10-11-tax-and-policy-deep-dive.md`)

## Election facts

| Fact | Value | Source |
|------|-------|--------|
| Election day | Saturday 7 November 2026 | S01 |
| Advance voting starts | 26 October 2026 | S01, S02 |
| Overseas voting starts | 21 October 2026 | S01 |
| Nominations closed | Noon 8 October 2026 | S01, S03 |
| Official results declared | 27 November 2026 | S01 |
| Party lists (authoritative) | vote.nz PDF | S04 |

## MMP (how seats work)

A party needs **5% of the party vote** OR **at least one electorate seat** to enter Parliament under the threshold rules explained by the Electoral Commission (S05). Voters cast two votes: party vote and electorate vote (S02, S05).

## Party-vote parties (17)

Authoritative list from S04 (Party lists for the 2026 General Election PDF):

1. ACT New Zealand
2. Alliance Party
3. Animal Justice Party Aotearoa New Zealand
4. Aotearoa Legalise Cannabis Party
5. Conservative Party NZ
6. Free Palestine
7. Green Party
8. Labour Party
9. National Party
10. New Zealand First Party
11. New Zealand Loyal
12. NZ Outdoors & Freedom Party
13. Opportunity Party
14. Te Pati Maori
15. Te Tai Tokerau Party
16. Vision New Zealand
17. Womens Rights Party

Registration context: S06 (August 2026 registration decisions), S07 (register page / PDFs).

## Version-check protocol

Weekly until 7 Nov 2026:

1. Re-download S04 party lists PDF — confirm 17 parties and list ranks
2. Check S01/S02 key dates unchanged
3. Spot-check each party website in `parties.json`
4. Update `notes/sources.md` Accessed column
5. Run `npm test`

## Tax dossier

Machine data: `src/data/taxes.json`. UI: party detail Tax section + `/compare/tax`.

Status meanings:

| Status | Meaning |
|--------|---------|
| announced | Party website or official policy PDF |
| reported | Established NZ news (may include leaks) — not official until announced |
| denied / withdrawn | Explicit walk-back |
| unknown | Searched; no clear proposal found |

## Decision records

See [DESIGN.md](DESIGN.md) for stack, data model, and neutrality choices.
