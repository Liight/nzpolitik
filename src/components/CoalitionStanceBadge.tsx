/**
 * @file CoalitionStanceBadge.tsx
 * @description Badge for coalition preference stance
 * @onboarding
 * - open / selective / ruling_out / unknown — not voting advice
 * - Dependencies: CoalitionStance type
 */
import type { CoalitionStance } from "../lib/schema";

const styles: Record<CoalitionStance, string> = {
  open: "bg-fern-700 text-white",
  selective: "bg-clay-600 text-white",
  ruling_out: "bg-ink-700 text-white",
  unknown: "bg-ink-900/15 text-ink-700",
};

const labels: Record<CoalitionStance, string> = {
  open: "open",
  selective: "selective",
  ruling_out: "ruling out",
  unknown: "unknown",
};

export function CoalitionStanceBadge({ stance }: { stance: CoalitionStance }) {
  return (
    <span
      className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 rounded ${styles[stance]}`}
    >
      {labels[stance]}
    </span>
  );
}
