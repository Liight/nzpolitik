# Tax and policy deep dive (2026-10-11)

## What changed

- Added structured tax dossier: `src/data/taxes.json` with instruments and per-party rows.
- Status enum: `announced` | `reported` | `denied` | `withdrawn` | `unknown`.
- UI: Tax section on party detail pages; `/compare/tax` matrix; nav Taxes link.
- Party notes under `notes/parties/*.md` now include tax tables + honesty blocks.
- New sources S30–S53 (Labour CGT, Greens tax package, National no-new-taxes/KiwiSaver, Opportunity Tax Reset, NZ First SME 20%, Te Pati Maori Kiwi Tax Plan, etc.).

## Headline tax findings (spot-check)

| Party | Key announced items |
|-------|---------------------|
| Labour | 28% CGT on investment/commercial property after 1 Jul 2027 (family home/farms exempt); leaked then announced (S30, S30a) |
| Greens | Wealth tax 2.5% above $10m; inheritance tax; company tax 33% large; bank levy; tax-free $10k; 45% top rate (S31) |
| National | No new taxes; reject CGT/wealth/inheritance; compulsory KiwiSaver to 12% by 2032 (S32, S32a) |
| ACT | No tax on KiwiSaver earnings; scrap net-zero/carbon tax framing (S35) |
| NZ First | 20% SME company tax under $30m turnover; exit Paris (S49, S48) |
| Te Pati Maori | ~$30k tax-free; wealth tax bands from $2m; 5% stamp duty; company tax 33% (S50, S53) |
| Opportunity | LVT ~1.75%, Citizen's Income, KiwiSaver 2.0 (S33) |
| Alliance | Tax-free first $20k + wealth tax; carbon tax (S34) |
| Vision | Tax-free first $25k (S38) |
| NZ Loyal | Replace taxes with 1% FTT (S39) |

## Rules

- Reported/leak items stay labelled `reported` until a party announcement exists.
- Unknown = searched, not invented.
- Wikipedia not used as sole citation.

## Minors research merge

Merged parallel minors tax research into Opportunity, Alliance, Conservatives, Vision, NZ Loyal, Te Tai Tokerau, AJP, NZOFP, ALCP, Women's Rights (sources S54-S69).

## Majors research merge

Merged parallel majors tax research into Labour, Greens, National, ACT, NZ First, Te Pati Maori (sources S70-S86): Green income bands, Labour Investment Boost/GST threshold/denied streaming levy, National student-loan 10%, ACT KiwiSaver PDF + net-zero page, TPM full Kiwi Tax Plan bands.
