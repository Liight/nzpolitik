/**
 * @file schema.ts
 * @description Zod schemas for election, parties, lists, policies, taxes, track-record, branding, coalition, viability, civic, sources
 * @onboarding
 * - All UI data must parse with these schemas in tests
 * - Party count for 2026 MVP is 17
 * - Track-record rows require >=2 sourceIds (pledge + outcome)
 * - Branding: logos in public/party-logos; colours for accent/monogram only
 * - Coalition/viability: every party has a cited row; unknown when unpublished
 * - Civic: why-vote blocks + history timeline; each item needs sourceIds
 * - Dependencies: zod
 * @see src/data/ for JSON sources of truth
 */
import { z } from "zod";

export const ISSUE_IDS = [
  "economy_tax",
  "health",
  "housing",
  "climate_environment",
  "education",
  "justice_crime",
  "immigration",
  "te_tiriti_maori",
  "foreign_defence",
  "social_issues",
] as const;

export const StanceSchema = z.enum(["supports", "opposes", "mixed", "unknown"]);

export const ElectionSchema = z.object({
  electionName: z.string().min(1),
  electionDay: z.string().min(1),
  advanceVotingStart: z.string().min(1),
  overseasVotingStart: z.string().min(1),
  enrolBy: z.string().min(1),
  officialResults: z.string().min(1),
  nominationsClosed: z.string().min(1),
  partyCount: z.literal(17),
  links: z.object({
    voteNz: z.string().url(),
    keyDates: z.string().url(),
    partyListsPdf: z.string().url(),
    enrol: z.string().url(),
    mmpHelp: z.string().url(),
  }),
  mmpSummary: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
});

export const PartySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  abbreviation: z.string().min(1),
  website: z.string().url(),
  leaders: z.array(z.string()).min(1),
  summary: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
});

export const PartiesArraySchema = z.array(PartySchema).length(17);

export const ListCandidateSchema = z.object({
  rank: z.number().int().positive(),
  name: z.string().min(1),
});

export const ListsSchema = z.object({
  sourceId: z.string().min(1),
  sourceUrl: z.string().url(),
  accessed: z.string().min(1),
  parties: z.record(z.array(ListCandidateSchema).min(1)),
});

export const PolicyRowSchema = z.object({
  stance: StanceSchema,
  summary: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
  lastVerified: z.string().min(1),
});

export const PoliciesFileSchema = z.object({
  issues: z
    .array(
      z.object({
        id: z.enum(ISSUE_IDS),
        label: z.string().min(1),
      }),
    )
    .length(ISSUE_IDS.length),
  policies: z.record(z.record(PolicyRowSchema)),
});

export const SourceSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  accessed: z.string().min(1),
  usedFor: z.string().min(1),
});

export const TAX_INSTRUMENTS = [
  "income_tax",
  "capital_gains",
  "wealth_tax",
  "land_tax",
  "gst",
  "company_tax",
  "carbon_ets",
  "kiwisaver_super",
  "other_levy",
] as const;

export const TaxStatusSchema = z.enum([
  "announced",
  "reported",
  "denied",
  "withdrawn",
  "unknown",
]);

export const TaxRowSchema = z.object({
  id: z.string().min(1),
  instrument: z.enum(TAX_INSTRUMENTS),
  title: z.string().min(1),
  summary: z.string().min(1),
  rateOrThreshold: z.string().min(1),
  status: TaxStatusSchema,
  sourceIds: z.array(z.string()).min(1),
  lastVerified: z.string().min(1),
});

export const TaxesFileSchema = z.object({
  instruments: z.array(z.enum(TAX_INSTRUMENTS)).length(TAX_INSTRUMENTS.length),
  parties: z.record(z.array(TaxRowSchema).min(1)),
});

export const TRACK_RECORD_PARTY_IDS = [
  "national",
  "labour",
  "green",
  "act",
  "nz-first",
  "te-pati-maori",
] as const;

export const TrackRecordStatusSchema = z.enum([
  "delivered",
  "partial",
  "not_delivered",
  "blocked_coalition",
  "superseded",
  "ongoing",
  "unknown",
]);

export const TrackRecordRoleSchema = z.enum([
  "governing",
  "support",
  "opposition",
]);

export const TRACK_RECORD_WINDOW_IDS = [
  "2005-2008",
  "2008-2017",
  "2017-2020",
  "2020-2023",
  "2023-2026",
] as const;

