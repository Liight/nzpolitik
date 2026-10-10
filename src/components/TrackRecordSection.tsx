/**
 * @file TrackRecordSection.tsx
 * @description Party detail track-record list with window filter
 * @onboarding
 * - Empty state for parties without recent government track record
 * - Filter by term windows from trackRecordFile.windows (~2005-2026)
 * - Dependencies: trackRecordFile, CitationChips, TrackRecordStatusBadge
 */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CitationChips } from "./CitationChips";
import { TrackRecordStatusBadge } from "./TrackRecordStatusBadge";
import { policiesFile, trackRecordFile, type TrackRecordRow } from "../lib/data";
import type { TrackRecordWindowId } from "../lib/schema";

type WindowFilter = "all" | TrackRecordWindowId;

function issueLabel(issueId: string): string {
  return policiesFile.issues.find((i) => i.id === issueId)?.label ?? issueId;
}

export function TrackRecordSection({
  partyId,
  rows,
}: {
  partyId: string;
  rows: TrackRecordRow[];
}) {
  const [windowFilter, setWindowFilter] = useState<WindowFilter>("all");

  const filtered = useMemo(() => {
    if (windowFilter === "all") return rows;
    return rows.filter((r) => r.windowId === windowFilter);
  }, [rows, windowFilter]);

  if (rows.length === 0) {
    return (
      <section className="space-y-3 rounded-xl border border-ink-900/10 bg-white/80 p-5">
        <h2 className="font-display text-2xl font-bold">Track record</h2>
        <p className="text-sm text-ink-700">
          No government or support-partner track-record rows for this party in the available
          term windows (~2005-2026). They are contesting the 2026 party vote — see tax and
          policy sections below for current platforms.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link className="underline text-fern-700" to="/compare/tax">
            Compare taxes
          </Link>
          <Link className="underline text-fern-700" to={`/compare?parties=${partyId}`}>
            Compare policies
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold">Track record</h2>
        <p className="text-sm text-ink-700 max-w-3xl">
          Campaign pledges matched to outcomes with citations. Delivery depends on MMP
          coalitions and parliamentary numbers. Status labels describe evidence — not
          character judgements.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by government window">
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

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-ink-700">No rows in this window.</p>
        ) : (
          filtered.map((row) => (
            <article
              key={row.id}
              className="rounded-xl border border-ink-900/10 bg-white/80 p-4 shadow-sm space-y-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-fern-700">
                    {trackRecordFile.windows.find((w) => w.id === row.windowId)?.label ??
                      row.windowId}{" "}
                    · {issueLabel(row.issueId)} · {row.role}
                  </p>
                </div>
                <TrackRecordStatusBadge status={row.status} />
              </div>
              <div>
                <h3 className="font-semibold text-ink-950">Pledge</h3>
                <p className="text-sm text-ink-700">{row.pledge}</p>
              </div>
              <div>
                <h3 className="font-semibold text-ink-950">Outcome</h3>
                <p className="text-sm text-ink-700">{row.outcome}</p>
              </div>
              <p className="text-xs text-ink-500">Verified {row.lastVerified}</p>
              <CitationChips sourceIds={row.sourceIds} />
            </article>
          ))
        )}
      </div>
    </section>
  );
}
