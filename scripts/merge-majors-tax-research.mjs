/**
 * @file merge-majors-tax-research.mjs
 * @description Merge 2026-10-11 majors tax research into taxes.json
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
  ["S70", "https://www.labour.org.nz/media/pfvguai5/labour-cgt.pdf", "Labour CGT official PDF"],
  ["S71", "https://www.labour.org.nz/election-policy-pages/small-business-action-plan/", "Labour small business / GST threshold"],
  ["S72", "https://www.labour.org.nz/election-policy-pages/fiscal-plan/", "Labour fiscal plan (Investment Boost repeal)"],
  ["S73", "https://www.labour.org.nz/election-policy-pages/kiwisaver/", "Labour KiwiSaver policy page"],
  ["S74", "https://www.rnz.co.nz/news/politics_election-2026/1047365/labour-blames-mixed-messaging-on-streaming-levy-on-administrative-oversight", "RNZ Labour streaming levy denied"],
  ["S75", "https://www.greens.org.nz/tax_system_for_all", "Greens tax system for all hub"],
  ["S76", "https://assets.nationbuilder.com/beachheroes/pages/71965/attachments/original/1782084525/GreensTaxPolicy2026.pdf?1782084525=", "Greens Tax Policy 2026 PDF"],
  ["S77", "https://www.national.org.nz/policies/no-new-taxes", "National no new taxes policy"],
  ["S78", "https://www.national.org.nz/policies/boost-for-graduates", "National student loan repayment cut"],
  ["S79", "https://assets.national.org.nz/web/prod/National%20KiwiSaver%20policy%20document.pdf?v=1782016131", "National KiwiSaver PDF"],
  ["S80", "https://www.rnz.co.nz/news/politics_election-2026/1656972/no-income-tax-cuts-before-books-in-surplus-nicola-willis", "RNZ National bracket creep signal"],
  ["S81", "https://www.act.org.nz/scrap-net-zero-cut-the-carbon-tax", "ACT scrap net zero / carbon tax"],
  ["S82", "https://www.interest.co.nz/sites/default/files/2026-10/No_tax_on_Kiwisaver_earnings_FINAL.pdf", "ACT no tax on KiwiSaver earnings PDF"],
  ["S83", "https://www.rnz.co.nz/news/politics_election-2026/1714907/act-pledges-removing-tax-on-kiwisaver-earnings", "RNZ ACT KiwiSaver earnings tax"],
  ["S84", "https://www.maoriparty.org.nz/waititi_writes_to_parties_asking_them_to_support_removal_of_gst_from_food", "TPM GST off food members bill"],
  ["S85", "https://www.rnz.co.nz/news/politics/577086/labour-s-capital-gains-gamble-from-leak-to-launch", "RNZ Labour CGT leak to launch"],
  ["S86", "https://www.labour.org.nz/news/release-labour-to-accelerate-climate-action/", "Labour ETS review / climate"],
];

const sources = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/sources.json"), "utf8"),
);
let notesMd = fs.readFileSync(path.join(root, "notes/sources.md"), "utf8");
for (const [id, url, used] of extras) {
  sources[id] = { id, url, accessed: V, usedFor: used };
  if (!notesMd.includes(`| ${id} |`)) {
    notesMd = `${notesMd.trimEnd()}\n| ${id} | ${url} | ${V} | ${used} |`;
  }
}
notesMd += "\n";
fs.writeFileSync(
  path.join(root, "src/data/sources.json"),
  JSON.stringify(sources, null, 2),
);
fs.writeFileSync(path.join(root, "notes/sources.md"), notesMd);

const taxes = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/taxes.json"), "utf8"),
);

taxes.parties.labour = [
  row(
    "labour-cgt-2026",
    "capital_gains",
    "28% CGT on investment and commercial property profits",
    "Official PDF after RNZ weekend leak: flat 28% on net gains after 1 July 2027 on sale of commercial/residential investment property (family home exempt). Revenue ring-fenced for health including three free GP visits.",
    "28% on gains after 1 July 2027; family home/farms exempt",
    "announced",
    ["S70", "S30", "S85"],
  ),
  row(
    "labour-cgt-valuation-day",
    "capital_gains",
    "CGT valuation-day details largely post-election",
    "Reported: valuation methodology and defaults largely deferred until after the election (Tax Working Group options).",
    "Valuation baseline 1 July 2027; details TBA",
    "reported",
    ["S30b"],
  ),
  row(
    "labour-no-wealth-tax-campaign",
    "wealth_tax",
    "Not campaigning on a wealth tax",
    "Labour says the only new tax it campaigns on is the property CGT; wealth tax left to partners in any coalition.",
    "n/a — not a 2026 Labour campaign wealth tax",
    "announced",
    ["S30", "S70"],
  ),
  row(
    "labour-gst-threshold",
    "gst",
    "Raise GST registration threshold to $80,000",
    "Compulsory GST registration threshold raised from $60,000 to $80,000 from 1 July 2028 (not a cut in the 15% GST rate).",
    "$80,000 registration threshold from 1 July 2028",
    "announced",
    ["S71"],
  ),
  row(
    "labour-investment-boost-repeal",
    "company_tax",
    "Repeal Investment Boost incentive",
    "Fiscal plan books revenue from repealing National's Investment Boost (20% upfront deduction for qualifying new assets); not a change to the 28% headline company rate.",
    "Repeal Investment Boost (headline company rate unchanged)",
    "announced",
    ["S72"],
  ),
  row(
    "labour-kiwisaver-2026",
    "kiwisaver_super",
    "Strengthen KiwiSaver (employer-led)",
    "Compulsory employer contributions from 1 July 2028 rising to 6% by 2032; default employee 4%; parental leave and over-65 employer contributions.",
    "Employer to 6% by 2032; compulsory from 1 July 2028",
    "announced",
    ["S73", "S17a"],
  ),
  row(
    "labour-ets-review",
    "carbon_ets",
    "ETS review / stronger carbon price (not a carbon tax)",
    "Urgent ETS review aiming for a meaningful carbon price; pause new forestry ETS registrations during review; will not campaign on agricultural emissions pricing.",
    "No $/tonne target stated",
    "announced",
    ["S86"],
  ),
  row(
    "labour-streaming-levy-denied",
    "other_levy",
    "Streaming services levy — denied",
    "Hipkins ruled out a streamers levy; related member's bill removed from ballot — not election policy.",
    "n/a",
    "denied",
    ["S74"],
  ),
  row(
    "labour-tobacco-excise-reverse",
    "other_levy",
    "Reverse tobacco excise cut",
    "Fiscal plan includes reversing National's tobacco tax cut as a revenue line.",
    "See fiscal plan table for amounts",
    "announced",
    ["S72"],
  ),
];

taxes.parties.green = [
  row(
    "green-income-tax-2026",
    "income_tax",
    "Fair income tax restructure",
    "Tax-free first $10,000 and stepped bands up to 45% over $160,000; party says 96% get a tax cut. Document also appeared online before the launch press conference.",
    "0% to $9,999; then 10%/17.5%/25.5%/30.5%/33.5%; 45% from $160,000",
    "announced",
    ["S76", "S31", "S75"],
  ),
  row(
    "green-wealth-tax-2026",
    "wealth_tax",
    "2.5% wealth tax on net assets above $10m",
    "Annual tax on net assets above $10m per individual ($20m couple framing in some coverage); family home exempt; trust attribution rules.",
    "2.5% p.a. above $10m net (individual)",
    "announced",
    ["S76", "S31"],
  ),
  row(
    "green-inheritance-2026",
    "other_levy",
    "Capital Acquisitions Tax 33%",
    "33% on assets/gifts received over $1m; family home and family farms exempt.",
    "33% above $1m received",
    "announced",
    ["S76", "S31"],
  ),
  row(
    "green-company-tax-2026",
    "company_tax",
    "33% company tax for large corporates",
    "33% for firms with turnover over $30m; keep 28% for SMEs.",
    "33% if turnover > $30m; else 28%",
    "announced",
    ["S76", "S31"],
  ),
  row(
    "green-bank-levy-2026",
    "other_levy",
    "Bank levy 0.06%",
    "0.06% p.a. on liabilities of banks with over $100b liabilities (big four).",
    "0.06% on big-bank liabilities",
    "announced",
    ["S76", "S31"],
  ),
  row(
    "green-brightline-landlord-2026",
    "capital_gains",
    "10-year bright-line + reverse interest deductibility",
    "Restore 10-year bright-line on residential investment; remove interest deductibility for residential investors; gains taxed at marginal rates under bright-line (not Labour's flat 28% CGT).",
    "10-year bright-line; marginal rates on taxed gain",
    "announced",
    ["S76", "S31"],
  ),
  row(
    "green-tech-withholding",
    "other_levy",
    "Big tech offshore profit withholding",
    "Enforce 5% withholding on profits shifted offshore via misclassified royalties/service fees.",
    "5% withholding",
    "announced",
    ["S76"],
  ),
];

taxes.parties.national = [
  row(
    "national-no-new-taxes-2026",
    "other_levy",
    "No new taxes pledge",
    "Campaign promise of no new taxes; ruled out bank tax and accommodation/bed levy. Has not ruled out raising existing taxes/fees.",
    "No new tax instruments",
    "announced",
    ["S77", "S32"],
  ),
  row(
    "national-reject-cgt-wealth",
    "capital_gains",
    "No capital gains tax",
    "Commits to no CGT under the no-new-taxes frame and campaigns against Labour's property CGT.",
    "No CGT",
    "announced",
    ["S77"],
  ),
  row(
    "national-no-wealth-tax",
    "wealth_tax",
    "No wealth tax",
    "Framed as part of no-new-taxes versus partners' wealth taxes.",
    "No wealth tax",
    "announced",
    ["S77"],
  ),
  row(
    "national-kiwisaver-2026",
    "kiwisaver_super",
    "Compulsory KiwiSaver to 12% by 2032",
    "Compulsory for workers from 1 July 2028; default employee/employer rates rise to 6% each by 1 April 2032; Baby Boost $1,500; parental leave and over-65 employer contributions.",
    "6%+6% by 2032; compulsory from 1 July 2028",
    "announced",
    ["S79", "S32a"],
  ),
  row(
    "national-student-loan-repay",
    "other_levy",
    "Student loan repayment rate cut to 10%",
    "Reduce compulsory repayment from 12% to 10% on income above $24,128 from 1 April 2027 for NZ-based borrowers; tougher overseas recovery.",
    "10% above $24,128 from 1 April 2027",
    "announced",
    ["S78"],
  ),
  row(
    "national-bracket-creep-signal",
    "income_tax",
    "Bracket creep / income-tax adjustment signalled",
    "Willis said National will campaign on addressing bracket creep and make an income-tax announcement during the campaign, but not before books return to surplus. No rates published as of 2026-10-11.",
    "No rates/thresholds published yet",
    "reported",
    ["S80"],
  ),
];

taxes.parties.act = [
  row(
    "act-kiwisaver-earnings-tax",
    "kiwisaver_super",
    "No tax on KiwiSaver investment earnings",
    "Tax-free qualifying fund earnings; end government KiwiSaver contribution for members with employer contributions; party PDF costings ~$2.4b over four years.",
    "0% tax on qualifying KiwiSaver earnings",
    "announced",
    ["S82", "S83", "S35"],
  ),
  row(
    "act-scrap-carbon-tax",
    "carbon_ets",
    "Scrap Net Zero / cut carbon tax / Carbon Tax Refund",
    "Repeal Zero Carbon Act framing; remove ETS auction price floor; return 100% of net auction revenue to households; oppose agricultural emissions tax.",
    "Remove minimum auction price; refund net auction revenue",
    "announced",
    ["S81", "S35"],
  ),
  row(
    "act-oppose-cgt-wealth",
    "capital_gains",
    "Oppose CGT and wealth taxes",
    "Economy policy opposes punishing savers; framed against CGT/wealth taxes and compulsory KiwiSaver-plus-tax packages.",
    "n/a — opposition stance",
    "announced",
    ["S35", "S83"],
  ),
  row(
    "act-income-unknown-2026",
    "income_tax",
    "No fresh 2026 costed income-tax table found",
    "Older Alternative Budget bracket ideas exist in legacy materials; no new 2026 bracket PDF located on act.org.nz in this pass.",
    "n/a",
    "unknown",
    ["S35"],
  ),
];

taxes.parties["nz-first"] = [
  row(
    "nzf-sme-company-tax",
    "company_tax",
    "20% company tax for SMEs under $30m turnover",
    "Cut company tax from 28% to 20% for companies with turnover under $30 million; party estimates ~$1b initial annual fiscal cost.",
    "20% if turnover under $30m",
    "announced",
    ["S49", "S36"],
  ),
  row(
    "nzf-paris-ets",
    "carbon_ets",
    "Withdraw from Paris Accord",
    "Announced policy to withdraw from the Paris Accord and resist emissions pricing without trading-partner parity (separate from company-tax announcement).",
    "Exit Paris; condition emissions pricing on peers",
    "announced",
    ["S48", "S19g"],
  ),
  row(
    "nzf-income-tax-unknown",
    "income_tax",
    "No 2026 PAYE restructure on policy hub",
    "Policy index emphasises SME company tax; no PAYE bands on nzfirst.nz pages checked this pass.",
    "n/a",
    "unknown",
    ["S36"],
  ),
  row(
    "nzf-cgt-unknown",
    "capital_gains",
    "No CGT proposal found",
    "No capital gains tax proposal on the 2026 policy hub pages checked.",
    "n/a",
    "unknown",
    ["S36"],
  ),
  row(
    "nzf-wealth-unknown",
    "wealth_tax",
    "No wealth tax proposal found",
    "No wealth tax proposal on the 2026 policy hub pages checked.",
    "n/a",
    "unknown",
    ["S36"],
  ),
];

taxes.parties["te-pati-maori"] = [
  row(
    "tpm-income-tax-bands",
    "income_tax",
    "Kiwi Tax Plan income-tax scale",
    "Zero tax on first $30,000; progressive bands to 48% above $300,001; party says most people pay less income tax.",
    "0% to $30k; 15%/33%/39%/42%; 48% above $300,001",
    "announced",
    ["S53", "S50"],
  ),
  row(
    "tpm-wealth-tax",
    "wealth_tax",
    "Tiered net wealth tax above $2m",
    "Progressive annual tax on net wealth above $2m per person.",
    "0% to $2m; 1.5% / 2% / 2.5% above bands",
    "announced",
    ["S53", "S50", "S37"],
  ),
  row(
    "tpm-stamp-duty",
    "other_levy",
    "5% stamp duty on residential sales",
    "5% on residential sales; first-home buyers exempt for homes under $1m (buyer-side transaction tax, distinct from Labour CGT).",
    "5%; FHB exemption under $1m",
    "announced",
    ["S50", "S53"],
  ),
  row(
    "tpm-land-banking",
    "land_tax",
    "33% land-banking tax + 2% vacant house tax",
    "Kiwi Tax Plan: 33% land-banking tax and 2% annual vacant house tax.",
    "33% land-banking; 2% vacant house",
    "announced",
    ["S53"],
  ),
  row(
    "tpm-company-tax",
    "company_tax",
    "Company tax to 33%",
    "Return headline company rate from 28% to 33%.",
    "33%",
    "announced",
    ["S53", "S51"],
  ),
  row(
    "tpm-kai-credit",
    "gst",
    "Kai credit / No GST on kai framing",
    "Targeted credit for earners at or under $60,000 framed as equivalent to weeks of kai; separate members' bill seeks GST removal from food.",
    "Credit for earners <= $60k; GST-off-food bill separate",
    "announced",
    ["S53", "S84"],
  ),
  row(
    "tpm-profit-transfer",
    "other_levy",
    "5% international profit transfer tax",
    "5% on value of profits transferred offshore.",
    "5%",
    "announced",
    ["S53"],
  ),
];

fs.writeFileSync(
  path.join(root, "src/data/taxes.json"),
  JSON.stringify(taxes, null, 2),
);

const policies = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/policies.json"), "utf8"),
);
const economy = {
  labour:
    "Announced 28% property CGT (after leak), GST registration to $80k, Investment Boost repeal, stronger KiwiSaver; streaming levy denied — see tax dossier.",
  green:
    "Full income-tax bands to 45%, wealth tax 2.5% above $10m, CAT 33%, bank levy, 33% large-corp tax, 10-year bright-line — see tax dossier.",
  national:
    "No new taxes; no CGT/wealth tax; compulsory KiwiSaver to 12%; student-loan repay 10%; bracket-creep cut signalled but uncosted — see tax dossier.",
  act: "No tax on KiwiSaver earnings; scrap net-zero / ETS price floor with carbon-tax refund; oppose CGT/wealth taxes — see tax dossier.",
  "nz-first":
    "20% SME company tax under $30m; withdraw from Paris Accord — see tax dossier.",
  "te-pati-maori":
    "Kiwi Tax Plan: $30k tax-free to 48% top rate, wealth tax from $2m, 5% stamp duty, 33% company tax, land-banking/vacant taxes — see tax dossier.",
};
for (const [id, summary] of Object.entries(economy)) {
  policies.policies[id].economy_tax.summary = summary;
  policies.policies[id].economy_tax.lastVerified = V;
}
fs.writeFileSync(
  path.join(root, "src/data/policies.json"),
  JSON.stringify(policies, null, 2),
);

const parties = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/parties.json"), "utf8"),
);
const lists = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/lists.json"), "utf8"),
);
for (const id of Object.keys(economy)) {
  const party = parties.find((p) => p.id === id);
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
    "- Enriched from 2026-10-11 majors tax research (party PDFs + established NZ news for leaks).\n";
  body +=
    "- Denied/reported statuses preserved (e.g. Labour streaming levy; National bracket-creep signal).\n";
  fs.writeFileSync(path.join(root, "notes/parties", `${id}.md`), body);
}

fs.appendFileSync(
  path.join(root, "notes/2026-10-11-tax-and-policy-deep-dive.md"),
  `\n## Majors research merge\n\nMerged parallel majors tax research into Labour, Greens, National, ACT, NZ First, Te Pati Maori (sources S70-S86): Green income bands, Labour Investment Boost/GST threshold/denied streaming levy, National student-loan 10%, ACT KiwiSaver PDF + net-zero page, TPM full Kiwi Tax Plan bands.\n`,
);

console.log("merged majors; sources", Object.keys(sources).length);
