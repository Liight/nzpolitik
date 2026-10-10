/**
 * @file CompareScroll.tsx
 * @description Horizontal scroll chrome for compare matrices on small screens
 * @onboarding
 * - Wrap compare tables; shows a swipe hint below md
 * - Export sticky / column width class helpers for table cells
 * - Dependencies: none
 */
import type { ReactNode } from "react";

export const COMPARE_STICKY_HEADER =
  "text-left p-3 sticky left-0 z-20 bg-ink-950";
export const COMPARE_STICKY_BODY =
  "text-left p-3 font-semibold sticky left-0 z-10 bg-sand-50";
export const COMPARE_PARTY_COL =
  "text-left p-3 min-w-[180px] md:min-w-[220px]";
export const COMPARE_PARTY_COL_WIDE =
  "text-left p-3 min-w-[180px] md:min-w-[240px]";

type CompareScrollProps = {
  children: ReactNode;
};

export function CompareScroll({ children }: CompareScrollProps) {
  return (
    <div className="space-y-2">
      <p className="md:hidden text-xs text-ink-600" aria-hidden="true">
        Swipe sideways to see more parties
      </p>
      <div className="compare-scroll overflow-x-auto rounded-xl border border-ink-900/10 bg-white/90 shadow-sm">
        {children}
      </div>
    </div>
  );
}
