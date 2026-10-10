/**
 * @file DemocracyPage.tsx
 * @description Why vote, voting myths, NZ democratic history (cited, non-prescriptive)
 * @onboarding
 * - Route: /democracy
 * - Content from civic.json; turnout maths via turnout.ts
 * - Myths sit between why-vote and history; link About for threshold
 * - Dependencies: civic data, CitationChips, election links
 */
import { Link } from "react-router-dom";
import { CitationChips } from "../components/CitationChips";
import { civicFile, election } from "../lib/data";
import { effectiveShareOfEnrolled, formatPercent } from "../lib/turnout";

export function DemocracyPage() {
  const example = effectiveShareOfEnrolled(civicFile.turnoutExample);

  return (
    <div className="space-y-8 max-w-3xl">
      <header className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">
          Democracy & why vote
        </h1>
        <p className="text-ink-700">
          How New Zealand&apos;s voting system grew, and why turnout maths matters — without telling
          you who to vote for.
        </p>
      </header>

      <section className="space-y-4" aria-labelledby="why-vote-heading">
        <h2
          id="why-vote-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-ink-950"
        >
          Why vote
        </h2>
        <p className="text-ink-700 text-sm sm:text-base">
          Voting is one way citizens influence who sits in Parliament. Skipping it does not pause
          government.
        </p>

        <ul className="space-y-4">
          {civicFile.whyVote.map((block) => (
            <li
              key={block.id}
              className="rounded-xl border border-ink-900/10 bg-white/80 p-4 sm:p-5 space-y-2"
            >
              <h3 className="font-display text-xl font-bold text-ink-950">{block.title}</h3>
              <p className="text-ink-700 text-sm sm:text-base">{block.body}</p>
              {block.id === "turnout-maths" && (
                <div className="rounded-lg bg-sand-50 border border-ink-900/10 p-3 text-sm text-ink-800 space-y-1">
                  <p className="font-semibold">Worked numbers (illustrative)</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Enrolled: {civicFile.turnoutExample.enrolled}; not voting:{" "}
                      {civicFile.turnoutExample.nonVoters} (
                      {formatPercent(
                        civicFile.turnoutExample.nonVoters /
                          civicFile.turnoutExample.enrolled,
                      )}
                      )
                    </li>
                    <li>Votes counted: {example.votesCast}</li>
                    <li>
                      Bloc wins {formatPercent(civicFile.turnoutExample.blocShareOfVotesCast)} of
                      votes cast ({example.blocVotes.toFixed(1)} ballots)
                    </li>
                    <li>
                      Same bloc is only {formatPercent(example.blocShareOfEnrolled, 1)} of all
                      enrolled electors
                    </li>
                  </ul>
                  <p className="text-xs text-ink-600">
                    {civicFile.turnoutExample.explanation}
                  </p>
                </div>
              )}
              <CitationChips sourceIds={block.sourceIds} />
            </li>
          ))}
        </ul>

        <div className="rounded-xl border border-ink-900/10 bg-white/80 p-4 sm:p-5 space-y-3">
          <h3 className="font-display text-xl font-bold text-ink-950">Enrol and vote (official)</h3>
          <ul className="list-disc pl-5 space-y-2 text-ink-800 text-sm sm:text-base">
            <li>
              <a
                className="underline text-fern-700"
                href={election.links.enrol}
                target="_blank"
                rel="noreferrer"
              >
                Enrol / update enrolment (vote.nz)
              </a>
            </li>
            <li>
              <a
                className="underline text-fern-700"
                href={election.links.keyDates}
                target="_blank"
                rel="noreferrer"
              >
                2026 key dates
              </a>
            </li>
            <li>
              <a
                className="underline text-fern-700"
                href={election.links.mmpHelp}
                target="_blank"
                rel="noreferrer"
              >
                How MMP works (Electoral Commission)
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="myths-heading">
        <h2
          id="myths-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-ink-950"
        >
          Voting myths
        </h2>
        <p className="text-ink-700 text-sm sm:text-base">
          Common New Zealand voting claims, answered with how MMP actually works — system literacy,
          not campaign advice. For the 5% threshold detail, see{" "}
          <Link to="/about" className="underline text-fern-700">
            About &amp; MMP
          </Link>
          .
        </p>
        <ul className="space-y-4">
          {civicFile.myths.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-ink-900/10 bg-white/80 p-4 sm:p-5 space-y-2"
            >
              <h3 className="font-display text-lg sm:text-xl font-bold text-ink-950">
                Myth: {item.myth}
              </h3>
              <p className="text-ink-700 text-sm sm:text-base">{item.response}</p>
              <CitationChips sourceIds={item.sourceIds} />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4" aria-labelledby="history-heading">
        <h2
          id="history-heading"
          className="font-display text-2xl sm:text-3xl font-bold text-ink-950"
        >
          NZ democratic history
        </h2>
        <p className="text-ink-700 text-sm sm:text-base">
          A short timeline of franchise expansions and voting-system change. For today&apos;s 5%
          threshold and two votes, see{" "}
          <Link to="/about" className="underline text-fern-700">
            About &amp; MMP
          </Link>
          .
        </p>

        <ol className="space-y-4">
          {civicFile.history.map((event) => (
            <li
              key={`${event.year}-${event.title}`}
              className="rounded-xl border border-ink-900/10 bg-white/80 p-4 sm:p-5 space-y-2"
            >
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-fern-700 uppercase">
                {event.year}
              </p>
              <h3 className="font-display text-xl font-bold text-ink-950">{event.title}</h3>
              <p className="text-ink-700 text-sm sm:text-base">{event.summary}</p>
              <CitationChips sourceIds={event.sourceIds} />
            </li>
          ))}
        </ol>
      </section>

      <p className="text-sm text-ink-600">
        Last verified {civicFile.lastVerified}. Compare parties on the{" "}
        <Link to="/parties" className="underline text-fern-700">
          Parties
        </Link>{" "}
        page when you are ready to look at platforms.
      </p>
    </div>
  );
}