export type TrackRecordWindowId = (typeof TRACK_RECORD_WINDOW_IDS)[number];

export const TrackRecordWindowSchema = z.object({
  id: z.enum(TRACK_RECORD_WINDOW_IDS),
  label: z.string().min(1),
});

export const TrackRecordRowSchema = z.object({
  id: z.string().min(1),
  windowId: z.enum(TRACK_RECORD_WINDOW_IDS),
  issueId: z.enum(ISSUE_IDS),
  pledge: z.string().min(1),
  outcome: z.string().min(1),
  status: TrackRecordStatusSchema,
  role: TrackRecordRoleSchema,
  sourceIds: z.array(z.string()).min(2),
  lastVerified: z.string().min(1),
});

export const TrackRecordFileSchema = z.object({
  windows: z.array(TrackRecordWindowSchema).length(5),
  parties: z.record(z.array(TrackRecordRowSchema)),
});

const HexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export const LogoSourceSchema = z.enum([
  "electoral_commission",
  "party_website",
  "none",
]);

export const PartyBrandingSchema = z.object({
  logoFile: z.string().min(1),
  logoSource: LogoSourceSchema,
  primaryHex: HexColorSchema,
  secondaryHex: HexColorSchema,
  sourceIds: z.array(z.string()).min(1),
  lastVerified: z.string().min(1),
});

export const BrandingFileSchema = z.object({
  parties: z.record(PartyBrandingSchema),
});

export const CoalitionStanceSchema = z.enum([
  "open",
  "selective",
  "ruling_out",
  "unknown",
]);

export const CoalitionRowSchema = z.object({
  prefers: z.array(z.string()),
  rulesOut: z.array(z.string()),
  bottomLines: z.array(z.string()),
  stance: CoalitionStanceSchema,
  summary: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
  lastVerified: z.string().min(1),
});

export const CoalitionFileSchema = z.object({
  parties: z.record(CoalitionRowSchema),
});

export const ElectorateStrategySchema = z.enum([
  "list_only",
  "electorate_focus",
  "mixed",
  "unknown",
]);

export const ViabilityRowSchema = z.object({
  thresholdNote: z.string().min(1),
  electorateStrategy: ElectorateStrategySchema,
  listLength: z.number().int().nonnegative(),
  sourceIds: z.array(z.string()).min(1),
  lastVerified: z.string().min(1),
});

export const ViabilityFileSchema = z.object({
  parties: z.record(ViabilityRowSchema),
});

export const CivicWhyVoteSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
});

export const CivicHistoryEventSchema = z.object({
  year: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
});

export const CivicTurnoutExampleSchema = z.object({
  enrolled: z.number().int().positive(),
  nonVoters: z.number().int().nonnegative(),
  blocShareOfVotesCast: z.number().min(0).max(1),
  explanation: z.string().min(1),
});

export const CivicFileSchema = z.object({
  lastVerified: z.string().min(1),
  whyVote: z.array(CivicWhyVoteSchema).min(3),
  history: z.array(CivicHistoryEventSchema).min(5),
  turnoutExample: CivicTurnoutExampleSchema,
});

export type Party = z.infer<typeof PartySchema>;
export type Election = z.infer<typeof ElectionSchema>;
export type PolicyRow = z.infer<typeof PolicyRowSchema>;
export type Stance = z.infer<typeof StanceSchema>;
export type TaxRow = z.infer<typeof TaxRowSchema>;
export type TaxStatus = z.infer<typeof TaxStatusSchema>;
export type TaxInstrument = (typeof TAX_INSTRUMENTS)[number];
export type TrackRecordRow = z.infer<typeof TrackRecordRowSchema>;
export type TrackRecordStatus = z.infer<typeof TrackRecordStatusSchema>;
export type PartyBranding = z.infer<typeof PartyBrandingSchema>;
export type LogoSource = z.infer<typeof LogoSourceSchema>;
export type CoalitionRow = z.infer<typeof CoalitionRowSchema>;
export type CoalitionStance = z.infer<typeof CoalitionStanceSchema>;
export type ViabilityRow = z.infer<typeof ViabilityRowSchema>;
export type ElectorateStrategy = z.infer<typeof ElectorateStrategySchema>;
export type CivicFile = z.infer<typeof CivicFileSchema>;
export type CivicWhyVote = z.infer<typeof CivicWhyVoteSchema>;
export type CivicHistoryEvent = z.infer<typeof CivicHistoryEventSchema>;
