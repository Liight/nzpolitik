/**
 * @file TaxDossier.tsx
 * @description Renders a party's tax and fiscal proposal cards
 * @onboarding
 * - Used on PartyDetailPage above general policies
 * - Always shows disclaimer about reported vs announced
 * - Dependencies: CitationChips, TaxStatusBadge
 */
import { CitationChips } from "./CitationChips";
import { TaxStatusBadge } from "./TaxStatusBadge";
import type { TaxRow } from "../lib/schema";

const instrumentLabel: Record<string, string> = {
  income_tax: "Income tax",
  capital_gains: "Capital gains",
  wealth_tax: "Wealth tax",
  land_tax: "Land tax",
  gst: "GST",
  company_tax: "Company tax",
  carbon_ets: "Carbon / ETS",
  kiwisaver_super: "KiwiSaver / super",
  other_levy: "Other levy / pledge",
};

export function TaxDossier({ rows }: { rows: TaxRow[] }) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold">Tax and fiscal proposals</h2>
        <p className="text-sm text-ink-700 max-w-3xl">
          Announced items come from party materials. Items marked{" "}
          <span className="font-semibold">reported</span> come from established NZ news
          (including leak coverage) and are not treated as official until announced.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <article
            key={row.id}
            className="rounded-xl border border-ink-900/10 bg-white/80 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-fern-700">
                  {instrumentLabel[row.instrument] ?? row.instrument}
                </p>
                <h3 className="font-semibold text-ink-950">{row.title}</h3>
              </div>
              <TaxStatusBadge status={row.status} />
            </div>
            <p className="text-sm text-ink-700">{row.summary}</p>
            <p className="text-xs text-ink-600 mt-2">
              <span className="font-semibold">Rate / threshold:</span> {row.rateOrThreshold}
            </p>
            <p className="text-xs text-ink-500 mt-1">Verified {row.lastVerified}</p>
            <CitationChips sourceIds={row.sourceIds} />
          </article>
        ))}
      </div>
    </section>
  );
}
