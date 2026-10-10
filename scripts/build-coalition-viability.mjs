/**
 * @file build-coalition-viability.mjs
 * @description Write coalition.json + viability.json from curated research + lists.json
 * @onboarding
 * - Re-run after research refresh; keep sourceIds in sync with sources.json
 * - Dependencies: parties.json, lists.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lists = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/lists.json"), "utf8"),
);
const sourcesPath = path.join(root, "src/data/sources.json");
const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));

const newSources = {
  S131: {
    id: "S131",
    url: "https://www.opportunity.org.nz/bottom_lines",
    accessed: "2026-10-11",
    usedFor: "Opportunity Party 2026 coalition bottom lines",
  },
  S132: {
    id: "S132",
    url: "https://www.rnz.co.nz/news/politics_election-2026/1643401/health-supermarkets-and-political-lobbying-among-opportunity-party-s-bottom-lines",
    accessed: "2026-10-11",
    usedFor: "RNZ Opportunity bottom lines / Luxon rule-out context",
  },
  S133: {
    id: "S133",
    url: "https://www.rnz.co.nz/news/politics/814942/christopher-luxon-says-ruling-out-working-with-opportunity-party-not-a-surprise",
    accessed: "2026-10-11",
    usedFor: "RNZ National rules out Opportunity",
  },
  S134: {
    id: "S134",
    url: "https://thespinoff.co.nz/politics/25-08-2026/the-rule-in-rule-out-game-is-ruining-one-of-the-best-things-about-mmp",
    accessed: "2026-10-11",
    usedFor: "Spinoff 2026 rule-in rule-out summary (National/Labour blocs)",
  },
  S135: {
    id: "S135",
    url: "https://www.rnz.co.nz/news/politics/586422/labour-leader-chris-hipkins-quells-claims-of-internal-disagreement-over-te-pati-maori",
    accessed: "2026-10-11",
    usedFor: "RNZ Labour TPM compatibility notes prisons Treaty Ombudsman",
  },
  S136: {
    id: "S136",
    url: "https://www.1news.co.nz/2026/06/23/hipkins-confident-he-can-form-coalition-with-greens-without-budging-on-tax",
    accessed: "2026-10-11",
    usedFor: "1News Labour Greens tax negotiation stance",
  },
  S137: {
    id: "S137",
    url: "https://waateanews.com/2026/09/05/te-pati-maori-draws-a-line-in-the-sand-but-what-are-the-real-coalition-bottom-lines/",
    accessed: "2026-10-11",
    usedFor: "Waatea Te Pati Maori Te Tiriti constitutional bottom line",
  },
  S138: {
    id: "S138",
    url: "https://elections.nz/democracy-in-nz/what-is-new-zealands-system-of-government/how-are-mps-elected",
    accessed: "2026-10-11",
    usedFor: "vote.nz MMP threshold and electorate seat path",
  },
};

Object.assign(sources, newSources);
// S05 already MMP - keep S138 as vote.nz help alias or use S05
sources.S138 = newSources.S138;

const coalition = {
  parties: {
    national: {
      prefers: [
        "Continue governing arrangements with ACT and NZ First if numbers allow (2023 coalition partners).",
      ],
      rulesOut: [
        "Ruled out governing with Labour, the Greens, Te Pati Maori, and Opportunity (tax/alignment grounds reported).",
      ],
      bottomLines: [
        "Public framing: will not 'do business' with parties seeking higher taxes / new tax instruments such as land tax.",
      ],
      stance: "ruling_out",
      summary:
        "National campaigns as the lead centre-right option and has publicly ruled out several potential partners including Opportunity, while pointing to ACT and NZ First as its governing partners from 2023.",
      sourceIds: ["S133", "S134", "S109"],
      lastVerified: "2026-10-11",
    },
    labour: {
      prefers: [
        "Open to working with parties outside the current National-ACT-NZ First government, including continued relationship with the Greens and door open to Opportunity.",
      ],
      rulesOut: [
        "Will not work with parties in the current government (National, ACT, NZ First) to form a government.",
      ],
      bottomLines: [
        "Will not agree to abolish prisons or a Treaty Ombudsman with veto over Parliament (stated incompatibilities with some Te Pati Maori proposals).",
        "Will not adopt Green wealth/corporate tax packages that contradict Labour's campaign tax commitments.",
      ],
      stance: "selective",
      summary:
        "Labour rules out governing with the current coalition parties, keeps doors open to Greens/Opportunity/TPM discussions, and has signalled preference for confidence-and-supply style arrangements over full coalition with smaller partners while rejecting specific incompatible policies.",
      sourceIds: ["S134", "S135", "S136"],
      lastVerified: "2026-10-11",
    },
    green: {
      prefers: [
        "Positions for a change of government with Labour; historically provided confidence and supply / cooperation.",
      ],
      rulesOut: [
        "Opposes continuing the National-ACT-NZ First government agenda (campaign opposition posture).",
      ],
      bottomLines: [
        "Major tax and redistribution proposals (e.g. wealth tax framing) remain core platform asks in negotiations with Labour, though Labour has refused to adopt them.",
      ],
      stance: "selective",
      summary:
        "The Greens seek to replace the current government alongside Labour and push progressive tax and climate priorities; published 2026 materials emphasise policy ambition more than a fixed multi-party rule-out list.",
      sourceIds: ["S136", "S75", "S16"],
      lastVerified: "2026-10-11",
    },
    act: {
      prefers: [
        "Governing partnership with National (and NZ First as in 2023 National-ACT agreement).",
      ],
      rulesOut: [
        "Campaign framing against Labour/Greens/Te Pati Maori forming government.",
      ],
      bottomLines: [
        "2023 National-ACT agreement items remain a reference for ACT priorities (e.g. Treaty Principles process to select committee, regulatory reform).",
      ],
      stance: "selective",
      summary:
        "ACT positions as National's classical-liberal governing partner and campaigns to keep Labour, Greens and Te Pati Maori out of government, with 2023 coalition text documenting prior red-line bargains.",
      sourceIds: ["S109", "S134", "S10"],
      lastVerified: "2026-10-11",
    },
    "nz-first": {
      prefers: [
        "Governing arrangements with National (2023 National-NZ First coalition).",
      ],
      rulesOut: [
        "Strong public opposition to returning Labour to government (campaign messaging).",
      ],
      bottomLines: [
        "2023 agreement priorities (e.g. foreign buyers tax blocked; smokefree repeal; Fees Free switch) show NZ First uses coalition deals to hard-wire vetoes.",
      ],
      stance: "selective",
      summary:
        "NZ First campaigns as a populist partner able to restrain or reshape National-led governments; 2023 coalition text is the clearest published record of its deal-breaker style, while 2026 rule-outs focus on blocking Labour.",
      sourceIds: ["S93", "S134", "S19"],
      lastVerified: "2026-10-11",
    },
    "te-pati-maori": {
      prefers: [
        "Support for a change of government away from the National-ACT-NZ First coalition if Te Tiriti bottom lines can be met.",
      ],
      rulesOut: [
        "Opposes the current governing coalition's Treaty and Maori policy agenda.",
      ],
      bottomLines: [
        "Protecting Te Tiriti and a pathway toward constitutional transformation framed as a negotiation bottom line.",
      ],
      stance: "selective",
      summary:
        "Te Pati Maori centres Te Tiriti / constitutional demands as the price of supporting an alternative government; Labour has left the door ajar while rejecting some specific TPM policy proposals.",
      sourceIds: ["S137", "S135", "S23"],
      lastVerified: "2026-10-11",
    },
    opportunity: {
      prefers: [
        "Open to coalition or confidence-and-supply with either National or Labour.",
      ],
      rulesOut: [],
      bottomLines: [
        "Empower Commerce Commission on anti-competitive market power (including structural separation tools).",
        "Lobbying register/code and donation caps.",
        "10-year cross-party health plan with funding/workforce/infrastructure commitments.",
        "Phase out bottom trawling (start with damaged inshore areas).",
        "Recommit to Paris obligations and protect Climate Change Commission independence.",
      ],
      stance: "open",
      summary:
        "Opportunity published five formal 2026 bottom lines and says it will talk to either major party; National has ruled Opportunity out over tax policy while Opportunity says its door remains open.",
      sourceIds: ["S131", "S132", "S133"],
      lastVerified: "2026-10-11",
    },
    alliance: {
      prefers: [],
      rulesOut: [],
      bottomLines: [],
      stance: "unknown",
      summary:
        "Alliance contests the 2026 party vote with left/democratic-socialist policy; a clear published coalition preference matrix was not found in sources checked.",
      sourceIds: ["S11"],
      lastVerified: "2026-10-11",
    },
    "animal-justice": {
      prefers: [],
      rulesOut: [],
      bottomLines: [],
      stance: "unknown",
      summary:
        "Animal Justice focuses on animal-rights policy; no clear multi-party coalition rule-in/rule-out statement found in sources checked.",
      sourceIds: ["S12"],
      lastVerified: "2026-10-11",
    },
    alcp: {
      prefers: [],
      rulesOut: [],
      bottomLines: [],
      stance: "unknown",
      summary:
        "ALCP is organised around cannabis law reform; coalition preferences beyond that issue were not clearly published in sources checked.",
      sourceIds: ["S13"],
      lastVerified: "2026-10-11",
    },
    conservative: {
      prefers: [],
      rulesOut: [],
      bottomLines: [],
      stance: "unknown",
      summary:
        "Conservative Party NZ contests on socially conservative themes; a detailed 2026 coalition preference list was not found in sources checked.",
      sourceIds: ["S14"],
      lastVerified: "2026-10-11",
    },
    "free-palestine": {
      prefers: [],
      rulesOut: [],
      bottomLines: [],
      stance: "unknown",
      summary:
        "Free Palestine campaigns on Palestine-related foreign policy; formal coalition preference statements were not found in sources checked.",
      sourceIds: ["S15"],
      lastVerified: "2026-10-11",
    },
    "nz-loyal": {
      prefers: [],
      rulesOut: [],
      bottomLines: [],
      stance: "unknown",
      summary:
        "NZ Loyal contests with loyalty/sovereignty messaging; clear governing-partner preferences were not found in sources checked.",
      sourceIds: ["S20"],
      lastVerified: "2026-10-11",
    },
    "outdoors-freedom": {
      prefers: [],
      rulesOut: [],
      bottomLines: [],
      stance: "unknown",
      summary:
        "NZ Outdoors & Freedom emphasises civil liberties and direct democracy; published coalition red-lines were not found in sources checked.",
      sourceIds: ["S21"],
      lastVerified: "2026-10-11",
    },
    "te-tai-tokerau": {
      prefers: [],
      rulesOut: [],
      bottomLines: [],
      stance: "unknown",
      summary:
        "Te Tai Tokerau Party is newly registered with a short list focused on the Te Tai Tokerau region; national coalition preferences were not published in sources checked.",
      sourceIds: ["S24", "S06"],
      lastVerified: "2026-10-11",
    },
    vision: {
      prefers: [],
      rulesOut: [],
      bottomLines: [],
      stance: "unknown",
      summary:
        "Vision New Zealand contests the party vote; a clear published coalition preference matrix was not found in sources checked.",
      sourceIds: ["S25"],
      lastVerified: "2026-10-11",
    },
    "womens-rights": {
      prefers: [],
      rulesOut: [],
      bottomLines: [],
      stance: "unknown",
      summary:
        "Women's Rights Party focuses on sex-based rights policy; formal coalition rule-ins/outs were not found in sources checked.",
      sourceIds: ["S26"],
      lastVerified: "2026-10-11",
    },
  },
};

const viabilityNotes = {
  national: {
    electorateStrategy: "mixed",
    thresholdNote:
      "Major party contesting both electorates and the party vote; historically well above the 5% party-vote threshold.",
  },
  labour: {
    electorateStrategy: "mixed",
    thresholdNote:
      "Major party contesting both electorates and the party vote; historically well above the 5% party-vote threshold.",
  },
  green: {
    electorateStrategy: "mixed",
    thresholdNote:
      "Contests electorates and a long party list; typically relies on the party vote crossing ~5% (or an electorate seat) for list seats.",
  },
  act: {
    electorateStrategy: "mixed",
    thresholdNote:
      "Contests electorates and a long party list; party-vote share and/or an electorate seat determine list representation under MMP.",
  },
  "nz-first": {
    electorateStrategy: "mixed",
    thresholdNote:
      "Contests electorates and a long party list; without an electorate seat, party vote near or above 5% is the usual path to seats.",
  },
  "te-pati-maori": {
    electorateStrategy: "electorate_focus",
    thresholdNote:
      "Official 2026 list is very short (one list candidate), reflecting an electorate-centred strategy; electorate wins can bring members in even if party vote is under 5%.",
  },
  opportunity: {
    electorateStrategy: "mixed",
    thresholdNote:
      "Long party list; without an electorate seat, seats depend on reaching about 5% of the party vote under MMP.",
  },
  alliance: {
    electorateStrategy: "list_only",
    thresholdNote:
      "Primarily a party-vote contest; without an electorate seat, list seats require about 5% of the nationwide party vote.",
  },
  "animal-justice": {
    electorateStrategy: "list_only",
    thresholdNote:
      "Primarily a party-vote contest; without an electorate seat, list seats require about 5% of the nationwide party vote.",
  },
  alcp: {
    electorateStrategy: "list_only",
    thresholdNote:
      "Primarily a party-vote contest; without an electorate seat, list seats require about 5% of the nationwide party vote.",
  },
  conservative: {
    electorateStrategy: "list_only",
    thresholdNote:
      "Primarily a party-vote contest; without an electorate seat, list seats require about 5% of the nationwide party vote.",
  },
  "free-palestine": {
    electorateStrategy: "list_only",
    thresholdNote:
      "Primarily a party-vote contest; without an electorate seat, list seats require about 5% of the nationwide party vote.",
  },
  "nz-loyal": {
    electorateStrategy: "list_only",
    thresholdNote:
      "Primarily a party-vote contest; without an electorate seat, list seats require about 5% of the nationwide party vote.",
  },
  "outdoors-freedom": {
    electorateStrategy: "list_only",
    thresholdNote:
      "Primarily a party-vote contest; without an electorate seat, list seats require about 5% of the nationwide party vote.",
  },
  "te-tai-tokerau": {
    electorateStrategy: "electorate_focus",
    thresholdNote:
      "Very short official list (two candidates) and regional branding point to an electorate-centred strategy; check vote.nz for electorate contests.",
  },
  vision: {
    electorateStrategy: "list_only",
    thresholdNote:
      "Primarily a party-vote contest; without an electorate seat, list seats require about 5% of the nationwide party vote.",
  },
  "womens-rights": {
    electorateStrategy: "list_only",
    thresholdNote:
      "Primarily a party-vote contest; without an electorate seat, list seats require about 5% of the nationwide party vote.",
  },
};

const viability = { parties: {} };
for (const [id, meta] of Object.entries(viabilityNotes)) {
  const listLength = lists.parties[id]?.length ?? 0;
  viability.parties[id] = {
    ...meta,
    listLength,
    sourceIds: ["S05", "S04", "S138"],
    lastVerified: "2026-10-11",
  };
}

fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
fs.writeFileSync(
  path.join(root, "src/data/coalition.json"),
  JSON.stringify(coalition, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(root, "src/data/viability.json"),
  JSON.stringify(viability, null, 2) + "\n",
);

let md = fs.readFileSync(path.join(root, "notes/sources.md"), "utf8");
if (!md.includes("| S131 |")) {
  const lines = Object.values(newSources)
    .map((s) => `| ${s.id} | ${s.url} | ${s.accessed} | ${s.usedFor} |`)
    .join("\n");
  fs.writeFileSync(path.join(root, "notes/sources.md"), md.trimEnd() + "\n" + lines + "\n");
}

console.log(
  "coalition",
  Object.keys(coalition.parties).length,
  "viability",
  Object.keys(viability.parties).length,
);
