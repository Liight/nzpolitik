/**
 * @file schema.test.ts
 * @description Validates static JSON datasets against Zod schemas
 * @onboarding
 * - Fails if party count != 17 or any policy row lacks sourceIds
 * - Dependencies: vitest, schema.ts, data JSON
 */
import { describe, expect, it } from "vitest";
import electionJson from "../data/election.json";
import partiesJson from "../data/parties.json";
import listsJson from "../data/lists.json";
import policiesJson from "../data/policies.json";
import taxesJson from "../data/taxes.json";
import trackRecordJson from "../data/track-record.json";
import brandingJson from "../data/branding.json";
import coalitionJson from "../data/coalition.json";
import viabilityJson from "../data/viability.json";
import civicJson from "../data/civic.json";
import sourcesJson from "../data/sources.json";
import {
  BrandingFileSchema,
  CivicFileSchema,
  CoalitionFileSchema,
  ElectionSchema,
  ISSUE_IDS,
  ListsSchema,
  PartiesArraySchema,
  PoliciesFileSchema,
  SourceSchema,
  TAX_INSTRUMENTS,
  TRACK_RECORD_PARTY_IDS,
  TaxesFileSchema,
  TrackRecordFileSchema,
  ViabilityFileSchema,
} from "./schema";
import { effectiveShareOfEnrolled } from "./turnout";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));

describe("election.json", () => {
  it("matches ElectionSchema with partyCount 17", () => {
    const election = ElectionSchema.parse(electionJson);
    expect(election.partyCount).toBe(17);
  });
});

describe("parties.json", () => {
  it("contains exactly 17 valid parties", () => {
    const parties = PartiesArraySchema.parse(partiesJson);
    expect(parties).toHaveLength(17);
    const ids = new Set(parties.map((p) => p.id));
    expect(ids.size).toBe(17);
  });
});

describe("lists.json", () => {
  it("has a non-empty list for every party", () => {
    const lists = ListsSchema.parse(listsJson);
    const parties = PartiesArraySchema.parse(partiesJson);
    for (const party of parties) {
      expect(lists.parties[party.id]?.length).toBeGreaterThan(0);
    }
  });
});

describe("policies.json", () => {
  it("covers all issues for all 17 parties with cited rows", () => {
    const file = PoliciesFileSchema.parse(policiesJson);
    const parties = PartiesArraySchema.parse(partiesJson);
    expect(file.issues.map((i) => i.id).sort()).toEqual([...ISSUE_IDS].sort());

    for (const party of parties) {
      const rows = file.policies[party.id];
      expect(rows, `missing policies for ${party.id}`).toBeTruthy();
      for (const issueId of ISSUE_IDS) {
        const row = rows[issueId];
        expect(row, `${party.id}.${issueId}`).toBeTruthy();
        expect(row.sourceIds.length).toBeGreaterThan(0);
        expect(row.summary.length).toBeGreaterThan(0);
      }
    }
  });

  it("references only known source IDs", () => {
    const file = PoliciesFileSchema.parse(policiesJson);
    const known = new Set(Object.keys(sourcesJson));
    for (const [partyId, rows] of Object.entries(file.policies)) {
      for (const [issueId, row] of Object.entries(rows)) {
        for (const sid of row.sourceIds) {
          expect(known.has(sid), `${partyId}.${issueId} unknown ${sid}`).toBe(
            true,
          );
        }
      }
    }
  });
});

describe("sources.json", () => {
  it("contains valid source records", () => {
    const SourcesMapSchema = z.record(SourceSchema);
    const sources = SourcesMapSchema.parse(sourcesJson);
    expect(Object.keys(sources).length).toBeGreaterThan(10);
  });
});

describe("taxes.json", () => {
  it("covers all 17 parties with cited tax rows", () => {
    const file = TaxesFileSchema.parse(taxesJson);
    const parties = PartiesArraySchema.parse(partiesJson);
    expect(file.instruments).toEqual([...TAX_INSTRUMENTS]);
    for (const party of parties) {
      const rows = file.parties[party.id];
      expect(rows, `missing taxes for ${party.id}`).toBeTruthy();
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.sourceIds.length).toBeGreaterThan(0);
        expect(row.title.length).toBeGreaterThan(0);
      }
    }
  });

  it("references only known source IDs", () => {
    const file = TaxesFileSchema.parse(taxesJson);
    const known = new Set(Object.keys(sourcesJson));
    for (const [partyId, rows] of Object.entries(file.parties)) {
      for (const row of rows) {
        for (const sid of row.sourceIds) {
          expect(known.has(sid), `${partyId}.${row.id} unknown ${sid}`).toBe(
            true,
          );
        }
      }
    }
  });
});

