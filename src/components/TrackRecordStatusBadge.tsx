/**
 * @file TrackRecordStatusBadge.tsx
 * @description Badge for campaign-vs-delivery status labels
 * @onboarding
 * - Status enum only — never use lie/betrayal language in UI copy
 * - Pattern mirrors TaxStatusBadge
 * - Dependencies: TrackRecordStatus type
 */
import type { TrackRecordStatus } from "../lib/schema";

const styles: Record<TrackRecordStatus, string> = {
  delivered: "bg-fern-700 text-white",
  partial: "bg-clay-600 text-white",
  not_delivered: "bg-ink-700 text-white",
  blocked_coalition: "bg-ink-900 text-white",
  superseded: "bg-ink-900/40 text-white",
  ongoing: "bg-fern-600 text-white",
  unknown: "bg-ink-900/15 text-ink-700",
};

const labels: Record<TrackRecordStatus, string> = {
  delivered: "delivered",
  partial: "partial",
  not_delivered: "not delivered",
  blocked_coalition: "blocked (coalition)",
  superseded: "superseded",
  ongoing: "ongoing",
  unknown: "unknown",
};

export function TrackRecordStatusBadge({ status }: { status: TrackRecordStatus }) {
  return (
    <span
      className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 rounded ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
