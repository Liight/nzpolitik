/**
 * @file PartyDetailPage.tsx
 * @description Party profile: tax, track record, coalition, policies, list
 * @onboarding
 * - Route param :partyId
 * - Track record then Coalition between Tax and Policy
 * - Viability note in header (MMP threshold context)
 * - Dependencies: data.ts, TaxDossier, TrackRecordSection, CoalitionSection
 */
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CitationChips } from "../components/CitationChips";
import { CoalitionSection } from "../components/CoalitionSection";
import { StanceBadge } from "../components/StanceBadge";
import { PartyLogo } from "../components/PartyLogo";
import { TaxDossier } from "../components/TaxDossier";
import { TrackRecordSection } from "../components/TrackRecordSection";
import {
  getParty,
  getPartyBranding,
  getPartyCoalition,
  getPartyList,
  getPartyPolicies,
  getPartyTaxes,
  getPartyTrackRecord,
  getPartyViability,
  policiesFile,
} from "../lib/data";

export function PartyDetailPage() {
  const { partyId = "" } = useParams();
  const party = getParty(partyId);
  const list = getPartyList(partyId);
  const policyRows = getPartyPolicies(partyId);
  const taxRows = getPartyTaxes(partyId);
  const trackRows = getPartyTrackRecord(partyId);
  const branding = getPartyBranding(partyId);
  const coalition = getPartyCoalition(partyId);
  const viability = getPartyViability(partyId);
  const [showAll, setShowAll] = useState(false);

  const visibleList = useMemo(
    () => (showAll ? list : list.slice(0, 10)),
    [list, showAll],
  );

  if (!party) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl font-bold">Party not found</h1>
        <Link to="/parties" className="text-fern-700 underline">
          Back to parties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header
        className="space-y-3 border-t-[3px] pt-4"
        style={
          branding ? { borderTopColor: branding.primaryHex } : undefined
        }
      >
        <div className="flex items-start gap-4">
          <PartyLogo partyId={party.id} size="lg" />
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-fern-700">
              {party.abbreviation}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-ink-950">
              {party.name}
            </h1>
          </div>
        </div>
        <p className="text-lg text-ink-700 max-w-3xl">{party.summary}</p>
        <p className="text-ink-700">
          <span className="font-semibold">Leaders:</span> {party.leaders.join(", ")}
        </p>
        {viability && (
          <p className="text-sm text-ink-700 max-w-3xl rounded-md border border-ink-900/10 bg-white/70 px-3 py-2">
            <span className="font-semibold">MMP context:</span> {viability.thresholdNote}{" "}
            <span className="text-ink-500">
              (list length {viability.listLength}; strategy{" "}
              {viability.electorateStrategy.replace(/_/g, " ")})
            </span>
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <a
            href={party.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-md bg-fern-600 px-4 py-2 text-white font-semibold hover:bg-fern-700"
          >
            Official website
          </a>
          <Link
            to={`/compare?parties=${party.id}`}
            className="inline-flex rounded-md border border-ink-900/20 px-4 py-2 font-semibold hover:bg-white/70"
          >
            Compare
          </Link>
        </div>
        <CitationChips sourceIds={party.sourceIds} />
      </header>

      <TaxDossier rows={taxRows} />

      <TrackRecordSection partyId={party.id} rows={trackRows} />

      <CoalitionSection partyId={party.id} row={coalition} />

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold">Policy positions</h2>
        <p className="text-sm text-ink-700">
          Neutral summaries with mandatory citations. Unknown means we could not find a clear
          published position in sources checked on the verification date.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {policiesFile.issues.map((issue) => {
            const row = policyRows[issue.id];
            if (!row) return null;
            return (
              <article
                key={issue.id}
                className="rounded-xl border border-ink-900/10 bg-white/80 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-ink-950">{issue.label}</h3>
                  <StanceBadge stance={row.stance} />
                </div>
                <p className="text-sm text-ink-700">{row.summary}</p>
                <p className="text-xs text-ink-500 mt-2">Verified {row.lastVerified}</p>
                <CitationChips sourceIds={row.sourceIds} />
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold">Official party list</h2>
        <p className="text-sm text-ink-700">
          Order from the Electoral Commission party lists PDF. List seats are filled in this order
          after electorate winners are removed.
        </p>
        <ol className="columns-1 sm:columns-2 gap-8 text-sm text-ink-800">
          {visibleList.map((c) => (
            <li key={`${c.rank}-${c.name}`} className="mb-1 break-inside-avoid">
              <span className="font-semibold text-ink-500 w-8 inline-block">{c.rank}.</span>{" "}
              {c.name}
            </li>
          ))}
        </ol>
        {list.length > 10 && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="rounded-md border border-ink-900/20 px-4 py-2 text-sm font-semibold hover:bg-white"
          >
            {showAll ? "Show top 10" : `Show all ${list.length} candidates`}
          </button>
        )}
        <CitationChips sourceIds={["S04"]} />
      </section>
    </div>
  );
}
