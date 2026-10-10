/**
 * @file CitationChips.tsx
 * @description Renders human-readable source chips linking to primary URLs
 * @onboarding
 * - Visible label is sources.json usedFor (not bare Sxx)
 * - title/aria-label keep "{id}: {usedFor}" for researchers
 * - Missing URL shows "{id} (missing source)" as non-link text
 * - Dependencies: sources.ts
 */
import { getSource } from "../lib/sources";

const LABEL_MAX = 48;

export function formatCitationLabel(usedFor: string, maxLen = LABEL_MAX): string {
  const trimmed = usedFor.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen - 1).trimEnd()}…`;
}

export function CitationChips({ sourceIds }: { sourceIds: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2 mt-2" aria-label="Sources">
      {sourceIds.map((id) => {
        const source = getSource(id);
        if (!source) {
          return (
            <li
              key={id}
              className="text-xs sm:text-sm px-2 py-2 min-h-9 inline-flex items-center rounded bg-ink-900/10 text-ink-700"
            >
              {id} (missing source)
            </li>
          );
        }
        const label = formatCitationLabel(source.usedFor);
        const full = `${id}: ${source.usedFor}`;
        return (
          <li key={id}>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs sm:text-sm px-2 py-2 min-h-9 inline-flex items-center rounded bg-fern-700/10 text-fern-700 hover:bg-fern-700/20 font-semibold max-w-full"
              title={full}
              aria-label={full}
            >
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
