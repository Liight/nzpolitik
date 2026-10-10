/**
 * @file TaxStatusBadge.tsx
 * @description Badge for tax proposal status (announced/reported/etc.)
 * @onboarding
 * - reported = news/leak coverage, not official confirmation
 * - Dependencies: TaxStatus type
 */
import type { TaxStatus } from "../lib/schema";

const styles: Record<TaxStatus, string> = {
  announced: "bg-fern-700 text-white",
  reported: "bg-clay-600 text-white",
  denied: "bg-ink-700 text-white",
  withdrawn: "bg-ink-900/40 text-white",
  unknown: "bg-ink-900/15 text-ink-700",
};

export function TaxStatusBadge({ status }: { status: TaxStatus }) {
  return (
    <span
      className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 rounded ${styles[status]}`}
    >
      {status}
    </span>
  );
}
