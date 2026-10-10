/**
 * @file TrackRecordComparePage.tsx
 * @description Cross-party track-record matrix for the six parliamentary parties
 * @onboarding
 * - Route: /compare/track-record
 * - Only TRACK_RECORD_PARTY_IDS are selectable
 * - Window filter derived from trackRecordFile.windows (~2005-2026)
 * - Dependencies: track-record data, TrackRecordStatusBadge, compare.ts
 */
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CitationChips } from "../components/CitationChips";
import { CompareResultsAnchor } from "../components/CompareResultsAnchor";
import {
  COMPARE_PARTY_COL_WIDE,
  COMPARE_STICKY_BODY,
  COMPARE_STICKY_HEADER,
  CompareScroll,
} from "../components/CompareScroll";
import { PartyLogo } from "../components/PartyLogo";
import { TrackRecordStatusBadge } from "../components/TrackRecordStatusBadge";
import {
  MAX_COMPARE,
  compareStatusMessage,
  isCompareReady,
  togglePartySelection,
} from "../lib/compare";
import {
  getParty,
  getPartyTrackRecord,
  policiesFile,
  trackRecordFile,
} from "../lib/data";
import {
  TRACK_RECORD_PARTY_IDS,
  type TrackRecordRow,
  type TrackRecordWindowId,
} from "../lib/schema";

type WindowFilter = "all" | TrackRecordWindowId;

function parseInitial(params: URLSearchParams): string[] {
  const raw = params.get("parties");
  if (!raw) return [];
  const valid = new Set<string>(TRACK_RECORD_PARTY_IDS);
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((id) => valid.has(id))
    .slice(0, MAX_COMPARE);
}

function issueLabel(issueId: string): string {
  return policiesFile.issues.find((i) => i.id === issueId)?.label ?? issueId;
}

function bestRow(
  rows: TrackRecordRow[],
  issueId: string,
  windowFilter: WindowFilter,
): TrackRecordRow | undefined {
  const filtered = rows.filter(
    (r) =>
      r.issueId === issueId &&
      (windowFilter === "all" || r.windowId === windowFilter),
  );
  return filtered[0];
}

export function TrackRecordComparePage() {
  const [params] = useSearchParams();
  const [selected, setSelected] = useState<string[]>(() => parseInitial(params));
  const [windowFilter, setWindowFilter] = useState<WindowFilter>("all");
  const ready = isCompareReady(selected);

  const selectable = useMemo(
    () =>
      TRACK_RECORD_PARTY_IDS.map((id) => getParty(id)).filter(
        (p): p is NonNullable<typeof p> => Boolean(p),
      ),
    [],
  );

  const selectedParties = useMemo(
    () =>
      selected
        .map((id) => getParty(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [selected],
  );

  const issueIds = useMemo(() => {
    const set = new Set<string>();
    for (const id of selected) {
      for (const row of getPartyTrackRecord(id)) {
        if (windowFilter === "all" || row.windowId === windowFilter) {
          set.add(row.issueId);
        }
      }
    }
    return policiesFile.issues.map((i) => i.id).filter((id) => set.has(id));
  }, [selected, windowFilter]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">
          Compare track records
        </h1>
        <p className="text-ink-700 max-w-2xl">
          Campaign pledges vs outcomes across term windows from ~2005–2026 for parties with
          parliamentary power or support roles. Status labels are evidence tags — not character
          judgements. Delivery depends on MMP coalitions.
        </p>
        <p className="text-sm text-ink-600">
          Other parties have no government track-record rows — see their{" "}
          <Link to="/parties" className="underline text-fern-700">
            party pages
          </Link>
          .
        </p>
        <p className="text-sm font-semibold text-fern-700" role="status">
          {compareStatusMessage(selected.length)}
        </p>
      </header>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by window">
        {(
          [
            ["all", "All windows"],
            ...trackRecordFile.windows.map((w) => [w.id, w.label] as const),
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setWindowFilter(id as WindowFilter)}
            className={`rounded-md px-3 py-2.5 min-h-11 text-xs sm:text-sm font-semibold border ${
              windowFilter === id
                ? "bg-fern-700 text-white border-fern-700"
                : "bg-white/80 border-ink-900/20 text-ink-800 hover:bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <fieldset>
        <legend className="sr-only">Select parties with track records</legend>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {selectable.map((party) => {
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

      <CompareResultsAnchor ready={ready}>
        {!ready && (
          <p className="text-ink-700">Choose at least two parties to see the matrix.</p>
        )}
        {ready && (
          <CompareScroll>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-ink-950 text-sand-50">
                  <th className={COMPARE_STICKY_HEADER}>Issue</th>
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
                {issueIds.length === 0 ? (
                  <tr>
                    <td
                      className="p-3 text-ink-700"
                      colSpan={selectedParties.length + 1}
                    >
                      No rows in this window for the selected parties.
                    </td>
                  </tr>
                ) : (
                  issueIds.map((issueId) => (
                    <tr key={issueId} className="border-t border-ink-900/10 align-top">
                      <th className={COMPARE_STICKY_BODY}>{issueLabel(issueId)}</th>
                      {selectedParties.map((party) => {
                        const row = bestRow(
                          getPartyTrackRecord(party.id),
                          issueId,
                          windowFilter,
                        );
                        if (!row) {
                          return (
                            <td key={party.id} className="p-3 text-ink-500 text-xs">
                              No row
                            </td>
                          );
                        }
                        return (
                          <td key={party.id} className="p-3 space-y-2">
                            <TrackRecordStatusBadge status={row.status} />
                            <p className="text-xs text-ink-700">
                              <span className="font-semibold">Pledge:</span> {row.pledge}
                            </p>
                            <p className="text-xs text-ink-700">
                              <span className="font-semibold">Outcome:</span> {row.outcome}
                            </p>
                            <CitationChips sourceIds={row.sourceIds} />
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CompareScroll>
        )}
      </CompareResultsAnchor>
    </div>
  );
}
