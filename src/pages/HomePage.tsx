/**
 * @file HomePage.tsx
 * @description Landing composition: brand, purpose, CTAs, election date
 * @onboarding
 * - Hero is one composition — brand first
 * - Dependencies: react-router-dom, election data
 */
import { Link } from "react-router-dom";
import { election } from "../lib/data";

function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function HomePage() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink-950 text-sand-50 shadow-xl">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(42,122,88,0.55), transparent 40%), radial-gradient(circle at 80% 10%, rgba(201,101,53,0.35), transparent 35%), linear-gradient(135deg, #0f1c24, #152833 60%, #1f5c45)",
        }}
        aria-hidden
      />
      <div className="relative px-6 py-16 md:px-12 md:py-24 max-w-3xl">
        <p className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-[fadeUp_0.7s_ease]">
          nzpolitik
        </p>
        <h1 className="text-xl md:text-2xl font-medium text-sand-100 mb-4 max-w-xl">
          Research and compare New Zealand political parties for the 2026 general election.
        </h1>
        <p className="text-sand-100/80 mb-8">
          Election day: {formatDate(election.electionDay)}. Advance voting from{" "}
          {formatDate(election.advanceVotingStart)}.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/parties"
            className="inline-flex items-center justify-center rounded-md bg-fern-500 px-5 py-3 font-semibold text-ink-950 hover:bg-fern-600 transition-colors"
          >
            Browse parties
          </Link>
          <Link
            to="/compare"
            className="inline-flex items-center justify-center rounded-md border border-sand-100/40 px-5 py-3 font-semibold text-sand-50 hover:bg-white/10 transition-colors"
          >
            Compare parties
          </Link>
          <Link
            to="/democracy"
            className="inline-flex items-center justify-center rounded-md border border-sand-100/40 px-5 py-3 font-semibold text-sand-50 hover:bg-white/10 transition-colors"
          >
            Why vote
          </Link>
        </div>
        <p className="mt-10 text-sm text-sand-100/70 max-w-xl">
          Short, cited summaries — not voting advice. Confirm details on party sites and vote.nz.
        </p>
      </div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
