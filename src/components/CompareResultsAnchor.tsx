/**
 * @file CompareResultsAnchor.tsx
 * @description Mobile cue + scroll-into-view when compare results become ready
 * @onboarding
 * - Place Cue after party picker; wrap matrix in Anchor
 * - Auto-scrolls once when ready flips true; View results button for manual scroll
 * - Cue is md:hidden (desktop can see matrix without it)
 * - Dependencies: react
 */
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";

export function CompareResultsCue({
  ready,
  resultsId,
  onViewResults,
}: {
  ready: boolean;
  resultsId: string;
  onViewResults: () => void;
}) {
  if (!ready) return null;

  return (
    <div
      className="md:hidden rounded-lg border border-fern-700/30 bg-fern-50 px-3 py-3 space-y-2"
      role="status"
    >
      <p className="text-sm font-semibold text-ink-900">
        Results ready — scroll down to see the comparison.
      </p>
      <button
        type="button"
        onClick={onViewResults}
        className="min-h-11 w-full sm:w-auto rounded-md bg-fern-700 px-4 py-2.5 text-sm font-semibold text-white"
        aria-controls={resultsId}
      >
        View results
      </button>
    </div>
  );
}

export function CompareResultsAnchor({
  ready,
  children,
}: {
  ready: boolean;
  children: ReactNode;
}) {
  const resultsId = useId();
  const anchorRef = useRef<HTMLDivElement>(null);
  const wasReady = useRef(false);

  const scrollToResults = useCallback(() => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (ready && !wasReady.current) {
      wasReady.current = true;
      // Defer so the results DOM is painted before scrolling
      const t = window.setTimeout(() => scrollToResults(), 50);
      return () => window.clearTimeout(t);
    }
    if (!ready) {
      wasReady.current = false;
    }
  }, [ready, scrollToResults]);

  return (
    <div className="space-y-4">
      <CompareResultsCue
        ready={ready}
        resultsId={resultsId}
        onViewResults={scrollToResults}
      />
      <div ref={anchorRef} id={resultsId}>
        {children}
      </div>
    </div>
  );
}
