# Party logos acquisition — 2026-10-11

## Sources

- **Primary:** Electoral Commission Register of Political Parties and Logos (29 Sep 2026 PDF) — S129
- **Declined logos:** Free Palestine, NZ Loyal (Aug 2026 decisions) — S06; use monogram / website when available

## Pipeline used

1. Direct curl to elections.nz blocked by Incapsula (212-byte HTML challenge).
2. PDF retrieved via browser CDP (`Network.loadNetworkResource` + `IO.read`) into `notes/assets/ec-register-logos-2026-09-29.pdf`.
3. `scripts/extract-party-logos.mjs` (pdfjs-dist) extracted 16 embedded images; one was the EC corporate logo (skipped).
4. Manual map in `notes/assets/ec-logo-map.json` → `public/party-logos/{id}.png` (ImageMagick normalize to 512x512).
5. Free Palestine / NZ Loyal: monogram PNGs; `logoSource: "none"`.

## Counts

- 15 parties: `electoral_commission`
- 2 parties: `none` (monogram) — Free Palestine, NZ Loyal
