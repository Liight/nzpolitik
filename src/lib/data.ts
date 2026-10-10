/**
 * @file data.ts
 * @description Typed accessors for static JSON datasets
 * @onboarding
 * - Import JSON once here; pages import from data.ts
 * - Schema validation runs at module load via Zod parse
 * - Track-record parties may be empty arrays for never-governing parties
 * - Dependencies: zod schemas, JSON under src/data
 * @see src/lib/schema.ts
 */
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
import {
  BrandingFileSchema,
  CivicFileSchema,
  CoalitionFileSchema,
  ElectionSchema,
  ListsSchema,
  PartiesArraySchema,
  PoliciesFileSchema,
  TaxesFileSchema,
  TrackRecordFileSchema,
  ViabilityFileSchema,
  type CivicFile,
  type CoalitionRow,
  type Election,
  type Party,
  type PartyBranding,
  type TaxRow,
  type TrackRecordRow,
  type ViabilityRow,
} from "./schema";

export type { TrackRecordRow, PartyBranding, CoalitionRow, ViabilityRow, CivicFile };

export const election: Election = ElectionSchema.parse(electionJson);
export const parties: Party[] = PartiesArraySchema.parse(partiesJson);
export const lists = ListsSchema.parse(listsJson);
export const policiesFile = PoliciesFileSchema.parse(policiesJson);
export const taxesFile = TaxesFileSchema.parse(taxesJson);
export const trackRecordFile = TrackRecordFileSchema.parse(trackRecordJson);
export const brandingFile = BrandingFileSchema.parse(brandingJson);
export const coalitionFile = CoalitionFileSchema.parse(coalitionJson);
export const viabilityFile = ViabilityFileSchema.parse(viabilityJson);
export const civicFile: CivicFile = CivicFileSchema.parse(civicJson);

export function getParty(id: string): Party | undefined {
  return parties.find((p) => p.id === id);
}

export function getPartyList(id: string) {
  return lists.parties[id] ?? [];
}

export function getPartyPolicies(id: string) {
  return policiesFile.policies[id] ?? {};
}

export function getPartyTaxes(id: string): TaxRow[] {
  return taxesFile.parties[id] ?? [];
}

export function getPartyTrackRecord(id: string): TrackRecordRow[] {
  return trackRecordFile.parties[id] ?? [];
}

export function getPartyBranding(id: string): PartyBranding | undefined {
  return brandingFile.parties[id];
}

/** Public URL path for a party logo file under Vite public/. */
export function partyLogoUrl(id: string): string | undefined {
  const branding = brandingFile.parties[id];
  if (!branding) return undefined;
  return `/party-logos/${branding.logoFile}`;
}

export function getPartyCoalition(id: string): CoalitionRow | undefined {
  return coalitionFile.parties[id];
}

export function getPartyViability(id: string): ViabilityRow | undefined {
  return viabilityFile.parties[id];
}
