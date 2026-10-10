# Link check 2026-10-10

Automated `npm run links:check` against `sources.json` and hard-coded `https://` URLs under `src/`.

| Status | Count |
|--------|------:|
| ok | 179 |
| dead (404/410) | 2 |
| blocked / error | 10 |
| total unique | 191 |

## Dead

- `404` https://help.vote.nz/hc/en-nz/articles/360001670975-How-our-electoral-system-works
  - refs: sources.json:S05, sources.json:S138, src/data/election.json
- `404` https://www.parliament.nz/en/visit-and-learn/how-parliament-works/parliamentary-practice-in-new-zealand-2017-by-chapter/chapter-3-electoral/
  - refs: sources.json:S157

## Blocked / timeout / bot walls

These were **not** auto-removed. Spot-check in a real browser if the URL is user-facing.

- `403` https://nzloyal.com/
  - refs: sources.json:S20, src/data/parties.json
- `403` https://nzloyal.com/policy/
  - refs: sources.json:S20a
- `403` https://nzloyal.com/immigration/
  - refs: sources.json:S20b
- `403` https://nzloyal.com/economics/
  - refs: sources.json:S20c, sources.json:S39
- `402` https://nzloyal.org.nz/pages/policy-overview
  - refs: sources.json:S20d
- `?` https://outdoorsparty.co.nz/thriving-people-policies/
  - refs: sources.json:S21c
  - error: fetch failed
- `?` https://outdoorsparty.co.nz/
  - refs: sources.json:S21d
  - error: fetch failed
- `403` https://nzloyal.com/tax/
  - refs: sources.json:S61
- `403` https://nzloyal.com/wp-content/uploads/2025/05/NZ-LOYAL-1_-TRANSACTION-TAX.pdf
  - refs: sources.json:S62
- `403` https://www.health.govt.nz/information-releases/cabinet-and-briefing-material-smokefree-2025-progressing-coalition-agreement-commitments-and
  - refs: sources.json:S111

## OK (sample)

Showing first 20 ok URLs:

- `200` https://elections.nz/media-and-news/2026/key-dates-for-2026-general-election
  - refs: sources.json:S01, src/data/election.json
- `200` https://vote.nz/2026-general-election/about/overview
  - refs: sources.json:S02, src/data/election.json
- `200` https://elections.nz/guidance-and-rules/candidate-hub/becoming-a-candidate/standing-as-a-candidate-for-the-2026-general-election
  - refs: sources.json:S03
- `200` https://vote.nz/assets/pagecomponent-file-files/Party-lists-for-the-2026-General-Election.pdf
  - refs: sources.json:S04, src/data/election.json, src/data/lists.json
- `200` https://elections.nz/media-and-news/2026/decisions-on-party-registrations-and-logos
  - refs: sources.json:S06
- `200` https://elections.nz/democracy-in-nz/political-parties-in-new-zealand/register-of-political-parties
  - refs: sources.json:S07
- `200` https://www.act.org.nz/
  - refs: sources.json:S10, src/data/parties.json
- `200` https://www.act.org.nz/policies/economy
  - refs: sources.json:S10a, sources.json:S35
- `200` https://www.act.org.nz/policies/health
  - refs: sources.json:S10b
- `200` https://www.act.org.nz/policies/infrastructure
  - refs: sources.json:S10c
- `200` https://allianceparty.nz/
  - refs: sources.json:S11, src/data/parties.json
- `200` https://allianceparty.nz/what-we-stand-for/
  - refs: sources.json:S11a, sources.json:S34
- `200` https://animaljustice.org.nz/
  - refs: sources.json:S12, src/data/parties.json
- `200` https://animaljustice.org.nz/policy/our-policies/
  - refs: sources.json:S12a
- `200` https://animaljustice.org.nz/about/our-people/
  - refs: sources.json:S12b
- `200` https://www.alcp.org.nz/
  - refs: sources.json:S13, sources.json:S44, src/data/parties.json
- `200` https://www.conservatives.nz/
  - refs: sources.json:S14
- `200` https://www.palfree.nz/
  - refs: sources.json:S15, sources.json:S47, src/data/parties.json
- `200` https://www.greens.org.nz/
  - refs: sources.json:S16, src/data/parties.json
- `200` https://www.greens.org.nz/manifesto_2026
  - refs: sources.json:S16a
