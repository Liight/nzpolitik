/**
 * @file merge-track-record-20yr.mjs
 * @description Expand track-record windows to ~2005-2026 and merge cited historical rows
 * @onboarding
 * - Run once: node scripts/merge-track-record-20yr.mjs
 * - Registers sources S159+ and appends rows; idempotent by row id
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcesPath = path.join(root, "src/data/sources.json");
const trackPath = path.join(root, "src/data/track-record.json");
const sourcesMdPath = path.join(root, "notes/sources.md");

const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
const track = JSON.parse(fs.readFileSync(trackPath, "utf8"));

track.windows = [
  { id: "2005-2008", label: "2005-2008 Labour-led government" },
  { id: "2008-2017", label: "2008-2017 National-led governments" },
  { id: "2017-2020", label: "2017-2020 Labour-NZ First-Greens" },
  { id: "2020-2023", label: "2020-2023 Labour-led government" },
  { id: "2023-2026", label: "2023-2026 National-ACT-NZ First government" },
];

let nextId = 159;
function addSource(url, usedFor) {
  for (const rec of Object.values(sources)) {
    if (rec.url === url) return rec.id;
  }
  const id = `S${String(nextId).padStart(3, "0")}`;
  nextId += 1;
  sources[id] = { id, url, accessed: "2026-10-11", usedFor };
  return id;
}

function row(party, def) {
  const sourceIds = def.sourceUrls.map((s) => addSource(s.url, s.usedFor));
  return {
    id: def.id,
    windowId: def.windowId,
    issueId: def.issueId,
    pledge: def.pledge,
    outcome: def.outcome,
    status: def.status,
    role: def.role,
    sourceIds,
    lastVerified: "2026-10-11",
  };
}

/** @type {Record<string, object[]>} */
const newRows = {
  national: [
    {
      id: "national-2008-tax-cuts",
      windowId: "2008-2017",
      issueId: "economy_tax",
      pledge:
        "2008 campaign: deliver National personal income-tax cuts and related threshold changes early in a National-led government.",
      outcome:
        "Taxation (Urgent Measures and Annual Rates) legislation in December 2008 implemented National's income-tax package.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/tax-changes-boost-economy-encourage-prosperity",
          usedFor: "National 2008 tax package announcement",
        },
        {
          url: "https://www.beehive.govt.nz/release/government-delivers-its-tax-cut-promises",
          usedFor: "Government delivers tax cut promises",
        },
      ],
    },
    {
      id: "national-2010-gst-tax-switch",
      windowId: "2008-2017",
      issueId: "economy_tax",
      pledge:
        "Budget 2010 tax switch: raise GST to 15% from 1 October 2010 and cut personal income-tax rates, with compensation.",
      outcome:
        "GST rose to 15% and personal tax rates were reduced from 1 October 2010 with compensation adjustments.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/fact-sheet-gst-and-compensation",
          usedFor: "Budget 2010 GST compensation fact sheet",
        },
        {
          url: "https://www.beehive.govt.nz/release/fact-sheet-personal-tax-cuts",
          usedFor: "Budget 2010 personal tax cuts fact sheet",
        },
      ],
    },
    {
      id: "national-2008-90-day-trials",
      windowId: "2008-2017",
      issueId: "social_issues",
      pledge:
        "Introduce 90-day trial periods for new employees as a pre-election employment-relations commitment.",
      outcome:
        "Employment Relations Amendment Act 2008 created statutory 90-day trial provisions from 1 March 2009 for smaller employers.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.legislation.govt.nz/act/public/2008/0106/latest/whole.html",
          usedFor: "Employment Relations Amendment Act 2008",
        },
        {
          url: "https://www.legislation.govt.nz/bill/government/2008/0008/latest/DLM1765601.html",
          usedFor: "Employment Relations Amendment Bill 2008 trial periods",
        },
      ],
    },
    {
      id: "national-2008-ufb",
      windowId: "2008-2017",
      issueId: "economy_tax",
      pledge:
        "2008 election: invest Crown capital to accelerate ultra-fast broadband fibre rollout for most New Zealanders.",
      outcome:
        "Government finalised the UFB initiative, signed Crown Fibre partner deals, and began physical rollout from 2010.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/ultra-fast-broadband-rollout-begins",
          usedFor: "UFB rollout begins",
        },
        {
          url: "https://www.scoop.co.nz/stories/PA0804/S00522.htm",
          usedFor: "National 2008 broadband investment pledge coverage",
        },
      ],
    },
    {
      id: "national-2011-mixed-ownership",
      windowId: "2008-2017",
      issueId: "economy_tax",
      pledge:
        "2011 election: extend mixed ownership — sell up to 49% of selected energy SOEs while keeping majority Crown control.",
      outcome:
        "MOM legislation passed; IPOs proceeded for Mighty River, Meridian and Genesis; Solid Energy never reached IPO (partial programme).",
      status: "partial",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.rnz.co.nz/news/politics/89600/national-announces-plans-for-asset-sale-profits",
          usedFor: "National asset sale plans",
        },
        {
          url: "https://www.legislation.govt.nz/act/public/2012/0045/latest/whole.html",
          usedFor: "Public Finance (Mixed Ownership Model) Amendment Act 2012",
        },
      ],
    },
    {
      id: "national-2017-2020-oppose-cgt",
      windowId: "2017-2020",
      issueId: "economy_tax",
      pledge:
        "As opposition, oppose a broad capital gains tax and commit that National would not introduce one.",
      outcome:
        "In April 2019 the Labour-led government abandoned CGT for lack of coalition consensus; no comprehensive CGT was enacted that term.",
      status: "delivered",
      role: "opposition",
      sourceUrls: [
        {
          url: "https://www.rnz.co.nz/news/politics/383033/capital-gains-tax-recommendations-opposition-comes-out-swinging",
          usedFor: "Opposition response to TWG CGT recommendations",
        },
        {
          url: "https://www.rnz.co.nz/news/politics/387253/no-mandate-for-capital-gains-tax-pm",
          usedFor: "PM: no mandate for capital gains tax",
        },
      ],
    },
    {
      id: "national-2017-2020-oil-gas-ban-reverse",
      windowId: "2017-2020",
      issueId: "climate_environment",
      pledge:
        "Pledge to reverse Labour's ban on new offshore oil and gas exploration permits if returned in 2020.",
      outcome:
        "National did not win 2020; Crown Minerals (Petroleum) Amendment Act 2018 kept the offshore ban through this window.",
      status: "not_delivered",
      role: "opposition",
      sourceUrls: [
        {
          url: "https://www.rnz.co.nz/news/politics/375417/parliament-passes-bill-banning-new-offshore-oil-and-gas-exploration",
          usedFor: "Parliament passes offshore oil and gas exploration ban",
        },
        {
          url: "https://www.beehive.govt.nz/release/planning-future-no-new-offshore-oil-and-gas-exploration-permits",
          usedFor: "Government announcement ending new offshore permits",
        },
      ],
    },
  ],
  act: [
    {
      id: "act-2017-2020-oppose-gun-laws",
      windowId: "2017-2020",
      issueId: "justice_crime",
      pledge:
        "As opposition after the March 2019 Christchurch attacks, ACT argued for a more carefully scoped firearms response and against rushed reform without adequate select-committee process.",
      outcome:
        "Arms (Prohibited Firearms, Magazines, and Parts) Amendment Act 2019 passed under urgency with broad support; ACT's preferred slower pathway was not adopted.",
      status: "not_delivered",
      role: "opposition",
      sourceUrls: [
        {
          url: "https://www.rnz.co.nz/news/political/386047/gun-laws-act-leader-david-seymour-says-government-rushed",
          usedFor: "Seymour on rushed gun law reform",
        },
        {
          url: "https://www.legislation.govt.nz/act/public/2019/0012/latest/whole.html",
          usedFor: "Arms Amendment Act 2019",
        },
      ],
    },
    {
      id: "act-2008-three-strikes",
      windowId: "2008-2017",
      issueId: "justice_crime",
      pledge:
        "2008 confidence-and-supply: enact ACT's three-strikes regime for repeat serious offenders.",
      outcome:
        "National and ACT agreed a three-strikes model in the Sentencing and Parole Reform Act 2010.",
      status: "delivered",
      role: "support",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/national-and-act-agree-three-strikes-regime",
          usedFor: "National and ACT agree three-strikes regime",
        },
        {
          url: "https://www.legislation.govt.nz/act/public/2010/0033/latest/whole.html",
          usedFor: "Sentencing and Parole Reform Act 2010",
        },
      ],
    },
    {
      id: "act-2011-charter-schools",
      windowId: "2008-2017",
      issueId: "education",
      pledge:
        "2011 confidence-and-supply: trial partnership/charter schools (kura hourua).",
      outcome:
        "Education Amendment Act 2013 inserted partnership schools provisions; first schools opened in subsequent years.",
      status: "delivered",
      role: "support",
      sourceUrls: [
        {
          url: "https://www.rnz.co.nz/news/politics/92973/national-act-agree-to-adopt-controversial-us-school-model",
          usedFor: "National-ACT partnership schools agreement",
        },
        {
          url: "https://www.legislation.govt.nz/act/public/2013/0034/latest/whole.html",
          usedFor: "Education Amendment Act 2013",
        },
      ],
    },
    {
      id: "act-2008-spending-reviews",
      windowId: "2008-2017",
      issueId: "economy_tax",
      pledge:
        "2008 National-ACT agreement: establish taskforces to review base government spending sector by sector.",
      outcome:
        "Government launched fundamental spending reviews on policy advice tied to the National-ACT agreement.",
      status: "delivered",
      role: "support",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/national-act-agreement-announced",
          usedFor: "National-ACT agreement announced",
        },
        {
          url: "https://www.beehive.govt.nz/release/government-review-spending-policy-advice",
          usedFor: "Government review of spending on policy advice",
        },
      ],
    },
  ],
  labour: [
    {
      id: "labour-2005-kiwisaver",
      windowId: "2005-2008",
      issueId: "economy_tax",
      pledge:
        "Budget 2005 / campaign: introduce KiwiSaver workplace retirement savings with government kick-start from 1 July 2007.",
      outcome:
        "KiwiSaver commenced 1 July 2007 with kick-start and matching support as delivered family-policy package.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/feature/labour-delivers-major-policies-families",
          usedFor: "Labour delivers KiwiSaver and family policies 2007",
        },
        {
          url: "https://www.legislation.govt.nz/act/public/2006/0040/latest/whole.html",
          usedFor: "KiwiSaver Act 2006",
        },
      ],
    },
    {
      id: "labour-2005-interest-free-loans",
      windowId: "2005-2008",
      issueId: "education",
      pledge:
        "2005 election pledge: no further interest on student loans for eligible NZ-resident borrowers from 1 April 2006.",
      outcome:
        "Student Loan Scheme Amendment Act 2005 implemented interest write-offs for eligible resident borrowers from 1 April 2006.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/1-april-marks-new-era-student-loans",
          usedFor: "1 April interest-free student loans",
        },
        {
          url: "https://www.legislation.govt.nz/act/public/2005/0122/latest/whole.html",
          usedFor: "Student Loan Scheme Amendment Act 2005",
        },
      ],
    },
    {
      id: "labour-2005-20-hours-ece",
      windowId: "2005-2008",
      issueId: "education",
      pledge:
        "Fund 20 hours free early childhood education per week for three- and four-year-olds from July 2007.",
      outcome:
        "20 Hours Free ECE took effect 1 July 2007 with large service and child uptake at launch.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/celebrate-start-20-hours-free-ece-0",
          usedFor: "20 Hours Free ECE start",
        },
        {
          url: "https://www.beehive.govt.nz/feature/labour-delivers-major-policies-families",
          usedFor: "Family policies including ECE",
        },
      ],
    },
    {
      id: "labour-2008-ets",
      windowId: "2005-2008",
      issueId: "climate_environment",
      pledge:
        "Establish a national emissions trading scheme to price greenhouse gas emissions.",
      outcome:
        "Climate Change Response (Emissions Trading) Amendment Act 2008 received royal assent 25 September 2008.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.legislation.govt.nz/act/public/2008/0085/latest/whole.html",
          usedFor: "Climate Change Response (Emissions Trading) Amendment Act 2008",
        },
        {
          url: "https://www.beehive.govt.nz/release/emissions-trading-scheme-passes-into-law",
          usedFor: "ETS passes into law",
        },
      ],
    },
    {
      id: "labour-2008-2017-stop-asset-sales",
      windowId: "2008-2017",
      issueId: "economy_tax",
      pledge:
        "As opposition, campaign to stop National's partial privatisation of state-owned energy companies.",
      outcome:
        "Partial sales of Mighty River, Meridian and Genesis proceeded; a 2013 citizens-initiated referendum opposed sales but did not stop them.",
      status: "not_delivered",
      role: "opposition",
      sourceUrls: [
        {
          url: "https://www.rnz.co.nz/news/election-2011/91683/national-planning-fire-sale-of-assets,-goff-warns",
          usedFor: "Labour warns against asset sales 2011",
        },
        {
          url: "https://www.scoop.co.nz/stories/PO1312/S00242/final-result-of-citizens-initiated-referendum.htm",
          usedFor: "2013 asset sales referendum final result",
        },
      ],
    },
    {
      id: "labour-2017-fees-free",
      windowId: "2017-2020",
      issueId: "education",
      pledge:
        "2017 campaign: first year of provider-based tertiary study fees-free for eligible new students from 2018.",
      outcome:
        "Fees Free began 1 January 2018; early Beehive reporting showed tens of thousands of learners on fees-free.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/317-million-year-support-tertiary-education-quality-and-update-first-four-months-fees-free",
          usedFor: "Fees Free early uptake update",
        },
        {
          url: "https://www.education.govt.nz/our-work/publications/budget-2018/fees-free-tertiary-education-and-training/",
          usedFor: "Education Fees Free policy pages",
        },
      ],
    },
    {
      id: "labour-2017-families-package",
      windowId: "2017-2020",
      issueId: "social_issues",
      pledge:
        "2017 Families Package: Best Start, Winter Energy Payment, Working for Families and accommodation changes.",
      outcome:
        "Families Package legislation passed; Best Start and related measures commenced mid-2018.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.msd.govt.nz/about-msd-and-our-work/newsroom/2017/families-package-qas.html",
          usedFor: "MSD Families Package Q&A",
        },
        {
          url: "https://www.legislation.govt.nz/act/public/2017/0051/latest/whole.html",
          usedFor: "Families Package (Income Tax and Benefits) Act 2017",
        },
      ],
    },
    {
      id: "labour-2017-foreign-buyer-ban",
      windowId: "2017-2020",
      issueId: "housing",
      pledge:
        "Ban non-resident foreign buyers from purchasing existing NZ homes; strengthen Overseas Investment Act.",
      outcome:
        "Overseas Investment Amendment Act 2018 restricted overseas purchases of existing residential land from October 2018.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.rnz.co.nz/news/politics/342276/labour-new-zealand-first-deal-the-nitty-gritty",
          usedFor: "Labour-NZ First coalition deal details",
        },
        {
          url: "https://www.legislation.govt.nz/act/public/2018/0025/latest/whole.html",
          usedFor: "Overseas Investment Amendment Act 2018",
        },
      ],
    },
    {
      id: "labour-2017-kiwibuild",
      windowId: "2017-2020",
      issueId: "housing",
      pledge:
        "KiwiBuild: 100,000 affordable homes for first-home buyers within ten years.",
      outcome:
        "By late 2019 the 100,000 target was reset/abandoned; completed KiwiBuild homes were far below interim targets.",
      status: "not_delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.rnz.co.nz/news/politics/427216/labour-promised-big-on-housing-has-it-delivered",
          usedFor: "RNZ housing delivery assessment",
        },
        {
          url: "https://www.beehive.govt.nz/release/kiwibuild-reset-announced",
          usedFor: "KiwiBuild reset announcement",
        },
      ],
    },
    {
      id: "labour-2017-offshore-oil-ban",
      windowId: "2017-2020",
      issueId: "climate_environment",
      pledge:
        "End new offshore oil and gas exploration permits as part of a low-carbon transition.",
      outcome:
        "April 2018: no further offshore petroleum exploration permits; Block Offer limited to onshore Taranaki; existing permits honoured.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/planning-future-no-new-offshore-oil-and-gas-exploration-permits",
          usedFor: "No new offshore oil and gas exploration permits",
        },
        {
          url: "https://www.rnz.co.nz/news/political/354858/govt-bans-new-offshore-oil-and-gas-exploration",
          usedFor: "RNZ coverage of offshore exploration ban",
        },
      ],
    },
  ],
  "nz-first": [
    {
      id: "nz-first-2017-pgf",
      windowId: "2017-2020",
      issueId: "economy_tax",
      pledge:
        "Coalition agreement: Regional Development / Provincial Growth Fund of about $1 billion a year.",
      outcome:
        "Cabinet established the PGF in late 2017; fund opened for applications in 2018 with multi-year funding committed.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/provincial-growth-fund-open-business",
          usedFor: "Provincial Growth Fund open for business",
        },
        {
          url: "https://www.beehive.govt.nz/release/coalition-agreement-new-zealand-labour-party-new-zealand-first",
          usedFor: "Labour-NZ First coalition agreement release",
        },
      ],
    },
    {
      id: "nz-first-2017-foreign-buyers",
      windowId: "2017-2020",
      issueId: "immigration",
      pledge:
        "Coalition agreement: stop non-resident foreigners buying existing houses; strengthen Overseas Investment Act.",
      outcome:
        "Overseas Investment Amendment Act 2018 introduced residential land screening from October 2018.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.rnz.co.nz/news/politics/342276/labour-new-zealand-first-deal-the-nitty-gritty",
          usedFor: "Coalition foreign buyer pledge",
        },
        {
          url: "https://www.legislation.govt.nz/act/public/2018/0025/latest/whole.html",
          usedFor: "Overseas Investment Amendment Act 2018",
        },
      ],
    },
    {
      id: "nz-first-2017-minimum-wage-20",
      windowId: "2017-2020",
      issueId: "economy_tax",
      pledge:
        "Coalition agreement: progressively raise the adult minimum wage toward $20 per hour.",
      outcome:
        "Adult minimum wage reached $20.00/hour from 1 April 2021 via Minimum Wage Order.",
      status: "delivered",
      role: "governing",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/minimum-wage-increase-2000-hour",
          usedFor: "Minimum wage increase to $20/hour",
        },
        {
          url: "https://www.legislation.govt.nz/regulation/public/2021/0024/latest/whole.html",
          usedFor: "Minimum Wage Order 2021",
        },
      ],
    },
    {
      id: "nz-first-2008-2017-buy-back-assets",
      windowId: "2008-2017",
      issueId: "economy_tax",
      pledge:
        "As opposition, commit to buy back shares in privatised SOEs at no more than the original sale price.",
      outcome:
        "Partial SOE sales completed under National; NZ First was not in government and did not buy back sold stakes before 2017.",
      status: "not_delivered",
      role: "opposition",
      sourceUrls: [
        {
          url: "https://www.scoop.co.nz/stories/PA1206/S00276/nz-first-committed-to-buying-back-state-owned-assets.htm",
          usedFor: "NZ First buy-back pledge 2012",
        },
        {
          url: "https://www.scoop.co.nz/stories/PO1312/S00242/final-result-of-citizens-initiated-referendum.htm",
          usedFor: "Asset sales referendum; sales proceeded",
        },
      ],
    },
  ],
  green: [
    {
      id: "green-2017-zero-carbon",
      windowId: "2017-2020",
      issueId: "climate_environment",
      pledge:
        "Confidence-and-supply: introduce a Zero Carbon Act and independent Climate Commission.",
      outcome:
        "Climate Change Response (Zero Carbon) Amendment Act received royal assent in November 2019, establishing the Climate Change Commission.",
      status: "delivered",
      role: "support",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/landmark-climate-change-bill-passes",
          usedFor: "Zero Carbon bill passes",
        },
        {
          url: "https://www.legislation.govt.nz/act/public/2019/0061/latest/whole.html",
          usedFor: "Climate Change Response (Zero Carbon) Amendment Act 2019",
        },
      ],
    },
    {
      id: "green-2017-welfare-overhaul",
      windowId: "2017-2020",
      issueId: "social_issues",
      pledge:
        "C&S agreement: overhaul welfare — improve access, review sanctions, and lift incomes.",
      outcome:
        "Welfare Expert Advisory Group reported in 2019; some benefit and sanction changes followed, but a full overhaul was not completed by 2020.",
      status: "partial",
      role: "support",
      sourceUrls: [
        {
          url: "https://www.rnz.co.nz/news/politics/342288/welfare-climate-big-winners-in-greens-labour-deal",
          usedFor: "Greens-Labour C&S welfare and climate items",
        },
        {
          url: "https://www.weag.govt.nz/weag-report/",
          usedFor: "WEAG Whakamana Tangata report",
        },
      ],
    },
    {
      id: "green-2017-cannabis-referendum",
      windowId: "2017-2020",
      issueId: "social_issues",
      pledge:
        "C&S agreement: hold a referendum on legalising personal-use cannabis by the 2020 election.",
      outcome:
        "2020 referendum held; official result was No — Cannabis Legalisation and Control Bill not enacted.",
      status: "not_delivered",
      role: "support",
      sourceUrls: [
        {
          url: "https://elections.nz/media-and-news/2020/official-referendum-results-released",
          usedFor: "Official 2020 referendum results",
        },
        {
          url: "https://www.rnz.co.nz/news/political/430251/cannabis-referendum-official-result-confirms-no-vote",
          usedFor: "Cannabis referendum No confirmed",
        },
      ],
    },
    {
      id: "green-2008-2017-asset-sales-referendum",
      windowId: "2008-2017",
      issueId: "economy_tax",
      pledge:
        "As opposition, support a citizens-initiated referendum against partial asset sales.",
      outcome:
        "2013 referendum returned a large No majority, but the National government continued remaining sales.",
      status: "partial",
      role: "opposition",
      sourceUrls: [
        {
          url: "https://www.scoop.co.nz/stories/PO1312/S00242/final-result-of-citizens-initiated-referendum.htm",
          usedFor: "Citizens-initiated referendum final result",
        },
        {
          url: "https://www.rnz.co.nz/news/political/229999/asset-sales-referendum-results",
          usedFor: "RNZ asset sales referendum results",
        },
      ],
    },
  ],
  "te-pati-maori": [
    {
      id: "tpm-2008-whanau-ora",
      windowId: "2008-2017",
      issueId: "health",
      pledge:
        "As National-led support partner (Maori Party), advance Whanau Ora / whanau-centred services (2008 confidence-and-supply).",
      outcome:
        "Budget 2010 funded Whanau Ora; programme launched with a responsible minister; later commissioning agencies established (continuity caveat: Maori Party lineage to Te Pati Maori).",
      status: "delivered",
      role: "support",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/national-maori-party-agreement-announced",
          usedFor: "National-Maori Party agreement announced",
        },
        {
          url: "https://www.scoop.co.nz/stories/PA1005/S00080/whanau-ora-an-investment-in-families.htm",
          usedFor: "Whanau Ora Budget 2010 investment",
        },
      ],
    },
    {
      id: "tpm-2008-foreshore-repeal",
      windowId: "2008-2017",
      issueId: "te_tiriti_maori",
      pledge:
        "Review and replace the Foreshore and Seabed Act 2004 while protecting public access (2008 C&S).",
      outcome:
        "Marine and Coastal Area (Takutai Moana) Act 2011 repealed the 2004 Act and restored a customary marine title pathway.",
      status: "delivered",
      role: "support",
      sourceUrls: [
        {
          url: "https://www.beehive.govt.nz/release/repeal-foreshore-and-seabed-act-announced",
          usedFor: "Repeal of Foreshore and Seabed Act announced",
        },
        {
          url: "https://www.legislation.govt.nz/act/public/2011/0003/latest/whole.html",
          usedFor: "Marine and Coastal Area (Takutai Moana) Act 2011",
        },
      ],
    },
    {
      id: "tpm-2011-constitutional-panel",
      windowId: "2008-2017",
      issueId: "te_tiriti_maori",
      pledge:
        "Continue constitutional review / advisory panel work arising from Maori Party–National relationship accords.",
      outcome:
        "Constitutional Advisory Panel reported in 2013 recommending ongoing conversation; no major entrenchment reforms enacted.",
      status: "partial",
      role: "support",
      sourceUrls: [
        {
          url: "https://www.justice.govt.nz/justice-sector-policy/constitutional-issues-and-human-rights/constitutional-advisory-panel/",
          usedFor: "Constitutional Advisory Panel archive",
        },
        {
          url: "https://www.beehive.govt.nz/release/national-maori-party-agreement-announced",
          usedFor: "Relationship agreement context",
        },
      ],
    },
  ],
};

for (const [partyId, defs] of Object.entries(newRows)) {
  if (!track.parties[partyId]) track.parties[partyId] = [];
  const existing = new Set(track.parties[partyId].map((r) => r.id));
  for (const def of defs) {
    if (existing.has(def.id)) continue;
    track.parties[partyId].push(row(partyId, def));
  }
}

// Ensure empty arrays exist for all TRACK_RECORD parties only — others may stay empty
fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
fs.writeFileSync(trackPath, JSON.stringify(track, null, 2) + "\n");

let md = fs.readFileSync(sourcesMdPath, "utf8");
const lines = [];
for (const [id, rec] of Object.entries(sources)) {
  const n = Number(id.slice(1));
  if (n >= 159 && !md.includes(`| ${id} |`)) {
    lines.push(`| ${id} | ${rec.url} | ${rec.accessed} | ${rec.usedFor} |`);
  }
}
if (lines.length) {
  fs.writeFileSync(sourcesMdPath, md.trimEnd() + "\n" + lines.join("\n") + "\n");
}

console.log(
  "Merged windows + rows. New sources from S159. Parties:",
  Object.fromEntries(
    Object.entries(track.parties).map(([k, v]) => [k, v.length]),
  ),
);
