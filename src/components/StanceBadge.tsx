/**
 * @file StanceBadge.tsx
 * @description Colour-coded stance label for policy rows
 * @onboarding
 * - stances: supports | opposes | mixed | unknown
 * - Dependencies: none
 */
import type { Stance } from "../lib/schema";

const styles: Record<Stance, string> = {
  supports: "bg-fern-700 text-white",
  opposes: "bg-clay-600 text-white",
  mixed: "bg-ink-700 text-white",
  unknown: "bg-ink-900/15 text-ink-700",
};

export function StanceBadge({ stance }: { stance: Stance }) {
  return (
    <span className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 rounded ${styles[stance]}`}>
      {stance}
    </span>
  );
}