describe("track-record.json", () => {
  it("has five windows and >=3 cited rows for each track-record party", () => {
    const file = TrackRecordFileSchema.parse(trackRecordJson);
    expect(file.windows).toHaveLength(5);
    expect(file.windows.map((w) => w.id)).toEqual([
      "2005-2008",
      "2008-2017",
      "2017-2020",
      "2020-2023",
      "2023-2026",
    ]);
    for (const partyId of TRACK_RECORD_PARTY_IDS) {
      const rows = file.parties[partyId] ?? [];
      expect(rows.length, `${partyId} row count`).toBeGreaterThanOrEqual(3);
      const windowSet = new Set(rows.map((r) => r.windowId));
      expect(
        windowSet.size,
        `${partyId} should span at least three windows`,
      ).toBeGreaterThanOrEqual(3);
      for (const row of rows) {
        expect(row.sourceIds.length).toBeGreaterThanOrEqual(2);
        expect(row.pledge.length).toBeGreaterThan(0);
        expect(row.outcome.length).toBeGreaterThan(0);
      }
    }
  });

  it("references only known source IDs", () => {
    const file = TrackRecordFileSchema.parse(trackRecordJson);
    const known = new Set(Object.keys(sourcesJson));
    for (const [partyId, rows] of Object.entries(file.parties)) {
      for (const row of rows) {
        for (const sid of row.sourceIds) {
          expect(known.has(sid), `${partyId}.${row.id} unknown ${sid}`).toBe(
            true,
          );
        }
      }
    }
  });
});

describe("branding.json", () => {
  it("covers all 17 parties with valid colours and logo files", () => {
    const file = BrandingFileSchema.parse(brandingJson);
    const partyList = PartiesArraySchema.parse(partiesJson);
    expect(Object.keys(file.parties).sort()).toEqual(
      partyList.map((p) => p.id).sort(),
    );
    const logosDir = path.resolve(testDir, "../../public/party-logos");
    const known = new Set(Object.keys(sourcesJson));
    for (const party of partyList) {
      const row = file.parties[party.id];
      expect(row, `missing branding for ${party.id}`).toBeTruthy();
      const logoPath = path.join(logosDir, row.logoFile);
      expect(fs.existsSync(logoPath), `missing logo ${logoPath}`).toBe(true);
      for (const sid of row.sourceIds) {
        expect(known.has(sid), `${party.id} unknown ${sid}`).toBe(true);
      }
    }
  });
});

describe("coalition.json", () => {
  it("covers all 17 parties with cited rows", () => {
    const file = CoalitionFileSchema.parse(coalitionJson);
    const partyList = PartiesArraySchema.parse(partiesJson);
    const known = new Set(Object.keys(sourcesJson));
    expect(Object.keys(file.parties).sort()).toEqual(
      partyList.map((p) => p.id).sort(),
    );
    for (const party of partyList) {
      const row = file.parties[party.id];
      expect(row.summary.length).toBeGreaterThan(0);
      expect(row.sourceIds.length).toBeGreaterThan(0);
      for (const sid of row.sourceIds) {
        expect(known.has(sid), `${party.id} unknown ${sid}`).toBe(true);
      }
    }
  });
});

describe("viability.json", () => {
  it("covers all 17 parties with list lengths matching lists.json", () => {
    const file = ViabilityFileSchema.parse(viabilityJson);
    const lists = ListsSchema.parse(listsJson);
    const partyList = PartiesArraySchema.parse(partiesJson);
    const known = new Set(Object.keys(sourcesJson));
    expect(Object.keys(file.parties).sort()).toEqual(
      partyList.map((p) => p.id).sort(),
    );
    for (const party of partyList) {
      const row = file.parties[party.id];
      expect(row.listLength).toBe(lists.parties[party.id].length);
      expect(row.thresholdNote.length).toBeGreaterThan(0);
      for (const sid of row.sourceIds) {
        expect(known.has(sid), `${party.id} unknown ${sid}`).toBe(true);
      }
    }
  });
});

describe("civic.json", () => {
  it("has cited why-vote blocks and a history timeline", () => {
    const file = CivicFileSchema.parse(civicJson);
    const known = new Set(Object.keys(sourcesJson));
    expect(file.whyVote.length).toBeGreaterThanOrEqual(3);
    expect(file.history.length).toBeGreaterThanOrEqual(5);
    for (const block of file.whyVote) {
      for (const sid of block.sourceIds) {
        expect(known.has(sid), `whyVote.${block.id} unknown ${sid}`).toBe(true);
      }
    }
    for (const event of file.history) {
      for (const sid of event.sourceIds) {
        expect(known.has(sid), `history.${event.year} unknown ${sid}`).toBe(
          true,
        );
      }
    }
    const maths = effectiveShareOfEnrolled(file.turnoutExample);
    expect(maths.votesCast).toBe(
      file.turnoutExample.enrolled - file.turnoutExample.nonVoters,
    );
  });
});
