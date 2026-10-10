/**
 * @file PartiesPage.tsx
 * @description Filterable directory of all party-vote parties
 * @onboarding
 * - Search filters name/abbreviation/leaders
 * - PartyLogo + thin primaryHex accent (not full party theming)
 * - Dependencies: parties data, branding, react-router-dom
 */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PartyLogo } from "../components/PartyLogo";
import { getPartyBranding, getPartyViability, parties } from "../lib/data";

export function PartiesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parties;
    return parties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.abbreviation.toLowerCase().includes(q) ||
        p.leaders.some((l) => l.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">Parties</h1>
        <p className="text-ink-700 max-w-2xl">
          All {parties.length} parties that lodged an accepted party list for the 2026 party vote.
        </p>
      </header>

      <label className="block max-w-md">
        <span className="sr-only">Filter parties</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, abbreviation, or leader"
          className="w-full rounded-md border border-ink-900/15 bg-white/80 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-fern-500"
        />
      </label>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((party) => {
          const branding = getPartyBranding(party.id);
          const viability = getPartyViability(party.id);
          return (
          <li key={party.id}>
            <Link
              to={`/parties/${party.id}`}
              className="block h-full rounded-xl border border-ink-900/10 bg-white/80 p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all overflow-hidden"
              style={
                branding
                  ? { borderTopWidth: 3, borderTopColor: branding.primaryHex }
                  : undefined
              }
            >
              <div className="flex items-start gap-3 mb-2">
                <PartyLogo partyId={party.id} size="md" />
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-fern-700 mb-1">
                    {party.abbreviation}
                  </p>
                  <h2 className="font-display text-xl font-semibold text-ink-950">
                    {party.name}
                  </h2>
                </div>
              </div>
              <p className="text-sm text-ink-700 line-clamp-3">{party.summary}</p>
              {viability && (
                <p className="mt-2 text-xs text-ink-500 line-clamp-2">
                  MMP: {viability.electorateStrategy.replace(/_/g, " ")} · list{" "}
                  {viability.listLength}
                </p>
              )}
              <p className="mt-3 text-xs text-ink-500">
                Leaders: {party.leaders.join(", ")}
              </p>
            </Link>
          </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <p className="text-ink-700">No parties match that filter.</p>
      )}
    </div>
  );
}
