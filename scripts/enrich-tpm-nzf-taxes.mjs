/**
 * @file enrich-tpm-nzf-taxes.mjs
 * @description Enrich Te Pati Maori and NZ First tax dossier rows
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const V = "2026-10-11";

const sources = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/sources.json"), "utf8"),
);
let notes = fs.readFileSync(path.join(root, "notes/sources.md"), "utf8");
const extras = [
  [
    "S49",
    "https://www.nzfirst.nz/20_tax_rate_for_smes",
    "NZ First 20% SME company tax",
  ],
  [
    "S50",
    "https://www.rnz.co.nz/news/politics_election-2026/1133037/te-pati-maori-unveils-kiwi-tax-plan-with-new-5-percent-stamp-duty",
    "RNZ Te Pati Maori Kiwi Tax Plan",
  ],
  [
    "S51",
    "https://thespinoff.co.nz/politics/27-08-2026/te-pati-maoris-tax-plan-30k-tax-free-a-new-stamp-duty-and-a-kai-credit",
    "Spinoff Te Pati Maori tax plan",
  ],
  [
    "S52",
    "https://www.maoriparty.org.nz/tax-calculator",
    "Te Pati Maori tax calculator",
  ],
  [
    "S53",
    "https://img.scoop.co.nz/media/pdfs/2608/A_Kiwi_Tax_Plan.pdf",
    "Te Pati Maori Kiwi Tax Plan PDF",
  ],
];
for (const [id, url, used] of extras) {
  sources[id] = { id, url, accessed: V, usedFor: used };
  if (!notes.includes(`| ${id} |`)) {
    notes = `${notes.trimEnd()}\n| ${id} | ${url} | ${V} | ${used} |`;
  }
}
notes += "\n";
fs.writeFileSync(
  path.join(root, "src/data/sources.json"),
  JSON.stringify(sources, null, 2),
);
fs.writeFileSync(path.join(root, "notes/sources.md"), notes);

const taxes = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/taxes.json"), "utf8"),
);
const row = (
  id,
  instrument,
  title,
  summary,
  rateOrThreshold,
  status,
  sourceIds,
) => ({
  id,
  instrument,
  title,
  summary,
  rateOrThreshold,
  status,
  sourceIds,
  lastVerified: V,
});

taxes.parties["nz-first"] = [
  row(
    "nzf-sme-company-tax",
    "company_tax",
    "20% company tax for SMEs under $30m turnover",
    "Announced campaign policy: lower SME company tax from 28% to 20% for companies with turnover under $30 million.",
    "20% company tax if turnover under $30m",
    "announced",
    ["S49", "S36"],
  ),
  row(
    "nzf-paris-ets",
    "carbon_ets",
    "Withdraw from Paris Accord",
    "Announced policy to withdraw from the Paris Accord and resist emissions pricing without trading-partner parity.",
    "Exit Paris; condition emissions pricing on peers",
    "announced",
    ["S48", "S19g"],
  ),
  row(
    "nzf-income-tax-unknown",
    "income_tax",
    "No 2026 income-tax scale confirmed on policy hub",
    "2026 policy hub emphasis is SME company tax rather than a full personal income-tax scale in this pass.",
    "n/a",
    "unknown",
    ["S36"],
  ),
  row(
    "nzf-cgt-unknown",
    "capital_gains",
    "No CGT proposal found on 2026 hub",
    "No clear capital gains tax proposal on the 2026 policy hub pages checked.",
    "n/a",
    "unknown",
    ["S36"],
  ),
  row(
    "nzf-wealth-unknown",
    "wealth_tax",
    "No wealth tax proposal found on 2026 hub",
    "No clear wealth tax proposal on the 2026 policy hub pages checked.",
    "n/a",
    "unknown",
    ["S36"],
  ),
];

taxes.parties["te-pati-maori"] = [
  row(
    "tpm-income-tax-free",
    "income_tax",
    "$30k tax-free threshold (Kiwi Tax Plan)",
    "Kiwi Tax Plan: raise tax-free threshold so most people pay less PAYE; calculator on party site. Official tax page emphasises wealthiest paying fair share.",
    "About $30,000 tax-free (per plan PDF/news)",
    "announced",
    ["S50", "S51", "S52", "S37"],
  ),
  row(
    "tpm-wealth-tax",
    "wealth_tax",
    "Tiered net wealth tax above $2m",
    "Kiwi Tax Plan: 1.5% on net wealth $2m-$5m, 2% on $5m-$10m, 2.5% above $10m; excludes under $2m.",
    "0% to $2m; 1.5% / 2% / 2.5% above bands",
    "announced",
    ["S53", "S50", "S37"],
  ),
  row(
    "tpm-stamp-duty",
    "other_levy",
    "5% stamp duty / property levy",
    "New 5% stamp duty as part of Kiwi Tax Plan (RNZ / Spinoff).",
    "5% stamp duty",
    "announced",
    ["S50", "S51"],
  ),
  row(
    "tpm-company-tax",
    "company_tax",
    "Return company tax to 33%",
    "Plan includes returning company tax from 28% to 33%, plus measures on offshore profit shifting.",
    "33% company tax",
    "announced",
    ["S51"],
  ),
  row(
    "tpm-land-banking",
    "land_tax",
    "Land-banking and vacant house taxes",
    "Land-banking and vacant house taxes at 33% in the Kiwi Tax Plan package (Spinoff summary of plan).",
    "33% on land-banking / vacant houses",
    "reported",
    ["S51"],
  ),
];

fs.writeFileSync(
  path.join(root, "src/data/taxes.json"),
  JSON.stringify(taxes, null, 2),
);

const policies = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/policies.json"), "utf8"),
);
policies.policies["nz-first"].economy_tax.summary =
  "Announced 20% company tax for SMEs under $30m turnover; withdraw from Paris Accord — see tax dossier.";
policies.policies["nz-first"].economy_tax.sourceIds = ["S49", "S36"];
policies.policies["nz-first"].economy_tax.lastVerified = V;
policies.policies["te-pati-maori"].economy_tax.summary =
  "Kiwi Tax Plan: about $30k tax-free, tiered wealth tax above $2m, 5% stamp duty, company tax to 33% — see tax dossier.";
policies.policies["te-pati-maori"].economy_tax.sourceIds = [
  "S37",
  "S50",
  "S53",
];
policies.policies["te-pati-maori"].economy_tax.lastVerified = V;
fs.writeFileSync(
  path.join(root, "src/data/policies.json"),
  JSON.stringify(policies, null, 2),
);

console.log("enriched TPM and NZ First taxes");
