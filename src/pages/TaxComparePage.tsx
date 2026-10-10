/**
 * @file TaxComparePage.tsx
 * @description Compare tax instruments across 2-4 selected parties
 * @onboarding
 * - Route: /compare/tax
 * - Uses same selection helpers as policy compare
 * - Dependencies: compare.ts, taxes data, TaxStatusBadge
 */
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CitationChips } from "../components/CitationChips";
import {
  COMPARE_PARTY_COL_WIDE,
  COMPARE_STICKY_BODY,
  COMPARE_STICKY_HEADER,
  CompareScroll,
} from "../components/CompareScroll";
import { PartyLogo } from "../components/PartyLogo";
import { TaxStatusBadge } from "../components/TaxStatusBadge";
import {
  MAX_COMPARE,
  compareStatusMessage,
  isCompareReady,
  togglePartySelection,
} from "../lib/compare";
import { getPartyTaxes, parties, taxesFile } from "../lib/data";
import type { TaxInstrument, TaxRow } from "../lib/schema";

const instrumentLabels: Record<TaxInstrument, string> = {
  income_tax: "Income tax",
  capital_gains: "Capital gains",
  wealth_tax: "Wealth tax",
  land_tax: "Land tax",
  gst: "GST",
  company_tax: "Company tax",
  carbon_ets: "Carbon / ETS",
  kiwisaver_super: "KiwiSaver / super",
  other_levy: "Other levy / pledge",
};

function parseInitial(params: URLSearchParams): string[] {
  const raw = params.get("parties");
  if (!raw) return [];
  const ids = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const valid = new Set(parties.map((p) => p.id));
  return ids.filter((id) => valid.has(id)).slice(0, MAX_COMPARE);
}

function bestRowForInstrument(
  rows: TaxRow[],
  instrument: TaxInstrument,
): TaxRow | undefined {
  const matches = rows.filter((r) => r.instrument === instrument);
  if (matches.length === 0) return undefined;
  const rank = (s: TaxRow["status"]) =>
    ({ announced: 0, reported: 1, denied: 2, withdrawn: 3, unknown: 4 })[s];
  return [...matches].sort((a, b) => rank(a.status) - rank(b.status))[0];
}

export function TaxComparePage() {
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
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">Compare taxes</h1>
        <p className="text-ink-700 max-w-2xl">
          Select two to four parties. Cells show the strongest-status proposal per instrument
          (announced preferred over reported). Not rankings or voting advice.
        </p>
        <p className="text-sm text-ink-600">
          Prefer the full{" "}
          <Link to="/compare" className="underline text-fern-700">
            policy compare
          </Link>{" "}
          for non-tax issues.
        </p>
        <p className="text-sm font-semibold text-fern-700" role="status">
          {compareStatusMessage(selected.length)}
        </p>
      </header>

      <fieldset>
        <legend className="sr-only">Select parties to compare taxes</legend>
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
        <p className="text-ink-700">Choose at least two parties to see the tax matrix.</p>
      )}

      {isCompareReady(selected) && (
        <CompareScroll>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-ink-950 text-sand-50">
                <th className={COMPARE_STICKY_HEADER}>Instrument</th>
                {selectedParties.map((party) => (
                  <th key={party.id} className={COMPARE_PARTY_COL_WIDE}>
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
              {taxesFile.instruments.map((instrument) => (
                <tr key={instrument} className="border-t border-ink-900/10 align-top">
                  <th className={COMPARE_STICKY_BODY}>
                    {instrumentLabels[instrument]}
                  </th>
                  {selected.map((partyId) => {
                    const row = bestRowForInstrument(
                      getPartyTaxes(partyId),
                      instrument,
                    );
                    if (!row) {
                      return (
                        <td key={partyId} className="p-3 text-ink-500">
                          No row
                        </td>
                      );
                    }
                    return (
                      <td key={partyId} className="p-3">
                        <TaxStatusBadge status={row.status} />
                        <p className="mt-2 font-semibold text-ink-950">{row.title}</p>
                        <p className="mt-1 text-ink-700">{row.summary}</p>
                        <p className="mt-1 text-xs text-ink-600">{row.rateOrThreshold}</p>
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
