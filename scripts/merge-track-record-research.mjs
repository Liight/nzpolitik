/**
 * @file merge-track-record-research.mjs
 * @description One-shot merge of parallel track-record research into JSON + notes
 * @onboarding
 * - Safe to re-run; skips rows/sources that already exist
 * - Dependencies: Node fs, track-record.json, sources.json
 */
import fs from "fs";

const sourcesPath = "d:/_AI_REPOS/nzpolitik/src/data/sources.json";
const trPath = "d:/_AI_REPOS/nzpolitik/src/data/track-record.json";
const sourcesMdPath = "d:/_AI_REPOS/nzpolitik/notes/sources.md";
const notePath = "d:/_AI_REPOS/nzpolitik/notes/2026-10-11-track-record.md";

const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
const tr = JSON.parse(fs.readFileSync(trPath, "utf8"));

const newSources = {
  S116: {
    id: "S116",
    url: "https://www.beehive.govt.nz/release/government-cancels-auckland-light-rail",
    accessed: "2026-10-11",
    usedFor: "Beehive cancels Auckland light rail Dec 2023",
  },
  S117: {
    id: "S117",
    url: "https://www.transport.govt.nz/assets/Uploads/Cancelling-the-Auckland-Light-Rail-Project-Cabinet-Paper_Proactive-Release.pdf",
    accessed: "2026-10-11",
    usedFor: "Cabinet paper cancelling Auckland light rail",
  },
  S118: {
    id: "S118",
    url: "https://www.beehive.govt.nz/release/major-step-towards-fairer-system-new-zealand-workers",
    accessed: "2026-10-11",
    usedFor: "Labour Fair Pay Agreements commitment release",
  },
  S119: {
    id: "S119",
    url: "https://www.employment.govt.nz/news-and-updates/fair-pay-agreements-bill-passes-into-law",
    accessed: "2026-10-11",
    usedFor: "Fair Pay Agreements Act passes into law",
  },
  S120: {
    id: "S120",
    url: "https://www.beehive.govt.nz/release/new-legislation-puts-new-zealand-path-smokefree-future",
    accessed: "2026-10-11",
    usedFor: "Labour 2022 smokefree endgame legislation release",
  },
  S121: {
    id: "S121",
    url: "https://legislation.govt.nz/act/public/2024/0006/latest/LMS939046.html",
    accessed: "2026-10-11",
    usedFor: "Smokefree Environments repeal Act 2024",
  },
  S122: {
    id: "S122",
    url: "https://www.legislation.govt.nz/act/public/2024/0040/latest/LMS965440.html",
    accessed: "2026-10-11",
    usedFor: "Education and Training Amendment Act 2024 charter schools",
  },
  S123: {
    id: "S123",
    url: "https://assets.nationbuilder.com/actnz/mailings/6957/attachments/original/National_ACT_Agreement.pdf",
    accessed: "2026-10-11",
    usedFor: "National-ACT coalition agreement (charter schools etc)",
  },
  S124: {
    id: "S124",
    url: "https://www.beehive.govt.nz/release/reshaping-health-system-bring-m%C4%81ori-health-closer-home",
    accessed: "2026-10-11",
    usedFor: "Beehive Maori Health Authority disestablishment framing",
  },
  S125: {
    id: "S125",
    url: "https://legislation.govt.nz/bill/member/2022/0140/latest/whole.html",
    accessed: "2026-10-11",
    usedFor: "TPM Electoral Right to Switch Rolls Freely bill",
  },
  S126: {
    id: "S126",
    url: "https://www.justice.govt.nz/justice-sector-policy/key-initiatives/a-treaty-principles-bill/",
    accessed: "2026-10-11",
    usedFor: "MoJ Treaty Principles Bill key initiative page",
  },
  S127: {
    id: "S127",
    url: "https://www.rnz.co.nz/news/politics/510396/bill-to-disestablish-maori-health-authority-passes-third-reading",
    accessed: "2026-10-11",
    usedFor: "RNZ Maori Health Authority disestablishment third reading",
  },
  S128: {
    id: "S128",
    url: "https://www.scoop.co.nz/stories/PA2211/S00082/government-votes-against-legislation-that-would-advance-maori-electoral-rights.htm",
    accessed: "2026-10-11",
    usedFor: "TPM roll-switch members bill defeated first reading 2022",
  },
};

Object.assign(sources, newSources);

