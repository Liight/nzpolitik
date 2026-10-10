/**
 * @file ComparePage.tsx
 * @description Side-by-side issue matrix for 2-4 selected parties
 * @onboarding
 * - Query ?parties=act,labour preselects
 * - Uses compare.ts for selection rules
 * - Dependencies: data.ts, compare.ts, CitationChips
 */
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CitationChips } from "../components/CitationChips";
import {
  COMPARE_PARTY_COL,
  COMPARE_STICKY_BODY,
  COMPARE_STICKY_HEADER,
  CompareScroll,
} from "../components/CompareScroll";
import { PartyLogo } from "../components/PartyLogo";
import { StanceBadge } from "../components/StanceBadge";
import {
  MAX_COMPARE,
  compareStatusMessage,
  isCompareReady,
  togglePartySelection,
} from "../lib/compare";
import { getPartyPolicies, parties, policiesFile } from "../lib/data";

function parseInitial(params: URLSearchParams): string[] {
  const raw = params.get("parties");
  if (!raw) return [];
  const ids = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const valid = new Set(parties.map((p) => p.id));
  return ids.filter((id) => valid.has(id)).slice(0, MAX_COMPARE);
}

export function ComparePage() {
  const [params] = useSearchParams();
  const [selected, setSelected] = useState<string[]>(() => parseInitial(params));

  const selectedParties = useMemo(
    () => selected.map((id) => parties.find((p) => p.id === id)).filter(Boolean),
    [selected],
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">Compare</h1>
        <p className="text-ink-700 max-w-2xl">
          Select two to four parties. Cells show stance labels and cited summaries — not rankings.
        </p>
        <p className="text-sm text-ink-600">
          Also{" "}
          <Link to="/compare/tax" className="underline text-fern-700">
            taxes
          </Link>
          ,{" "}
          <Link to="/compare/coalition" className="underline text-fern-700">
            coalitions
          </Link>
          , and{" "}
          <Link to="/compare/track-record" className="underline text-fern-700">
            track record
          </Link>
          .
        </p>
        <p className="text-sm font-semibold text-fern-700" role="status">
          {compareStatusMessage(selected.length)}
        </p>
      </header>

      <fieldset>
        <legend className="sr-only">Select parties to compare</legend>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {parties.map((party) => {
            const checked = selected.includes(party.id);
            return (
              <li key={party.id}>
                <label className="flex items-start gap-3 rounded-lg border border-ink-900/10 bg-white/80 px-3 py-2 cursor-pointer hover:border-fern-500">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSelected((prev) => togglePartySelection(prev, party.id))
                    }
                    className="mt-1"
                  />
                  <PartyLogo partyId={party.id} size="sm" />
                  <span>
                    <span className="block font-semibold text-ink-950">{party.name}</span>
                    <span className="text-xs text-ink-500">{party.abbreviation}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {!isCompareReady(selected) && (
        <p className="text-ink-700">Choose at least two parties to see the matrix.</p>
      )}

      {isCompareReady(selected) && (
        <CompareScroll>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-ink-950 text-sand-50">
                <th className={COMPARE_STICKY_HEADER}>Issue</th>
                {selectedParties.map((party) =>
                  party ? (
                    <th key={party.id} className={COMPARE_PARTY_COL}>
                      <Link
                        to={`/parties/${party.id}`}
                        className="inline-flex items-center gap-2 underline decoration-fern-500"
                      >
                        <PartyLogo partyId={party.id} size="sm" />
                        {party.abbreviation}
                      </Link>
                    </th>
                  ) : null,
                )}
              </tr>
            </thead>
            <tbody>
              {policiesFile.issues.map((issue) => (
                <tr key={issue.id} className="border-t border-ink-900/10 align-top">
                  <th className={COMPARE_STICKY_BODY}>{issue.label}</th>
                  {selected.map((partyId) => {
                    const row = getPartyPolicies(partyId)[issue.id];
                    if (!row) {
                      return <td key={partyId} className="p-3 text-ink-500">—</td>;
                    }
                    return (
                      <td key={partyId} className="p-3">
                        <StanceBadge stance={row.stance} />
                        <p className="mt-2 text-ink-700">{row.summary}</p>
                        <CitationChips sourceIds={row.sourceIds} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CompareScroll>
      )}
    </div>
  );
}
