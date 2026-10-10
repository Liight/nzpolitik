/**
 * @file merge-minors-tax-research.mjs
 * @description Merge 2026-10-11 minors tax research into taxes.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const V = "2026-10-11";
const row = (id, instrument, title, summary, rateOrThreshold, status, sourceIds) => ({
  id,
  instrument,
  title,
  summary,
  rateOrThreshold,
  status,
  sourceIds,
  lastVerified: V,
});

const extras = [
  [
    "S54",
    "https://cdn.opportunity.org.nz/documents/policy/Opportunity%20Policy%20-%20Tax%20Reset.pdf",
    "Opportunity Tax Reset PDF",
  ],
  [
    "S55",
    "https://allianceparty.nz/wp-content/uploads/2026/09/alliance-tax-justice-cost-of-living-policy-2026.pdf",
    "Alliance tax justice PDF",
  ],
  [
    "S56",
    "https://allianceparty.nz/wp-content/uploads/2026/09/alliance-tax-policy-costings-2026.pdf",
    "Alliance tax costings PDF",
  ],
  [
    "S57",
    "https://allianceparty.nz/alliance-tax-plan-first-20000-income-tax-free/",
    "Alliance tax plan release",
  ],
  [
    "S58",
    "https://allianceparty.nz/wp-content/uploads/2026/09/alliance-environment-climate-sustainable-economy-policy-2026.pdf",
    "Alliance environment/climate PDF",
  ],
  [
    "S59",
    "https://conservatives.org.nz/policies/economy-1/",
    "Conservative economy policy",
  ],
  [
    "S60",
    "https://conservatives.org.nz/policies/superannuation/",
    "Conservative superannuation / tax relief",
  ],
  [
    "S61",
    "https://nzloyal.com/tax/",
    "NZ Loyal monetary and taxation page",
  ],
  [
    "S62",
    "https://nzloyal.com/wp-content/uploads/2025/05/NZ-LOYAL-1_-TRANSACTION-TAX.pdf",
    "NZ Loyal 1% transaction tax PDF",
  ],
  [
    "S63",
    "https://animaljustice.org.nz/wp-content/uploads/2026/09/AJP-Transition-to-Plant-based-economy-policies.pdf",
    "AJP plant-based transition PDF",
  ],
  [
    "S64",
    "https://nzofp.co.nz/agriculture-policy",
    "NZOFP agriculture / Paris stance",
  ],
  [
    "S65",
    "https://nzofp.co.nz/pae-ora-health-futures-bill-nzofp-submission",
    "NZOFP Pae Ora submission unhealthy food tax",
  ],
  [
    "S66",
    "https://www.alcp.org.nz/policy",
    "ALCP policy page",
  ],
  [
    "S67",
    "https://womensrightsparty.nz/policy-proposal/working-for-families-reform/",
    "WRP Working for Families reform",
  ],
  [
    "S68",
    "https://womensrightsparty.nz/policy-proposal/financial-stability-for-women-in-older-age/",
    "WRP financial stability / KiwiSaver carers",
  ],
  [
    "S69",
    "https://www.opportunity.org.nz/climate_action",
    "Opportunity climate / ETS",
  ],
];

const sources = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/sources.json"), "utf8"),
);
let notes = fs.readFileSync(path.join(root, "notes/sources.md"), "utf8");
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

taxes.parties.opportunity = [
  row(
    "opp-income-scale",
    "income_tax",
    "Tax Reset income scale + Citizen's Income",
    "Three personal brackets plus universal Citizen's Income for adults 18+; replaces most main benefits with top-ups (Tax Reset PDF).",
    "28% to $50k; 34% $50k-$200k; 39% above $200k; CI about $19,400/yr",
    "announced",
    ["S54", "S33"],
  ),
  row(
    "opp-lvt",
    "land_tax",
    "National land value tax",
    "Annual tax on unimproved land value to fund Citizen's Income; exemptions/deferrals for some public/Maori/social uses, retirees, farmers. Transition starts lower on urban land.",
    "1.75% urban; 0.5% rural (transition from 0.5% urban)",
    "announced",
    ["S54", "S33", "S33a"],
  ),
  row(
    "opp-kiwisaver-2",
    "kiwisaver_super",
    "KiwiSaver 2.0 compulsory to 12%",
    "Compulsory contributions rising to 6% employee + 6% employer; contributions and fund income progressively tax-exempt; NZ Super replaced by CI + top-up with no cut vs current Super.",
    "12% combined after glidepath",
    "announced",
    ["S54", "S33"],
  ),
  row(
    "opp-ets",
    "carbon_ets",
    "Strengthen ETS; ring-fence auction revenue",
    "Restore credible rising ETS price path; direct Crown ETS auction revenue to Industry Energy Resilience Fund.",
    "Revenue ring-fencing (no new ETS price stated)",
    "announced",
    ["S69"],
  ),
  row(
    "opp-no-cgt",
    "capital_gains",
    "No CGT in Tax Reset (LVT preferred)",
    "Tax Reset does not propose a capital gains tax; party favours land value tax plus universal income instead.",
    "n/a — LVT preferred over CGT",
    "announced",
    ["S54"],
  ),
];

taxes.parties.alliance = [
  row(
    "alliance-tax-free-20k",
    "income_tax",
    "First $20,000 tax-free + rebalanced scale",
    "Costed plan: tax-free first $20k; progressive rates up to a 47% top bracket; lower/middle earners pay less.",
    "0% to $20k; then 17.5%/30%/34%/39%/47% bands (see costings PDF)",
    "announced",
    ["S56", "S57", "S55"],
  ),
  row(
    "alliance-wealth-tax",
    "wealth_tax",
    "2.5% wealth tax above $2m + trust measure",
    "Annual tax on individual net wealth above $2m (~$4m couple); companion trust tax closes avoidance.",
    "2.5% above $2m individual; trust tax ~1.5% (costings)",
    "announced",
    ["S56", "S57"],
  ),
  row(
    "alliance-cgt",
    "capital_gains",
    "33% CGT on realised gains (family home exempt)",
    "Broad CGT on investment property, shares, business assets; family home excluded; applies to gains after commencement.",
    "33% on realised gains",
    "announced",
    ["S56", "S57"],
  ),
  row(
    "alliance-company-tax",
    "company_tax",
    "Company tax to 30%",
    "Increase company tax from 28% to 30% with behavioural adjustment in costings.",
    "30%",
    "announced",
    ["S56", "S57"],
  ),
  row(
    "alliance-ftt",
    "other_levy",
    "0.1% financial transactions levy",
    "Levy on equity and onshore FX turnover; wages, bills, KiwiSaver contributions exempt.",
    "0.1%",
    "announced",
    ["S56", "S57"],
  ),
  row(
    "alliance-carbon-tax",
    "carbon_ets",
    "Replace ETS with carbon tax",
    "Scrap ETS for a direct carbon tax; revenue to renewables/PT/efficiency; protect low-income households. Rate not specified in environment PDF.",
    "Carbon tax rate not specified in PDF",
    "announced",
    ["S58"],
  ),
  row(
    "alliance-kiwisaver-endowment",
    "kiwisaver_super",
    "$10,000 KiwiSaver endowment; Super at 65",
    "Keep NZ Super at 65; $10,000 automatic endowment to new KiwiSaver accounts; couple rate lift toward 72.5% of net average wage cap.",
    "$10,000 endowment",
    "announced",
    ["S34"],
  ),
];

taxes.parties.conservative = [
  row(
    "cons-lower-taxes",
    "income_tax",
    "Lower personal tax (direction)",
    "Press for lower individual rates competitive with Australia; no numeric schedule published on economy page.",
    "Direction only — no full scale published",
    "announced",
    ["S59"],
  ),
  row(
    "cons-gst-12-5",
    "gst",
    "Lower GST to 12.5%",
    "Favours reducing GST from 15% to 12.5%.",
    "12.5%",
    "announced",
    ["S59"],
  ),
  row(
    "cons-company-align",
    "company_tax",
    "Align company tax with top personal rate",
    "Corporation tax aligned with top income tax rate (top rate not specified on page).",
    "Aligned to top personal rate (rate n/a)",
    "announced",
    ["S59"],
  ),
  row(
    "cons-paris-climate-taxes",
    "carbon_ets",
    "Leave Paris; scrap climate energy taxes",
    "Leave Paris Agreement; scrap fossil-fuel taxes/restrictions based on climate ideology framing.",
    "Repeal climate taxes; exit Paris",
    "announced",
    ["S41"],
  ),
  row(
    "cons-super-tax-free",
    "kiwisaver_super",
    "NZ Super not taxable",
    "Remove NZ Super from taxable income so working superannuitants are not taxed on Super.",
    "NZ Super tax-free",
    "announced",
    ["S60"],
  ),
];

taxes.parties.vision = [
  row(
    "vision-tax-free-25k",
    "income_tax",
    "First $25,000 tax-free",
    "First $25,000 of personal income tax-free; also abolish income tax on superannuation, student loans, and welfare benefits.",
    "$25,000 threshold; Super/benefits/student loans tax-free",
    "announced",
    ["S38", "S25b"],
  ),
  row(
    "vision-foreign-firm-tax",
    "company_tax",
    "Higher tax on non-compliant foreign firms",
    "Higher tax rate on foreign traders/businesses failing a local employment baseline (rate not specified).",
    "Higher rate if local employment baseline unmet (rate n/a)",
    "announced",
    ["S38"],
  ),
  row(
    "vision-paris",
    "carbon_ets",
    "Leave Paris Accord",
    "Leave Paris Accord as part of sovereignty / climate regulation rollback.",
    "Exit Paris",
    "announced",
    ["S38"],
  ),
  row(
    "vision-cgt-unknown",
    "capital_gains",
    "No CGT proposal found",
    "No capital gains tax proposal on Vision policies page checked.",
    "n/a",
    "unknown",
    ["S38"],
  ),
];

taxes.parties["nz-loyal"] = [
  row(
    "nzloyal-ftt",
    "other_levy",
    "1% financial transaction tax replacing other taxes",
    "1% on electronic payments, cash withdrawals, online transactions, securities trades; framed as replacing income tax, GST, company tax and eliminating Inland Revenue.",
    "1% FTT",
    "announced",
    ["S61", "S62", "S39"],
  ),
  row(
    "nzloyal-abolish-income",
    "income_tax",
    "Abolish income tax (replaced by FTT)",
    "Conventional income tax eliminated under the 1% transaction tax model.",
    "0% (replaced by FTT)",
    "announced",
    ["S61"],
  ),
  row(
    "nzloyal-abolish-gst",
    "gst",
    "Abolish GST (replaced by FTT)",
    "GST eliminated under the 1% transaction tax model.",
    "0% (replaced by FTT)",
    "announced",
    ["S61"],
  ),
  row(
    "nzloyal-abolish-company",
    "company_tax",
    "Abolish company tax (replaced by FTT)",
    "Company tax eliminated under the same model.",
    "0% (replaced by FTT)",
    "announced",
    ["S61"],
  ),
];

taxes.parties["te-tai-tokerau"] = [
  row(
    "ttt-whanau-allowance",
    "other_levy",
    "Universal Whanau Allowance + MSD debt amnesty",
    "Non-taxable allowance replacing punitive MSD system; about $2b MSD/IRD debt amnesty.",
    "Allowance amount not specified; ~$2b debt amnesty",
    "announced",
    ["S42", "S24b"],
  ),
  row(
    "ttt-corp-holiday",
    "company_tax",
    "5-year innovator regional corporate tax holiday",
    "Businesses in regional incubators: 100% exemption from regional corporate income tax for first 5 years if local payroll/staff targets met.",
    "100% exemption x 5 years (regional)",
    "announced",
    ["S42"],
  ),
  row(
    "ttt-local-food-tax-free",
    "other_levy",
    "Local food trade free of state transaction taxes",
    "Hyper-local barter/sale free of state transaction taxes (Te Tauhokohoko).",
    "n/a — exemption for local food trade",
    "announced",
    ["S42"],
  ),
  row(
    "ttt-income-unknown",
    "income_tax",
    "No national income-tax scale",
    "No national personal income-tax schedule on our-policies page.",
    "n/a",
    "unknown",
    ["S42"],
  ),
];

taxes.parties["animal-justice"] = [
  row(
    "ajp-gst-plant-foods",
    "gst",
    "GST off plant foods and veterinary services",
    "Zero-rate GST on fruit, vegetables, legumes, nuts; remove GST on all veterinary services.",
    "0% on listed plant foods and vet services",
    "announced",
    ["S43", "S63"],
  ),
  row(
    "ajp-ets-split",
    "carbon_ets",
    "Split ETS + biogenic scheme + pollution tax",
    "Fossil ETS separate from biogenic cap-and-trade; pollution tax on pesticides/fertilisers escalating over time; revenue to farm transition fund.",
    "Pollution tax rate not specified",
    "announced",
    ["S63"],
  ),
  row(
    "ajp-income-unknown",
    "income_tax",
    "No income-tax scale published",
    "No personal income-tax schedule on policy summary/transition materials checked.",
    "n/a",
    "unknown",
    ["S43"],
  ),
];

taxes.parties["outdoors-freedom"] = [
  row(
    "nzofp-paris",
    "carbon_ets",
    "Exit Paris; avoid offshore carbon credit bills",
    "Oppose Paris Accord; cites multi-billion cost of buying international credits; focus on local mitigation not ETS payments offshore.",
    "Exit Paris / avoid offshore credit purchases",
    "announced",
    ["S64"],
  ),
  row(
    "nzofp-unhealthy-food-tax",
    "other_levy",
    "Tax unhealthy food",
    "Pae Ora submission: unhealthy foods should be taxed to cover their true costs (rate not specified).",
    "Rate not specified",
    "announced",
    ["S65"],
  ),
  row(
    "nzofp-income-unknown",
    "income_tax",
    "No income-tax schedule found",
    "No clear income-tax scale on nzofp.co.nz pages checked.",
    "n/a",
    "unknown",
    ["S46", "S64"],
  ),
];

taxes.parties.alcp = [
  row(
    "alcp-cannabis-revenue",
    "other_levy",
    "Cannabis/hemp taxation (rate unspecified)",
    "Regulated R18 commerce expected to generate taxation revenue and redirect prohibition spend to health/education; no rate or model on policy page.",
    "Rate not published",
    "announced",
    ["S66", "S44"],
  ),
  row(
    "alcp-income-unknown",
    "income_tax",
    "No income-tax schedule",
    "No income-tax schedule on ALCP policy page.",
    "n/a",
    "unknown",
    ["S66"],
  ),
  row(
    "alcp-gst-unknown",
    "gst",
    "No GST proposal",
    "No GST proposal on ALCP policy page.",
    "n/a",
    "unknown",
    ["S66"],
  ),
];

taxes.parties["womens-rights"] = [
  row(
    "wrp-wff",
    "income_tax",
    "Working for Families / tax credit reform",
    "Supports folding In Work Tax Credit into Family Tax Credit; index WFF to wages; lower abatement rates — not a full income-tax scale.",
    "Abatement/indexation changes (no brackets)",
    "announced",
    ["S67", "S45"],
  ),
  row(
    "wrp-kiwisaver-carers",
    "kiwisaver_super",
    "KiwiSaver equity for carers and women",
    "State contributions to carers' KiwiSaver; employer KiwiSaver during maternity leave; pay equity framing.",
    "Contribution/support measures (not a contribution % schedule)",
    "announced",
    ["S68"],
  ),
  row(
    "wrp-living-incomes",
    "other_levy",
    "Living wages and benefits",
    "Increase minimum wages and benefits to living incomes; pay equity; affordable childcare.",
    "n/a — transfers/wages focus",
    "announced",
    ["S26a", "S45"],
  ),
];

fs.writeFileSync(
  path.join(root, "src/data/taxes.json"),
  JSON.stringify(taxes, null, 2),
);

const policies = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/policies.json"), "utf8"),
);
const economyUpdates = {
  opportunity:
    "Tax Reset: income scale + Citizen's Income (~$19.4k), LVT 1.75%/0.5%, KiwiSaver 2.0 to 12%, strengthen ETS — see tax dossier.",
  alliance:
    "Costed plan: tax-free $20k, wealth tax 2.5% above $2m, 33% CGT, 30% company tax, 0.1% FTT, carbon tax replacing ETS — see tax dossier.",
  conservative:
    "Lower personal tax direction, GST to 12.5%, align company tax to top personal rate, Super tax-free, exit Paris — see tax dossier.",
  vision:
    "First $25k tax-free; Super/benefits/student loans tax-free; higher tax on non-compliant foreign firms; exit Paris — see tax dossier.",
  "nz-loyal":
    "1% financial transaction tax replacing income tax, GST and company tax — see tax dossier.",
  "te-tai-tokerau":
    "Whanau Allowance + debt amnesty; 5-year regional corporate tax holiday; local food trade tax-free — see tax dossier.",
  "animal-justice":
    "GST off plant foods and vet services; split ETS/biogenic scheme + ag pollution tax — see tax dossier.",
  "outdoors-freedom":
    "Exit Paris / avoid offshore carbon credits; tax unhealthy food (rate unspecified) — see tax dossier.",
  alcp: "Legal cannabis expected to raise tax revenue; no rate published — see tax dossier.",
  "womens-rights":
    "WFF/tax-credit reform and KiwiSaver support for carers; living incomes focus — see tax dossier.",
};
for (const [id, summary] of Object.entries(economyUpdates)) {
  if (policies.policies[id]?.economy_tax) {
    policies.policies[id].economy_tax.summary = summary;
    policies.policies[id].economy_tax.lastVerified = V;
  }
}
fs.writeFileSync(
  path.join(root, "src/data/policies.json"),
  JSON.stringify(policies, null, 2),
);

// refresh affected party notes
const parties = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/parties.json"), "utf8"),
);
const lists = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/lists.json"), "utf8"),
);
const affected = Object.keys(economyUpdates);
for (const id of affected) {
  const party = parties.find((p) => p.id === id);
  if (!party) continue;
  const list = lists.parties[id] || [];
  const rows = policies.policies[id] || {};
  const taxRows = taxes.parties[id] || [];
  let body = `# ${party.name}\n\n`;
  body += `- **Abbreviation:** ${party.abbreviation}\n`;
  body += `- **Website:** ${party.website}\n`;
  body += `- **Leaders:** ${party.leaders.join(", ")}\n`;
  body += `- **Summary:** ${party.summary}\n`;
  body += `- **Party sources:** ${party.sourceIds.join(", ")}\n\n`;
  body += "## Tax dossier\n\n";
  body +=
    "| Instrument | Title | Rate / threshold | Status | Sources |\n|---|---|---|---|---|\n";
  for (const t of taxRows) {
    body += `| ${t.instrument} | ${t.title.replace(/\|/g, "/")} | ${t.rateOrThreshold.replace(/\|/g, "/")} | ${t.status} | ${t.sourceIds.join(", ")} |\n`;
  }
  body += "\n";
  for (const t of taxRows) {
    body += `### ${t.title}\n`;
    body += `- **Instrument:** ${t.instrument}\n`;
    body += `- **Status:** ${t.status}\n`;
    body += `- **Rate/threshold:** ${t.rateOrThreshold}\n`;
    body += `- **Summary:** ${t.summary}\n`;
    body += `- **Sources:** ${t.sourceIds.join(", ")}\n`;
    body += `- **Verified:** ${t.lastVerified}\n\n`;
  }
  body += "## Official party list (S04)\n\n";
  for (const c of list) body += `${c.rank}. ${c.name}\n`;
  body += "\n## Issue positions\n\n";
  for (const issue of policies.issues) {
    const r = rows[issue.id];
    if (!r) continue;
    body += `### ${issue.label}\n`;
    body += `- **Stance:** ${r.stance}\n`;
    body += `- **Summary:** ${r.summary}\n`;
    body += `- **Sources:** ${r.sourceIds.join(", ")}\n`;
    body += `- **Verified:** ${r.lastVerified}\n\n`;
  }
  body += "## Honesty block\n\n";
  body +=
    "- Enriched from 2026-10-11 minors tax research pass (official PDFs/pages).\n";
  body +=
    "- Unknown instruments were searched; rates not invented when unpublished.\n";
  fs.writeFileSync(path.join(root, "notes/parties", `${id}.md`), body);
}

const deepDive = path.join(
  root,
  "notes/2026-10-11-tax-and-policy-deep-dive.md",
);
fs.appendFileSync(
  deepDive,
  `\n## Minors research merge\n\nMerged parallel minors tax research into Opportunity, Alliance, Conservatives, Vision, NZ Loyal, Te Tai Tokerau, AJP, NZOFP, ALCP, Women's Rights (sources S54-S69).\n`,
);

console.log("merged minors tax research; sources", Object.keys(sources).length);