const additions = {
  national: [
    {
      id: "national-2023-cancel-light-rail",
      windowId: "2023-2026",
      issueId: "housing",
      pledge:
        "Cancel Auckland Light Rail and reprioritise Auckland transport investment.",
      outcome:
        "Cabinet cancelled the Auckland Light Rail project in December 2023; the delivery company was wound up and no track was built under that project.",
      status: "delivered",
      role: "governing",
      sourceIds: ["S116", "S117"],
      lastVerified: "2026-10-11",
    },
  ],
  labour: [
    {
      id: "labour-2020-fair-pay-agreements",
      windowId: "2020-2023",
      issueId: "social_issues",
      pledge:
        "Introduce Fair Pay Agreements for sector-wide bargaining on pay and conditions.",
      outcome:
        "Fair Pay Agreements Act 2022 received royal assent and the system commenced in December 2022 (later repealed by the 2023-26 government).",
      status: "delivered",
      role: "governing",
      sourceIds: ["S118", "S119"],
      lastVerified: "2026-10-11",
    },
    {
      id: "labour-2020-smokefree",
      windowId: "2020-2023",
      issueId: "health",
      pledge:
        "Pass smoked-tobacco endgame law including smokefree generation, retail reduction and denicotinisation.",
      outcome:
        "Smokefree Environments and Regulated Products (Smoked Tobacco) Amendment Act 2022 passed; the three core measures were later repealed in 2024.",
      status: "delivered",
      role: "governing",
      sourceIds: ["S120", "S121"],
      lastVerified: "2026-10-11",
    },
  ],
  green: [
    {
      id: "green-2023-oppose-smokefree-repeal",
      windowId: "2023-2026",
      issueId: "health",
      pledge: "Oppose repeal of the 2022 smoked-tobacco endgame measures.",
      outcome:
        "Greens voted against repeal; the Smokefree Environments and Regulated Products Amendment Act 2024 still removed the generation ban, retail cut and denicotinisation settings.",
      status: "not_delivered",
      role: "opposition",
      sourceIds: ["S120", "S121"],
      lastVerified: "2026-10-11",
    },
  ],
  act: [
    {
      id: "act-2023-charter-schools",
      windowId: "2023-2026",
      issueId: "education",
      pledge:
        "Reintroduce charter schools / kura hourua (National-ACT coalition commitment).",
      outcome:
        "Education and Training Amendment Act 2024 restored a statutory charter-school framework.",
      status: "delivered",
      role: "governing",
      sourceIds: ["S123", "S122"],
      lastVerified: "2026-10-11",
    },
    {
      id: "act-2023-smokefree-repeal",
      windowId: "2023-2026",
      issueId: "health",
      pledge:
        "Repeal 2022 smoked-tobacco endgame measures (coalition commitment).",
      outcome:
        "Smokefree Environments and Regulated Products Amendment Act 2024 removed retail reduction, denicotinisation and generation-ban provisions.",
      status: "delivered",
      role: "governing",
      sourceIds: ["S109", "S121"],
      lastVerified: "2026-10-11",
    },
  ],
  "nz-first": [
    {
      id: "nzf-2023-disestablish-mha",
      windowId: "2023-2026",
      issueId: "health",
      pledge:
        "Support disestablishing Te Aka Whai Ora (Maori Health Authority) as part of the coalition health reset.",
      outcome:
        "Pae Ora (Disestablishment of Maori Health Authority) Amendment Act 2024 disestablished the authority (effective 30 June 2024).",
      status: "delivered",
      role: "governing",
      sourceIds: ["S124", "S114"],
      lastVerified: "2026-10-11",
    },
  ],
  "te-pati-maori": [
    {
      id: "tpm-2020-roll-switch-bill",
      windowId: "2020-2023",
      issueId: "te_tiriti_maori",
      pledge:
        "Pass a members bill letting Maori electors switch freely between Maori and general rolls.",
      outcome:
        "Electoral (Right to Switch Rolls Freely) Amendment Bill was defeated at first reading in November 2022.",
      status: "not_delivered",
      role: "opposition",
      sourceIds: ["S125", "S127"],
      lastVerified: "2026-10-11",
    },
  ],
};

additions["te-pati-maori"][0].sourceIds = ["S125", "S128"];

const nat = tr.parties.national.find((r) => r.id === "national-2020-oppose-light-rail");
if (nat) {
  nat.outcome =
    "Auckland light rail was not built in the 2020-23 term; the competing-bid process stalled and construction never started before the 2023 election.";
}

const tw = tr.parties.national.find((r) => r.id === "national-2023-three-waters-repeal");
if (tw) {
  tw.outcome =
    "Water Services Acts Repeal Act 2024 repealed the entity model in February 2024; Local Water Done Well replacement legislation continued to roll out afterward.";
  tw.status = "partial";
}

