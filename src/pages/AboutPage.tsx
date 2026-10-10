/**
 * @file AboutPage.tsx
 * @description MMP explainer + official voting links + editorial disclaimer
 * @onboarding
 * - Does not reinvent official guidance — links to vote.nz
 * - Dependencies: election data, CitationChips
 */
import { Link } from "react-router-dom";
import { CitationChips } from "../components/CitationChips";
import { election } from "../lib/data";

export function AboutPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <header className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">About & how MMP works</h1>
        <p className="text-ink-700">
          nzpolitik helps you review and compare parties contesting the party vote. It does not tell
          you how to vote.
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-ink-900/10 bg-white/80 p-5">
        <h2 className="font-display text-2xl font-bold">Two votes</h2>
        <p className="text-ink-700">{election.mmpSummary}</p>
        <p className="text-ink-700 text-sm">
          For turnout maths, why voting matters, and a short NZ democratic history, see{" "}
          <Link to="/democracy" className="underline text-fern-700">
            Democracy &amp; why vote
          </Link>
          .
        </p>
        <CitationChips sourceIds={election.sourceIds} />
      </section>

      <section className="space-y-3 rounded-xl border border-ink-900/10 bg-white/80 p-5">
        <h2 className="font-display text-2xl font-bold">5% threshold and electorate seats</h2>
        <ul className="list-disc pl-5 space-y-2 text-ink-800">
          <li>
            Under MMP, a party usually needs about 5% of the nationwide party vote{" "}
            <span className="font-semibold">or</span> to win an electorate seat to get a share of
            list seats.
          </li>
          <li>
            A party vote for a party that ends below 5% and wins no electorate may not elect list
            MPs — that is how the threshold works, not advice against any particular party.
          </li>
          <li>
            Some parties run short lists and focus on electorates; others contest mainly via the
            party vote. See each party page for a short MMP context note.
          </li>
          <li>
            Overhang seats and full seat allocation details are explained on official{" "}
            <a className="underline text-fern-700" href={election.links.mmpHelp} target="_blank" rel="noreferrer">
              vote.nz / Electoral Commission guidance
            </a>
            .
          </li>
        </ul>
        <CitationChips sourceIds={["S05", "S138"]} />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">Official links</h2>
        <ul className="list-disc pl-5 space-y-2 text-ink-800">
          <li>
            <a className="underline text-fern-700" href={election.links.enrol} target="_blank" rel="noreferrer">
              Enrol / vote.nz
            </a>
          </li>
          <li>
            <a className="underline text-fern-700" href={election.links.keyDates} target="_blank" rel="noreferrer">
              Key dates (Electoral Commission)
            </a>
          </li>
          <li>
            <a className="underline text-fern-700" href={election.links.partyListsPdf} target="_blank" rel="noreferrer">
              Official party lists PDF
            </a>
          </li>
          <li>
            <a className="underline text-fern-700" href={election.links.mmpHelp} target="_blank" rel="noreferrer">
              How our electoral system works
            </a>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">Editorial rules</h2>
        <ul className="list-disc pl-5 space-y-2 text-ink-800">
          <li>Every policy summary carries citation IDs linking to primary sources.</li>
          <li>If we cannot find a clear position, we mark it unknown — we do not invent stances.</li>
          <li>Party list membership is transcribed from the Electoral Commission PDF.</li>
          <li>This site is unofficial and may lag party updates; refresh sources before relying on it.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">Tax source rules</h2>
        <ul className="list-disc pl-5 space-y-2 text-ink-800">
          <li>
            <span className="font-semibold">Announced</span> tax items come from party websites or
            official policy PDFs.
          </li>
          <li>
            <span className="font-semibold">Reported</span> items come from established NZ news
            (including leak coverage). They are not treated as official until announced.
          </li>
          <li>
            Status values can also be denied, withdrawn, or unknown when a search found no clear
            proposal.
          </li>
          <li>
            Compare taxes on the{" "}
            <Link className="underline text-fern-700" to="/compare/tax">
              Taxes
            </Link>{" "}
            page.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">Party logos</h2>
        <ul className="list-disc pl-5 space-y-2 text-ink-800">
          <li>
            Logos are stored locally for identification. Prefer Electoral Commission registered
            (ballot) logos; party websites or monograms are used when a logo is not registered.
          </li>
          <li>
            Party logos and names are trademarks of their respective parties. Display here is for
            voter identification on this unofficial, non-commercial research site — not endorsement.
          </li>
          <li>
            Site chrome stays fern/ink; party colours appear only as thin accents or monogram
            backgrounds, not full page themes.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">Coalition data rules</h2>
        <ul className="list-disc pl-5 space-y-2 text-ink-800">
          <li>
            Coalition preferences and bottom lines come from published party statements, interviews,
            or signed coalition agreements — not invented deal maths.
          </li>
          <li>
            Stance labels are open, selective, ruling out, or unknown. Unknown means we found no
            clear published preference.
          </li>
          <li>
            Compare coalitions on the{" "}
            <Link className="underline text-fern-700" to="/compare/coalition">
              Coalitions
            </Link>{" "}
            page. This is context for MMP governments, not advice on who to vote for.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold">Track record rules</h2>
        <ul className="list-disc pl-5 space-y-2 text-ink-800">
          <li>
            Rows cover five term windows from ~2005–2026 (Labour-led 2005–2008 and 2020–2023;
            National-led 2008–2017; Labour–NZ First–Greens 2017–2020; National–ACT–NZ First
            2023–2026). Parties without in-window government or support roles show an empty state.
          </li>
          <li>
            Every row needs a campaign/pledge source and an outcome source (legislation, Budget,
            Beehive/Hansard, or established NZ news).
          </li>
          <li>
            Status labels are evidence tags (delivered, partial, not delivered, blocked by
            coalition, superseded, ongoing, unknown) — not accusations.
          </li>
          <li>
            MMP coalitions constrain delivery; blocked-by-coalition is used when partner veto is
            evidenced, not when a party simply lost a vote it never controlled.
          </li>
        </ul>
      </section>
    </div>
  );
}
