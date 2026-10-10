/**
 * @file CoalitionSection.tsx
 * @description Party detail coalition preferences / red lines
 * @onboarding
 * - Non-prescriptive; unknown when unpublished
 * - Dependencies: CitationChips, CoalitionStanceBadge
 */
import { Link } from "react-router-dom";
import { CitationChips } from "./CitationChips";
import { CoalitionStanceBadge } from "./CoalitionStanceBadge";
import type { CoalitionRow } from "../lib/schema";

function BulletList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return (
      <div>
        <h3 className="font-semibold text-ink-950">{title}</h3>
        <p className="text-sm text-ink-500">None published in sources checked.</p>
      </div>
    );
  }
  return (
    <div>
      <h3 className="font-semibold text-ink-950">{title}</h3>
      <ul className="list-disc pl-5 text-sm text-ink-700 space-y-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function CoalitionSection({
  partyId,
  row,
}: {
  partyId: string;
  row: CoalitionRow | undefined;
}) {
  if (!row) return null;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl font-bold">Coalition & red lines</h2>
          <p className="text-sm text-ink-700 max-w-3xl">
            Published preferences and deal-breakers under MMP. This is not a prediction of who
            will form government.
          </p>
        </div>
        <CoalitionStanceBadge stance={row.stance} />
      </div>
      <p className="text-ink-800">{row.summary}</p>
      <div className="grid gap-4 md:grid-cols-3">
        <BulletList title="Prefers / open to" items={row.prefers} />
        <BulletList title="Rules out" items={row.rulesOut} />
        <BulletList title="Bottom lines" items={row.bottomLines} />
      </div>
      <p className="text-xs text-ink-500">Verified {row.lastVerified}</p>
      <CitationChips sourceIds={row.sourceIds} />
      <p className="text-sm">
        <Link className="underline text-fern-700" to={`/compare/coalition?parties=${partyId}`}>
          Compare coalition positions
        </Link>
      </p>
    </section>
  );
}