const actTreaty = tr.parties.act.find((r) => r.id === "act-2023-treaty-principles");
if (actTreaty) {
  actTreaty.sourceIds = ["S109", "S126"];
}

const labTreaty = tr.parties.labour.find(
  (r) => r.id === "labour-2023-oppose-treaty-principles",
);
if (labTreaty) {
  labTreaty.sourceIds = ["S104", "S126"];
}

const greenTreaty = tr.parties.green.find(
  (r) => r.id === "green-2023-oppose-treaty-principles",
);
if (greenTreaty) {
  greenTreaty.sourceIds = ["S104", "S126"];
}

const tpmTreaty = tr.parties["te-pati-maori"].find(
  (r) => r.id === "tpm-2023-oppose-treaty-principles",
);
if (tpmTreaty) {
  tpmTreaty.sourceIds = ["S104", "S126"];
}

for (const [partyId, rows] of Object.entries(additions)) {
  const existingIds = new Set(tr.parties[partyId].map((r) => r.id));
  for (const row of rows) {
    if (!existingIds.has(row.id)) {
      tr.parties[partyId].push(row);
    }
  }
}

fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
fs.writeFileSync(trPath, JSON.stringify(tr, null, 2) + "\n");

let md = fs.readFileSync(sourcesMdPath, "utf8");
if (!md.includes("| S116 |")) {
  const lines = Object.values(newSources)
    .map((s) => `| ${s.id} | ${s.url} | ${s.accessed} | ${s.usedFor} |`)
    .join("\n");
  fs.writeFileSync(sourcesMdPath, md.trimEnd() + "\n" + lines + "\n");
}

for (const [partyId, rows] of Object.entries(additions)) {
  const path = `d:/_AI_REPOS/nzpolitik/notes/parties/${partyId}.md`;
  let partyMd = fs.readFileSync(path, "utf8");
  for (const r of rows) {
    if (partyMd.includes(`### ${r.id}`)) continue;
    const block =
      `### ${r.id}\n` +
      `- **Window:** ${r.windowId}\n` +
      `- **Status:** ${r.status} (${r.role})\n` +
      `- **Pledge:** ${r.pledge}\n` +
      `- **Outcome:** ${r.outcome}\n` +
      `- **Sources:** ${r.sourceIds.join(", ")}\n` +
      `- **Verified:** ${r.lastVerified}\n\n`;
    if (partyMd.includes("### Honesty notes")) {
      partyMd = partyMd.replace("### Honesty notes", block + "### Honesty notes");
    } else {
      partyMd = partyMd.trimEnd() + "\n\n" + block;
    }
    const tableLine = `| ${r.windowId} | ${r.issueId} | ${r.status} | ${r.role} | ${r.sourceIds.join(", ")} |`;
    if (partyMd.includes("| Window | Issue | Status | Role | Sources |")) {
      partyMd = partyMd.replace(
        /(\| Window \| Issue \| Status \| Role \| Sources \|\n\|---\|---\|---\|---\|---\|\n)/,
        `$1${tableLine}\n`,
      );
    }
  }
  if (partyId === "national") {
    partyMd = partyMd.replace(
      /\| 2023-2026 \| housing \| delivered \| governing \| S89, S90 \|/,
      "| 2023-2026 | housing | partial | governing | S89, S90 |",
    );
    partyMd = partyMd.replace(
      /### national-2023-three-waters-repeal\n- \*\*Window:\*\* 2023-2026\n- \*\*Status:\*\* delivered \(governing\)/,
      "### national-2023-three-waters-repeal\n- **Window:** 2023-2026\n- **Status:** partial (governing)",
    );
  }
  fs.writeFileSync(path, partyMd);
}

let note = fs.readFileSync(notePath, "utf8");
if (!note.includes("## Follow-up merge")) {
  note += `
## Follow-up merge (research subagent)

Merged additional cited rows after parallel research completed:

- National: cancel Auckland light rail (delivered); Three Waters repeal marked partial (replacement still rolling)
- Labour: Fair Pay Agreements; 2022 smokefree endgame
- Greens: oppose smokefree repeal (not_delivered)
- ACT: charter schools; smokefree repeal; Treaty outcome source upgraded to MoJ (S126)
- NZ First: Maori Health Authority disestablishment
- Te Pati Maori: 2022 electoral roll-switch members bill defeat

Sources added: S116-S128.
`;
  fs.writeFileSync(notePath, note);
}

console.log(
  "counts",
  Object.fromEntries(Object.entries(tr.parties).map(([k, v]) => [k, v.length])),
);
