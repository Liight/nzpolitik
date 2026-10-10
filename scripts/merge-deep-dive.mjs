/**
 * @file merge-deep-dive.mjs
 * @description One-off merge of 2026-10-11 primary-source deep dive into data corpus
 * @onboarding
 * - Run: node scripts/merge-deep-dive.mjs
 * - Regenerates sources.json entries, policies.json rows, party notes
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const V = "2026-10-11";
const p = (stance, summary, sourceIds) => ({
  stance,
  summary,
  sourceIds,
  lastVerified: V,
});

const extras = [
  ["S10d", "https://www.act.org.nz/policies/education", "ACT education"],
  ["S10e", "https://www.act.org.nz/policies/law-and-order", "ACT law and order"],
  [
    "S10f",
    "https://www.act.org.nz/news/act-proposes-referendum-on-co-governance",
    "ACT co-governance referendum",
  ],
  [
    "S12c",
    "https://animaljustice.org.nz/policies/policy-summary/",
    "AJP policy summary",
  ],
  [
    "S12d",
    "https://animaljustice.org.nz/election-2026/election-manifesto/",
    "AJP 2026 manifesto",
  ],
  ["S14b", "https://conservatives.org.nz/", "Conservative Party NZ (org.nz)"],
  [
    "S14c",
    "https://conservatives.org.nz/policies/overview/",
    "Conservative policy overview",
  ],
  ["S14d", "https://conservatives.org.nz/policies/health/", "Conservative health"],
  [
    "S14e",
    "https://conservatives.org.nz/policies/climate/",
    "Conservative climate",
  ],
  [
    "S14f",
    "https://conservatives.org.nz/policies/immigration/",
    "Conservative immigration",
  ],
  ["S16b", "https://www.greens.org.nz/livelihoods_policy", "Green livelihoods"],
  ["S16c", "https://www.greens.org.nz/health_policy", "Green health"],
  ["S16d", "https://www.greens.org.nz/housing_policy", "Green housing"],
  ["S16e", "https://www.greens.org.nz/climate_change_policy", "Green climate"],
  ["S16f", "https://www.greens.org.nz/justice_policy", "Green justice"],
  ["S16g", "https://www.greens.org.nz/immigration_policy", "Green immigration"],
  [
    "S16h",
    "https://www.greens.org.nz/governance_policy",
    "Green governance / Te Tiriti",
  ],
  [
    "S16i",
    "https://www.greens.org.nz/security_and_defence_policy",
    "Green security and defence",
  ],
  [
    "S17c",
    "https://www.labour.org.nz/news/speech-chris-hipkins-treaty-principles-bill-second-reading/",
    "Labour Te Tiriti speech",
  ],
  [
    "S18c",
    "https://www.national.org.nz/news/20250923-hon-nicola-willis-new-residence-options-to-bolster-workforce",
    "National skilled residence",
  ],
  [
    "S18d",
    "https://www.national.org.nz/news/equal-standard-of-citizenship-tested-by-labour",
    "National equal citizenship",
  ],
  [
    "S19g",
    "https://www.nzfirst.nz/withdraw_from_paris_accord",
    "NZ First withdraw Paris Accord",
  ],
  [
    "S19h",
    "https://www.nzfirst.nz/the_plan_to_make_nz_healthy",
    "NZ First Make NZ Healthy (alt URL)",
  ],
  ["S20c", "https://nzloyal.com/economics/", "NZ Loyal economics"],
  [
    "S20d",
    "https://nzloyal.org.nz/pages/policy-overview",
    "NZ Loyal policy overview",
  ],
  ["S21b", "https://nzofp.co.nz/agriculture-policy", "NZOFP agriculture"],
  [
    "S21c",
    "https://nzofp.co.nz/thriving-people",
    "Outdoors thriving people policies",
  ],
  ["S21d", "https://nzofp.co.nz/home", "NZOFP / Freedom party home"],
  ["S22b", "https://www.opportunity.org.nz/tax-reset", "Opportunity Tax Reset"],
  [
    "S22c",
    "https://www.opportunity.org.nz/bottom_lines",
    "Opportunity bottom lines",
  ],
  ["S23b", "https://www.maoriparty.org.nz/policy", "Te Pati Maori policy hub"],
  ["S23c", "https://www.maoriparty.org.nz/tax", "Te Pati Maori tax"],
  [
    "S24b",
    "https://tetaitokerauparty.org.nz/our-policies/",
    "Te Tai Tokerau our policies",
  ],
  ["S25b", "https://www.vision.org.nz/visionpolicies", "Vision NZ policies"],
  [
    "S26b",
    "https://womensrightsparty.nz/wp-content/uploads/2023/06/policy-womens-rights-party.pdf",
    "WRP full policy PDF",
  ],
];

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

const policiesPath = path.join(root, "src/data/policies.json");
const data = JSON.parse(fs.readFileSync(policiesPath, "utf8"));
const pol = data.policies;

pol.act.climate_environment = p(
  "opposes",
  "Economy policy campaign includes scrapping net-zero framing and cutting carbon-tax costs.",
  ["S10a"],
);
pol.act.education = p(
  "supports",
  "Education policy emphasises standards, charter schools, affordable uniforms, rural bus access and equal treatment at universities.",
  ["S10d"],
);
pol.act.justice_crime = p(
  "supports",
  "Law and order policy: tougher consequences, three-strikes expansion, deportation of serious offenders, rural and youth crime measures.",
  ["S10e"],
);
pol.act.immigration = p(
  "mixed",
  "Infrastructure policy requires temporary workers to contribute to infrastructure from day one; no full immigration hub published.",
  ["S10c"],
);
pol.act.te_tiriti_maori = p(
  "opposes",
  "Proposes defining Treaty principles via binding referendum; equal rights before the law and opposition to co-governance expansion.",
  ["S10f", "S10"],
);

pol["animal-justice"].economy_tax = p(
  "mixed",
  "Plant-based economy transition with farmer/worker support; donation caps and lobbying transparency in policy summary.",
  ["S12c"],
);
pol["animal-justice"].health = p(
  "supports",
  "Plant-based defaults in public institutions and GST off core plant foods; links animal agriculture to health costs.",
  ["S12c"],
);
pol["animal-justice"].climate_environment = p(
  "supports",
  "Transition from harmful farming/fishing practices; habitat-focused conservation approaches in policy summary.",
  ["S12c"],
);
pol["animal-justice"].education = p(
  "supports",
  "Manifesto emphasises empathy, critical thinking and environmental awareness in education.",
  ["S12d"],
);
pol["animal-justice"].justice_crime = p(
  "mixed",
  "Stronger animal-welfare enforcement and a Commissioner for Animals; not a general criminal-justice platform.",
  ["S12c"],
);
pol["animal-justice"].te_tiriti_maori = p(
  "mixed",
  "Plant-based transition materials acknowledge tangata whenua, kaitiakitanga and partnership with iwi/hapu.",
  ["S12c"],
);
pol["animal-justice"].social_issues = p(
  "supports",
  "Animal rights core platform plus political finance reform, vet affordability and companion-animal bereavement leave.",
  ["S12c", "S12"],
);

pol.alcp.economy_tax = p(
  "mixed",
  "Argues legalisation creates tax revenue and jobs while reducing prohibition costs.",
  ["S13"],
);
pol.alcp.te_tiriti_maori = p(
  "mixed",
  "Reform framing notes disproportionate harm to Maori from prohibition.",
  ["S13"],
);

pol.conservative.economy_tax = p(
  "supports",
  "Lower taxes, responsible spending, fewer regulations and productive use of resources.",
  ["S14c"],
);
pol.conservative.health = p(
  "supports",
  "Train and retain NZ health staff, targeted skilled immigration for health workforce, primary care focus.",
  ["S14d"],
);
pol.conservative.climate_environment = p(
  "opposes",
  "Leave Paris Agreement; repeal climate-based taxes/regulations; practical environmental policy framing.",
  ["S14e"],
);
pol.conservative.justice_crime = p(
  "supports",
  "Resourced police, meaningful sentences, fair consistent justice, and a police accountability inquiry.",
  ["S14c"],
);
pol.conservative.immigration = p(
  "supports",
  "Cap unskilled net migration to social capacity; skilled points system; end golden visas.",
  ["S14f"],
);
pol.conservative.te_tiriti_maori = p(
  "opposes",
  "One people under one law; oppose race-based division in services and employment.",
  ["S14c"],
);
pol.conservative.social_issues = p(
  "supports",
  "Strong families, freedom of speech/assembly and child protection listed in policy menu.",
  ["S14c", "S14b"],
);
pol.conservative.education = p(
  "unknown",
  "Education listed in policy index; no standalone page verified in this pass.",
  ["S14b"],
);
pol.conservative.housing = p(
  "unknown",
  "No dedicated housing policy page found on conservatives.org.nz policies index.",
  ["S14b"],
);
pol.conservative.foreign_defence = p(
  "unknown",
  "No dedicated foreign/defence page found.",
  ["S14b"],
);

pol.green.economy_tax = p(
  "supports",
  "Liveable incomes, higher benefits and anti-predatory lending; tax the super-rich per manifesto framing.",
  ["S16b", "S16a"],
);
pol.green.health = p(
  "supports",
  "Universal free dental/GP/mental health with equity focus and Te Whare Tapa Wha approach.",
  ["S16c"],
);
pol.green.housing = p(
  "supports",
  "Mass public housing, right to housing in law, decommodification and Maori-led papakainga.",
  ["S16d"],
);
pol.green.climate_environment = p(
  "supports",
  "Urgent emissions cuts, 1.5C alignment, fossil phase-out, Tiriti-based adaptation and just transition.",
  ["S16e"],
);
pol.green.justice_crime = p(
  "supports",
  "Restorative/transformative justice; Mana Orite governance; end mandatory minimums/boot camps.",
  ["S16f"],
);
pol.green.immigration = p(
  "supports",
  "Humane Tiriti-based immigration system; climate-displacement provisions; higher refugee quota.",
  ["S16g"],
);
pol.green.te_tiriti_maori = p(
  "supports",
  "Constitutional transformation per Matike Mai; uphold rangatiratanga across governance.",
  ["S16h", "S16a"],
);
pol.green.foreign_defence = p(
  "supports",
  "Independent Pacific-oriented defence; peacekeeping/humanitarian NZDF roles.",
  ["S16i"],
);
pol.green.education = p(
  "supports",
  "Lifelong learning as a public good on the ratified policy hub.",
  ["S16a"],
);

pol.labour.te_tiriti_maori = p(
  "supports",
  "Treats Te Tiriti as a living partnership and supports Maori-led solutions; also Backing Maori into Skilled Work training investment.",
  ["S17c", "S17a"],
);
pol.labour.immigration = p(
  "mixed",
  "2026 policies hub has no dedicated immigration manifesto; party news criticises lowering migrant pay thresholds and weak exploitation enforcement.",
  ["S17a"],
);
pol.labour.foreign_defence = p(
  "mixed",
  "Supports NZ-India FTA with labour-protection conditions; broader defence posture not on the 2026 policies page.",
  ["S17a"],
);

pol.national.immigration = p(
  "supports",
  "Skilled residence pathways and stronger compliance/deportation settings; visitor levy and Trans-Tasman travel items on 2026 policies index.",
  ["S18c", "S18a"],
);
pol.national.te_tiriti_maori = p(
  "mixed",
  "Uphold settlement delivery and equal citizenship principle; oppose broad co-governance expansions in party messaging.",
  ["S18d"],
);

pol["nz-first"].economy_tax = p(
  "supports",
  "Campaign policies include breaking up gentailer/supermarket concentration and a lower SME company tax rate for smaller turnovers (policy hub).",
  ["S19c"],
);
pol["nz-first"].climate_environment = p(
  "opposes",
  "Policy to withdraw from the Paris Accord and resist emissions pricing without trading-partner parity.",
  ["S19g"],
);
pol["nz-first"].health = p(
  "supports",
  "Make NZ Healthy plan: prevention, metabolic health, nutrition, GP autonomy and early intervention.",
  ["S19e", "S19h"],
);

pol["nz-loyal"].economy_tax = p(
  "supports",
  "Replace taxes with a flat 1% financial transaction fee; nationalise Reserve Bank and key utilities per economics page.",
  ["S20c"],
);
pol["nz-loyal"].climate_environment = p(
  "opposes",
  "Investigate green agenda claims; elevate oil/gas for energy independence (economics/overview).",
  ["S20c", "S20d"],
);
pol["nz-loyal"].education = p(
  "mixed",
  "Overview emphasises removing global agendas from schools and teaching informed consent.",
  ["S20d"],
);
pol["nz-loyal"].housing = p(
  "mixed",
  "Free-market/local construction emphasis and return of lands affected by SNAs in policy overview.",
  ["S20d"],
);
pol["nz-loyal"].health = p(
  "mixed",
  "Health listed on policy index; overview emphasises freedom of choice and holistic modalities.",
  ["S20a", "S20d"],
);
pol["nz-loyal"].foreign_defence = p(
  "supports",
  "Exit UN/WEF/WHO framing and void international agreements not consulted with the public (overview).",
  ["S20d", "S20b"],
);
pol["nz-loyal"].te_tiriti_maori = p(
  "opposes",
  "Remove race-based policies; written constitution limiting government (policy overview).",
  ["S20d", "S20a"],
);
pol["nz-loyal"].social_issues = p(
  "supports",
  "Binding referendums, decentralise government, property rights versus state overreach.",
  ["S20d", "S20"],
);

pol["outdoors-freedom"].economy_tax = p(
  "mixed",
  "Fair trade not free trade; farmland sales moratorium to non-tax residents; ecological agriculture.",
  ["S21b"],
);
pol["outdoors-freedom"].health = p(
  "supports",
  "Opposes mandatory medication of water/individuals; health and wellness linked from thriving-people policies.",
  ["S21c"],
);
pol["outdoors-freedom"].climate_environment = p(
  "supports",
  "Clean freshwater, reduce poisons, lifestyle-based mitigation, protect public conservation estate.",
  ["S21d", "S21"],
);
pol["outdoors-freedom"].education = p(
  "supports",
  "Holistic inclusive education on thriving-people policy pages.",
  ["S21c"],
);
pol["outdoors-freedom"].immigration = p(
  "mixed",
  "Population limits and citizen say on tourism/population on vision materials.",
  ["S21d"],
);
pol["outdoors-freedom"].social_issues = p(
  "supports",
  "Direct democracy pillar; medicinal home cannabis, anti-bullying and seniors policies on thriving-people pages.",
  ["S21", "S21c"],
);

pol.opportunity.economy_tax = p(
  "supports",
  "Tax Reset: Citizens Income, land value tax and compulsory KiwiSaver 2.0; bring prices down bottom line.",
  ["S22b", "S22"],
);
pol.opportunity.health = p(
  "supports",
  "Coalition bottom line: 10-year cross-party health plan with primary/preventive care funding.",
  ["S22c"],
);
pol.opportunity.housing = p(
  "mixed",
  "Land value tax aimed at land-banking and affordability (Tax Reset); no standalone housing manifesto.",
  ["S22b"],
);
pol.opportunity.climate_environment = p(
  "supports",
  "Restore climate credibility and revive ocean health; recommit to Paris obligations and protect Climate Change Commission independence.",
  ["S22c", "S22"],
);
pol.opportunity.te_tiriti_maori = p(
  "mixed",
  "States a Te Tiriti partnership approach in negotiations without a single dedicated policy document.",
  ["S22c"],
);
pol.opportunity.social_issues = p(
  "supports",
  "Clean up politics: lobbying register and donation caps; Commerce Commission powers to reduce prices.",
  ["S22c"],
);

pol["te-pati-maori"].economy_tax = p(
  "supports",
  "Make the wealthiest pay their fair share to fund housing, health, education and whanau support.",
  ["S23c", "S23"],
);
pol["te-pati-maori"].foreign_defence = p(
  "supports",
  "Military neutrality / independent foreign policy; review military alignments; disaster-focused NZDF roles.",
  ["S23b"],
);
pol["te-pati-maori"].health = p(
  "supports",
  "Maori-led health authority; prevention and culturally safe, accountable services.",
  ["S23b", "S23"],
);
pol["te-pati-maori"].housing = p(
  "supports",
  "More public/affordable homes; build on Maori land; stop speculation and land-banking.",
  ["S23b", "S23"],
);
pol["te-pati-maori"].climate_environment = p(
  "supports",
  "Ban seabed mining; climate resilience; regenerative approaches aligned with Maori values.",
  ["S23b", "S23"],
);
pol["te-pati-maori"].education = p(
  "supports",
  "Maori-led education authority; embed matauranga Maori; remove barriers for whanau.",
  ["S23b", "S23"],
);
pol["te-pati-maori"].justice_crime = p(
  "supports",
  "Maori-led justice; reform poverty-criminalising laws; move from mass imprisonment.",
  ["S23b", "S23"],
);
pol["te-pati-maori"].te_tiriti_maori = p(
  "supports",
  "Entrench Te Tiriti; UNDRIP; independent commission; binding Tribunal recommendations.",
  ["S23b", "S23"],
);
pol["te-pati-maori"].social_issues = p(
  "supports",
  "Cost of living relief, takatapui mana, mokopuna/oranga whanau, kai sovereignty.",
  ["S23b", "S23"],
);

pol["te-tai-tokerau"].economy_tax = p(
  "supports",
  "Crown-iwi investment fund for regional transition infrastructure; universal whanau allowance; MSD debt amnesty.",
  ["S24b"],
);
pol["te-tai-tokerau"].health = p(
  "supports",
  "Autonomous iwi-governed health authority; bonded Maori clinicians; marae-based services.",
  ["S24b"],
);
pol["te-tai-tokerau"].housing = p(
  "supports",
  "Hemp-panel local build academy; papakainga rollout; rangatahi into construction on whenua Maori.",
  ["S24b"],
);
pol["te-tai-tokerau"].climate_environment = p(
  "supports",
  "Kaitiaki statutory authority; land-back for resilience; iwi/hapu environmental enforcement.",
  ["S24b"],
);
pol["te-tai-tokerau"].education = p(
  "mixed",
  "Rohe Construction Academy and paid mentorship; no full national curriculum policy published.",
  ["S24b"],
);
pol["te-tai-tokerau"].justice_crime = p(
  "supports",
  "Prison sinking lid; divert non-violent offenders to hapu-led rehabilitation; fiscal reallocation.",
  ["S24b"],
);
pol["te-tai-tokerau"].te_tiriti_maori = p(
  "supports",
  "Te Ture Mokopuna grounded in Te Tiriti; protect He Whakaputanga and tino rangatiratanga.",
  ["S24b", "S24"],
);
pol["te-tai-tokerau"].social_issues = p(
  "supports",
  "Mokopuna Act; mana kaumatua energy/kai support; backyard food sovereignty kits.",
  ["S24b"],
);

pol.vision.economy_tax = p(
  "supports",
  "First $25,000 tax-free; farm-gate pricing; penalties for firms not employing baseline NZ staff.",
  ["S25b"],
);
pol.vision.health = p(
  "supports",
  "Frontline primary care funding; remove race-based health targeting; expand pre/post-natal and Plunket.",
  ["S25b"],
);
pol.vision.housing = p(
  "supports",
  "Unlock crown land; RMA reform for dual home builds; hapu enterprise grants.",
  ["S25b"],
);
pol.vision.climate_environment = p(
  "opposes",
  "Leave Paris Accord; suspend UN-driven environmental regulation (sovereignty section).",
  ["S25b"],
);
pol.vision.education = p(
  "supports",
  "Remove gender theory/RSE from curriculum; focus on literacy, numeracy, science; higher teacher pay.",
  ["S25b"],
);
pol.vision.justice_crime = p(
  "supports",
  "Community support officers; grassroots 24/7 family services; integrated enforcement and prevention.",
  ["S25b"],
);
pol.vision.immigration = p(
  "opposes",
  "Pause mass immigration; longer citizenship path; end dual citizenship for new applicants.",
  ["S25b"],
);
pol.vision.te_tiriti_maori = p(
  "opposes",
  "One nation one people; end race-based/He Puapua policies; honour Treaty as covenant framing.",
  ["S25b"],
);
pol.vision.foreign_defence = p(
  "opposes",
  "Withdraw from UN; restore national sovereignty over global rule-setting.",
  ["S25b"],
);
pol.vision.social_issues = p(
  "supports",
  "Ministry for Families, newborn grants, parental rights bill, biological sex in law.",
  ["S25b"],
);

pol["womens-rights"].justice_crime = p(
  "supports",
  "Protect women from violence; oppose rough-sex defence; prison housing by biological sex (policy PDF).",
  ["S26b", "S26a"],
);

fs.writeFileSync(policiesPath, JSON.stringify(data, null, 2));

const partiesPath = path.join(root, "src/data/parties.json");
const parties = JSON.parse(fs.readFileSync(partiesPath, "utf8"));
for (const party of parties) {
  if (party.id === "act") party.leaders = ["David Seymour", "Nicole McKee"];
  if (party.id === "conservative") {
    party.website = "https://conservatives.org.nz/";
    party.sourceIds = ["S04", "S14b", "S14"];
  }
  if (party.id === "alcp") party.leaders = ["Maki Herbert", "Michael Appleby"];
  if (party.id === "womens-rights")
    party.leaders = ["Jill Ovens", "Dawn Trenberth"];
  if (party.id === "vision")
    party.leaders = ["Hannah Tamaki", "Heker Robertson"];
  if (party.id === "te-tai-tokerau")
    party.leaders = ["Mariameno Kapa-Kingi", "Kyla Campbell-Kamariera"];
  if (party.id === "opportunity")
    party.leaders = ["Qiulae Wong", "Daniel Eb"];
}
fs.writeFileSync(partiesPath, JSON.stringify(parties, null, 2));

const lists = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/lists.json"), "utf8"),
);
for (const party of parties) {
  const list = lists.parties[party.id] || [];
  const rows = data.policies[party.id] || {};
  let body = `# ${party.name}\n\n`;
  body += `- **Abbreviation:** ${party.abbreviation}\n`;
  body += `- **Website:** ${party.website}\n`;
  body += `- **Leaders:** ${party.leaders.join(", ")}\n`;
  body += `- **Summary:** ${party.summary}\n`;
  body += `- **Party sources:** ${party.sourceIds.join(", ")}\n\n`;
  body += "## Official party list (S04)\n\n";
  for (const c of list) body += `${c.rank}. ${c.name}\n`;
  body += "\n## Issue positions\n\n";
  for (const issue of data.issues) {
    const row = rows[issue.id];
    if (!row) continue;
    body += `### ${issue.label}\n`;
    body += `- **Stance:** ${row.stance}\n`;
    body += `- **Summary:** ${row.summary}\n`;
    body += `- **Sources:** ${row.sourceIds.join(", ")}\n`;
    body += `- **Verified:** ${row.lastVerified}\n\n`;
  }
  fs.writeFileSync(path.join(root, "notes/parties", `${party.id}.md`), body);
}

fs.writeFileSync(
  path.join(root, "notes/2026-10-11-primary-source-deep-dive.md"),
  `# Primary-source deep dive (2026-10-11)

Merged findings from a parallel research pass into policies.json and sources.md.

Focus improvements: Conservatives.org.nz, Vision NZ visionpolicies, Te Tai Tokerau our-policies, Green policy hub pages, ACT education/law-and-order/Treaty referendum, Opportunity Tax Reset/bottom lines, NZ Loyal overview, NZOFP/outdoors legacy pages, Te Pati Maori foreign policy.

Rule unchanged: unknowns remain where official pages still lack usable text.
`,
);

let unknown = 0;
for (const rows of Object.values(data.policies)) {
  for (const row of Object.values(rows)) {
    if (row.stance === "unknown") unknown += 1;
  }
}
console.log(
  `merged: sources=${Object.keys(sources).length} unknownStances=${unknown}`,
);
