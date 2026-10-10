/**
 * @file build-taxes.mjs
 * @description Build taxes.json + sync source IDs for tax deep dive
 * @onboarding
 * - Run: node scripts/build-taxes.mjs
 * - Every party must have >=1 tax row
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const V = "2026-10-11";

const INSTRUMENTS = [
  "income_tax",
  "capital_gains",
  "wealth_tax",
  "land_tax",
  "gst",
  "company_tax",
  "carbon_ets",
  "kiwisaver_super",
  "other_levy",
];

const extras = [
  ["S30", "https://www.labour.org.nz/election-policy-pages/capital-gains-tax/", "Labour CGT official page"],
  ["S30a", "https://www.rnz.co.nz/news/politics/577060/labour-will-oust-anyone-found-to-have-leaked-capital-gains-tax-policy-chris-hipkins-says", "RNZ Labour CGT leak then announce"],
  ["S30b", "https://www.rnz.co.nz/news/politics/577588/labour-s-capital-gains-tax-valuation-day-details-not-to-be-revealed-until-after-election", "RNZ Labour CGT valuation day"],
  ["S31", "https://www.greens.org.nz/greens_commit_to_tax_the_super_rich_and_large_corporates_fairly_cut_income_tax_for_96", "Greens tax system announcement"],
  ["S31a", "https://www.rnz.co.nz/news/politics/609649/greens-propose-wealth-corporate-and-inheritance-taxes-to-fund-income-tax-changes", "RNZ Greens tax package"],
  ["S32", "https://www.rnz.co.nz/news/politics_election-2026/1083119/national-promises-no-new-taxes-if-re-elected", "RNZ National no new taxes"],
  ["S32a", "https://www.national.org.nz/kiwisaver", "National KiwiSaver policy"],
  ["S32b", "https://www.national.org.nz/policies", "National 2026 policies index"],
  ["S33", "https://www.opportunity.org.nz/tax-reset", "Opportunity Tax Reset"],
  ["S33a", "https://cdn.opportunity.org.nz/documents/policy/Opportunity%20Policy%20-%20Tax%20Reset%20Transition%20Plan.pdf", "Opportunity Tax Reset transition PDF"],
  ["S34", "https://allianceparty.nz/what-we-stand-for/", "Alliance tax/wealth platform"],
  ["S35", "https://www.act.org.nz/policies/economy", "ACT economy / KiwiSaver tax / carbon"],
  ["S36", "https://www.nzfirst.nz/policy", "NZ First policy hub tax items"],
  ["S37", "https://www.maoriparty.org.nz/tax", "Te Pati Maori tax page"],
  ["S38", "https://www.vision.org.nz/visionpolicies", "Vision NZ tax-free threshold"],
  ["S39", "https://nzloyal.com/economics/", "NZ Loyal FTT / tax replace"],
  ["S40", "https://conservatives.org.nz/policies/overview/", "Conservative lower taxes overview"],
  ["S41", "https://conservatives.org.nz/policies/climate/", "Conservative Paris / climate taxes"],
  ["S42", "https://tetaitokerauparty.org.nz/our-policies/", "Te Tai Tokerau fiscal policies"],
  ["S43", "https://animaljustice.org.nz/policies/policy-summary/", "AJP GST plant foods"],
  ["S44", "https://www.alcp.org.nz/", "ALCP legalisation revenue framing"],
  ["S45", "https://womensrightsparty.nz/policy/", "WRP pay equity / incomes"],
  ["S46", "https://nzofp.co.nz/home", "NZOFP home fiscal silence check"],
  ["S47", "https://www.palfree.nz/", "Free Palestine fiscal silence check"],
  ["S48", "https://www.nzfirst.nz/withdraw_from_paris_accord", "NZ First Paris / ETS framing"],
];

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

const unknownChecked = (partyId, instrument, siteSource) =>
  row(
    `${partyId}-${instrument}-unknown`,
    instrument,
    `No ${instrument.replace(/_/g, " ")} proposal found`,
    `No clear published proposal for this instrument on materials checked as of ${V}.`,
    "n/a",
    "unknown",
    [siteSource],
  );

const parties = {
  labour: [
    row(
      "labour-cgt-2026",
      "capital_gains",
      "28% CGT on investment and commercial property profits",
      "Announced after weekend media leaks: flat 28% tax on profits from selling commercial or residential investment property (family home and farms exempt). Revenue ring-fenced for health including three free GP visits. Bright-line test would be replaced.",
      "28% on gains after 1 July 2027; family home/farms/shares/KiwiSaver exempt",
      "announced",
      ["S30", "S30a"],
    ),
    row(
      "labour-cgt-valuation-day",
      "capital_gains",
      "CGT valuation-day implementation details deferred",
      "Reported: valuation-day methodology and default rules largely deferred until after the election, following Tax Working Group options.",
      "Valuation baseline at 1 July 2027; details TBA post-election",
      "reported",
      ["S30b"],
    ),
    row(
      "labour-kiwisaver-2026",
      "kiwisaver_super",
      "Strengthen KiwiSaver employer contributions",
      "Official 2026 policies: compulsory employer contributions rising to 6% by 2032, parental-leave support, extend over-65 employer contributions.",
      "Employer contributions to 6% by 2032; compulsory from 1 July 2028",
      "announced",
      ["S17a"],
    ),
    row(
      "labour-wealth-tax-stance",
      "wealth_tax",
      "Not campaigning on a wealth tax",
      "Reported: Hipkins said Labour would not campaign on a wealth tax (distinct from CGT), while not fully ruling one out in all futures.",
      "n/a — not a 2026 campaign wealth tax",
      "reported",
      ["S30a"],
    ),
  ],
  green: [
    row(
      "green-income-tax-2026",
      "income_tax",
      "Tax-free first $10,000 and 45% top rate",
      "Announced tax package: new tax-free threshold and higher top bracket; party says 96% get an income tax cut.",
      "0% on first $10,000; 45% over $160,000 (full scale in policy PDF/RNZ)",
      "announced",
      ["S31", "S31a"],
    ),
    row(
      "green-wealth-tax-2026",
      "wealth_tax",
      "2.5% wealth tax on net assets above $10m",
      "Annual tax on net assets of the super-rich above $10 million; family home exempt; Maori land and some Treaty settlement assets exempt per reporting.",
      "2.5% p.a. on net assets above $10 million",
      "announced",
      ["S31", "S31a"],
    ),
    row(
      "green-inheritance-2026",
      "other_levy",
      "Capital acquisitions / inheritance tax",
      "33% tax on inheritances and gifts above $1 million; family homes and family farms exempt.",
      "33% above $1 million (home/farm exempt)",
      "announced",
      ["S31", "S31a"],
    ),
    row(
      "green-company-tax-2026",
      "company_tax",
      "33% company tax for largest corporates",
      "Return company tax to 33% for largest corporations (e.g. turnover over $30m reported); keep 28% for SMEs.",
      "33% large corps; 28% SMEs",
      "announced",
      ["S31", "S31a"],
    ),
    row(
      "green-bank-levy-2026",
      "other_levy",
      "Bank levy on big-four liabilities",
      "0.06% levy on liabilities of the four big banks, framed similarly to Australia.",
      "0.06% on big-four bank liabilities",
      "announced",
      ["S31"],
    ),
    row(
      "green-brightline-landlord-2026",
      "capital_gains",
      "Reverse landlord tax cuts and bright-line changes",
      "Reverse National-era landlord tax cuts and bright-line test changes as part of corporate/landlord fairness package.",
      "Restore longer bright-line / reverse deductibility cuts (per announcement)",
      "announced",
      ["S31"],
    ),
  ],
  national: [
    row(
      "national-no-new-taxes-2026",
      "other_levy",
      "No new taxes pledge",
      "Campaign promise of no new taxes if re-elected; ruled out bank tax and bed/accommodation levy after earlier public speculation. Has not ruled out raising existing taxes/fees.",
      "No new tax instruments; existing rates may still change",
      "announced",
      ["S32", "S32b"],
    ),
    row(
      "national-reject-cgt-wealth",
      "capital_gains",
      "Reject CGT and wealth/inheritance taxes",
      "Luxon contrasts National with opponents: not introducing CGT, wealth tax, inheritance tax, gift tax, or a 45% income-tax top rate.",
      "No CGT / wealth / inheritance / gift tax",
      "announced",
      ["S32"],
    ),
    row(
      "national-kiwisaver-2026",
      "kiwisaver_super",
      "Compulsory KiwiSaver and 12% glidepath",
      "Make KiwiSaver (or equivalent) compulsory for all workers from 1 July 2028; default contributions rise to combined 12% by 2032; Baby Boost $1500; over-65 employer contributions; parental leave top-up.",
      "Compulsory from 1 July 2028; 6%+6% by 2032",
      "announced",
      ["S32a"],
    ),
    row(
      "national-income-tax-2026",
      "income_tax",
      "No announced income-tax rate cut package for 2026",
      "No new income-tax scale announced on the 2026 policies index beyond the no-new-taxes / low-tax framing.",
      "n/a — no new scale announced",
      "unknown",
      ["S32b"],
    ),
  ],
  act: [
    row(
      "act-kiwisaver-earnings-tax",
      "kiwisaver_super",
      "No tax on KiwiSaver earnings",
      "Economy policy lists removing tax on KiwiSaver earnings as a cost-of-living / savings measure.",
      "0% tax on KiwiSaver fund earnings (proposal)",
      "announced",
      ["S35", "S10a"],
    ),
    row(
      "act-scrap-carbon-tax",
      "carbon_ets",
      "Scrap net zero / cut carbon tax",
      "Economy policy campaigns to scrap net-zero framing and cut carbon-tax costs.",
      "Remove/reduce carbon tax; scrap net-zero framing",
      "announced",
      ["S35", "S10a"],
    ),
    row(
      "act-lower-taxes-general",
      "income_tax",
      "Lower taxes and smaller government",
      "General lower-tax / careful-spending platform; no full replacement income-tax scale published on the economy page checked.",
      "Direction: lower personal/business tax burden (no full scale listed)",
      "announced",
      ["S35"],
    ),
    unknownChecked("act", "wealth_tax", "S35"),
    unknownChecked("act", "land_tax", "S35"),
  ],
  "nz-first": [
    row(
      "nzf-sme-company-tax",
      "company_tax",
      "Lower SME company tax rate",
      "Policy hub campaign items include a lower company tax rate for smaller-turnover SMEs (reported around 20% under $30m in earlier research notes; verify on policy hub).",
      "Lower SME company rate (see NZ First policy hub)",
      "announced",
      ["S36"],
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
    unknownChecked("nz-first", "income_tax", "S36"),
    unknownChecked("nz-first", "capital_gains", "S36"),
    unknownChecked("nz-first", "wealth_tax", "S36"),
  ],
  "te-pati-maori": [
    row(
      "tpm-tax-wealthy",
      "wealth_tax",
      "Tax the wealthiest fairly",
      "Official tax page: make the wealthiest pay their fair share to fund housing, health, education and whanau support; tax calculator featured on site.",
      "Fair-share wealth/high-end tax (see party tax calculator/page for detail)",
      "announced",
      ["S37", "S23c"],
    ),
    unknownChecked("te-pati-maori", "income_tax", "S37"),
    unknownChecked("te-pati-maori", "gst", "S37"),
    unknownChecked("te-pati-maori", "company_tax", "S37"),
  ],
  opportunity: [
    row(
      "opp-lvt",
      "land_tax",
      "Land Value Tax",
      "Tax Reset: annual tax on land value only to discourage land-banking; transition plan starts lower on urban land.",
      "1.75% annual on land value (transition: 0.5% urban initially)",
      "announced",
      ["S33", "S33a"],
    ),
    row(
      "opp-citizens-income",
      "income_tax",
      "Citizen's Income with tax reset",
      "Fully funded package replacing/reworking income support with a Citizen's Income alongside LVT and KiwiSaver 2.0; phased by age cohort.",
      "Citizen's Income + accompanying tax changes (phased)",
      "announced",
      ["S33", "S33a"],
    ),
    row(
      "opp-kiwisaver-2",
      "kiwisaver_super",
      "KiwiSaver 2.0 compulsory contributions",
      "Compulsory retirement contributions rising toward 6% employee + 6% employer over time.",
      "Rise ~1% per year over six years to 6%+6%",
      "announced",
      ["S33", "S33a"],
    ),
  ],
  alliance: [
    row(
      "alliance-tax-free-20k",
      "income_tax",
      "First $20,000 income tax-free",
      "Make the first $20,000 of income tax-free, funded by a wealth tax; costings published with policy PDFs.",
      "Tax-free threshold $20,000",
      "announced",
      ["S34", "S11a"],
    ),
    row(
      "alliance-wealth-tax",
      "wealth_tax",
      "Wealth tax to fund tax-free threshold",
      "Wealth tax funding mechanism for the tax-free first $20,000 and public services platform.",
      "Wealth tax (see Alliance tax justice PDF on site)",
      "announced",
      ["S34", "S11a"],
    ),
    row(
      "alliance-carbon-tax",
      "carbon_ets",
      "Carbon tax with just transition",
      "Environment policy includes a carbon tax with public ownership of electricity/water and worker-supporting just transition.",
      "Carbon tax (rate detail on environment PDF)",
      "announced",
      ["S34", "S11a"],
    ),
  ],
  vision: [
    row(
      "vision-tax-free-25k",
      "income_tax",
      "First $25,000 tax-free",
      "Vision policies page proposes first $25,000 of income tax-free plus other economic measures.",
      "Tax-free threshold $25,000",
      "announced",
      ["S38", "S25b"],
    ),
    unknownChecked("vision", "capital_gains", "S38"),
    unknownChecked("vision", "wealth_tax", "S38"),
  ],
  "nz-loyal": [
    row(
      "nzloyal-ftt",
      "other_levy",
      "Replace taxes with 1% financial transaction fee",
      "Economics materials propose eliminating conventional taxes and replacing them with a flat 1% financial transaction fee; reclaim sovereign currency issuance.",
      "1% FTT replacing other taxes",
      "announced",
      ["S39", "S20c"],
    ),
    unknownChecked("nz-loyal", "gst", "S39"),
    unknownChecked("nz-loyal", "company_tax", "S39"),
  ],
  conservative: [
    row(
      "cons-lower-taxes",
      "income_tax",
      "Lower taxes and responsible spending",
      "Policy overview favours lower taxes, responsible spending and fewer regulations.",
      "Direction: lower taxes (no full scale published on overview)",
      "announced",
      ["S40"],
    ),
    row(
      "cons-paris-climate-taxes",
      "carbon_ets",
      "Leave Paris; repeal climate-based taxes",
      "Climate policy: leave Paris Agreement and repeal climate-based taxes/regulations.",
      "Repeal climate taxes; exit Paris",
      "announced",
      ["S41"],
    ),
    unknownChecked("conservative", "capital_gains", "S40"),
    unknownChecked("conservative", "wealth_tax", "S40"),
  ],
  "te-tai-tokerau": [
    row(
      "ttt-whanau-allowance",
      "other_levy",
      "Universal whanau allowance and MSD debt amnesty",
      "Our-policies: Crown-iwi investment fund, universal whanau allowance, MSD debt amnesty — fiscal transfers rather than a classic tax schedule.",
      "Universal whanau allowance; MSD debt amnesty",
      "announced",
      ["S42", "S24b"],
    ),
    unknownChecked("te-tai-tokerau", "income_tax", "S42"),
    unknownChecked("te-tai-tokerau", "gst", "S42"),
  ],
  "animal-justice": [
    row(
      "ajp-gst-plant-foods",
      "gst",
      "GST off core plant foods",
      "Policy summary: GST off core plant foods and plant-based defaults in public institutions.",
      "GST removal on core plant foods",
      "announced",
      ["S43", "S12c"],
    ),
    unknownChecked("animal-justice", "income_tax", "S43"),
    unknownChecked("animal-justice", "company_tax", "S43"),
  ],
  alcp: [
    row(
      "alcp-cannabis-revenue",
      "other_levy",
      "Legalisation tax revenue framing",
      "Site argues legal cannabis creates tax revenue and jobs while reducing prohibition costs; not a full tax code.",
      "New cannabis excise/tax revenue (unspecified rate)",
      "announced",
      ["S44", "S13"],
    ),
    unknownChecked("alcp", "income_tax", "S44"),
    unknownChecked("alcp", "gst", "S44"),
  ],
  "womens-rights": [
    row(
      "wrp-living-incomes",
      "income_tax",
      "Living incomes and pay equity (not a tax schedule)",
      "Policy focuses on pay equity, living incomes/benefits and income support for caring work rather than a published income-tax scale.",
      "n/a — incomes/pay equity focus",
      "announced",
      ["S45", "S26a"],
    ),
    unknownChecked("womens-rights", "gst", "S45"),
    unknownChecked("womens-rights", "capital_gains", "S45"),
  ],
  "outdoors-freedom": [
    row(
      "nzofp-tax-search",
      "income_tax",
      "No dedicated tax schedule found",
      "Home and agriculture pages emphasise direct democracy, civil liberties and fair trade; no clear income-tax scale located in this pass.",
      "n/a",
      "unknown",
      ["S46", "S21"],
    ),
    unknownChecked("outdoors-freedom", "gst", "S46"),
    unknownChecked("outdoors-freedom", "carbon_ets", "S46"),
  ],
  "free-palestine": [
    row(
      "fp-tax-search",
      "income_tax",
      "No domestic tax schedule found",
      "Party site focuses on Palestine foreign-policy justice; no domestic tax proposals found on pages checked.",
      "n/a",
      "unknown",
      ["S47", "S15"],
    ),
    unknownChecked("free-palestine", "gst", "S47"),
    unknownChecked("free-palestine", "company_tax", "S47"),
  ],
};

// Ensure all 17 party ids from parties.json
const partyList = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/parties.json"), "utf8"),
);
for (const p of partyList) {
  if (!parties[p.id] || parties[p.id].length < 1) {
    throw new Error(`Missing taxes for ${p.id}`);
  }
}

const taxes = { instruments: INSTRUMENTS, parties };
fs.writeFileSync(
  path.join(root, "src/data/taxes.json"),
  JSON.stringify(taxes, null, 2),
);

// merge sources
const sourcesPath = path.join(root, "src/data/sources.json");
const notesPath = path.join(root, "notes/sources.md");
const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
let notes = fs.readFileSync(notesPath, "utf8");
for (const [id, url, used] of extras) {
  sources[id] = { id, url, accessed: V, usedFor: used };
  if (!notes.includes(`| ${id} |`)) {
    notes = `${notes.trimEnd()}\n| ${id} | ${url} | ${V} | ${used} |`;
  }
}
notes += "\n";
fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2));
fs.writeFileSync(notesPath, notes);

// refresh economy_tax summaries for key parties
const policiesPath = path.join(root, "src/data/policies.json");
const policies = JSON.parse(fs.readFileSync(policiesPath, "utf8"));
const refresh = {
  labour:
    "Announced 28% CGT on investment/commercial property profits after 1 July 2027 (family home/farms exempt), ring-fenced for health; also strengthens KiwiSaver. See tax dossier for leak-vs-announce timeline.",
  green:
    "Announced package: wealth tax 2.5% above $10m, inheritance tax, higher large-corporate tax, bank levy, tax-free first $10k and 45% top rate — see tax dossier.",
  national:
    "No-new-taxes pledge; rejects CGT/wealth/inheritance taxes; compulsory KiwiSaver to 12% combined by 2032 — see tax dossier.",
  act: "No tax on KiwiSaver earnings; scrap net-zero/carbon-tax framing; lower-tax smaller-government platform — see tax dossier.",
  opportunity:
    "Tax Reset: Land Value Tax (~1.75%), Citizen's Income, and KiwiSaver 2.0 compulsory contributions — see tax dossier.",
  alliance:
    "First $20,000 tax-free funded by a wealth tax; carbon tax with just transition — see tax dossier.",
  vision: "First $25,000 tax-free proposed on Vision policies page — see tax dossier.",
  "nz-loyal":
    "Replace conventional taxes with a 1% financial transaction fee — see tax dossier.",
  "nz-first":
    "Lower SME company tax and withdraw from Paris Accord / condition emissions pricing — see tax dossier.",
  "te-pati-maori":
    "Tax the wealthiest fairly to fund housing, health, education and whanau support — see tax dossier.",
};
for (const [id, summary] of Object.entries(refresh)) {
  if (policies.policies[id]?.economy_tax) {
    policies.policies[id].economy_tax.summary = summary;
    policies.policies[id].economy_tax.lastVerified = V;
  }
}
fs.writeFileSync(policiesPath, JSON.stringify(policies, null, 2));

console.log(
  "taxes.json written for",
  Object.keys(parties).length,
  "parties; sources",
  Object.keys(sources).length,
);
