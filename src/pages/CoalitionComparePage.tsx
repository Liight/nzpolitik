/**
 * @file CoalitionComparePage.tsx
 * @description Compare coalition preferences / red lines for 2-4 parties
 * @onboarding
 * - Route: /compare/coalition
 * - Reuses compare.ts selection helpers
 * - Dependencies: coalition data, PartyLogo, CoalitionStanceBadge
 */
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CitationChips } from "../components/CitationChips";
import { CoalitionStanceBadge } from "../components/CoalitionStanceBadge";
import {
  COMPARE_PARTY_COL,
  COMPARE_STICKY_BODY,
  COMPARE_STICKY_HEADER,
  CompareScroll,
} from "../components/CompareScroll";
import { PartyLogo } from "../components/PartyLogo";
import {
  MAX_COMPARE,
  compareStatusMessage,
  isCompareReady,
  togglePartySelection,
} from "../lib/compare";
import { getPartyCoalition, parties } from "../lib/data";

function parseInitial(params: URLSearchParams): string[] {
  const raw = params.get("parties");
  if (!raw) return [];
  const valid = new Set(parties.map((p) => p.id));
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((id) => valid.has(id))
    .slice(0, MAX_COMPARE);
}

function CellList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-ink-500 text-xs">None published</p>;
  }
  return (
    <ul className="list-disc pl-4 space-y-1 text-xs text-ink-700">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function CoalitionComparePage() {
  const [params] = useSearchParams();
  const [selected, setSelected] = useState<string[]>(() => parseInitial(params));

  const selectedParties = useMemo(
    () =>
      selected
        .map((id) => parties.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [selected],
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">Compare coalitions</h1>
        <p className="text-ink-700 max-w-2xl">
          Select two to four parties. Cells show published preferences, rule-outs and bottom
          lines — not forecasts or voting advice.
        </p>
        <p className="text-sm text-ink-600">
          Also see{" "}
          <Link to="/compare" className="underline text-fern-700">
            policies
          </Link>
          ,{" "}
          <Link to="/compare/tax" className="underline text-fern-700">
            taxes
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
        <legend className="sr-only">Select parties to compare coalitions</legend>
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
                <th className={COMPARE_STICKY_HEADER}>Topic</th>
                {selectedParties.map((party) => (
                  <th key={party.id} className={COMPARE_PARTY_COL}>
                    <Link
                      to={`/parties/${party.id}`}
                      className="inline-flex items-center gap-2 underline decoration-fern-500"
                    >
                      <PartyLogo partyId={party.id} size="sm" />
                      {party.abbreviation}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Stance", "stance"],
                  ["Prefers / open to", "prefers"],
                  ["Rules out", "rulesOut"],
                  ["Bottom lines", "bottomLines"],
                  ["Summary", "summary"],
                ] as const
              ).map(([label, key]) => (
                <tr key={key} className="border-t border-ink-900/10 align-top">
                  <th className={COMPARE_STICKY_BODY}>{label}</th>
                  {selectedParties.map((party) => {
                    const row = getPartyCoalition(party.id);
                    if (!row) {
                      return (
                        <td key={party.id} className="p-3 text-ink-500">
                          —
                        </td>
                      );
                    }
                    if (key === "stance") {
                      return (
                        <td key={party.id} className="p-3">
                          <CoalitionStanceBadge stance={row.stance} />
                        </td>
                      );
                    }
                    if (key === "summary") {
                      return (
                        <td key={party.id} className="p-3">
                          <p className="text-xs text-ink-700 mb-2">{row.summary}</p>
                          <CitationChips sourceIds={row.sourceIds} />
                        </td>
                      );
                    }
                    return (
                      <td key={party.id} className="p-3">
                        <CellList items={row[key]} />
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
