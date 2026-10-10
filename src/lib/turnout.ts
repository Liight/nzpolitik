/**
 * @file turnout.ts
 * @description Pure helpers for civic turnout / effective-share maths
 * @onboarding
 * - Used by DemocracyPage worked example; keep arithmetic reviewable in tests
 * - Fractions are 0-1; percentages are 0-100
 * - Dependencies: none
 */

export type TurnoutExampleInput = {
  enrolled: number;
  nonVoters: number;
  /** Share of ballots cast won by a bloc (0-1). */
  blocShareOfVotesCast: number;
};

export type TurnoutExampleResult = {
  votesCast: number;
  turnoutRate: number;
  blocVotes: number;
  /** Bloc votes as a share of all enrolled electors (0-1). */
  blocShareOfEnrolled: number;
};

/**
 * Compute how a majority of votes cast can be a minority of enrolled electors.
 */
export function effectiveShareOfEnrolled(
  input: TurnoutExampleInput,
): TurnoutExampleResult {
  const { enrolled, nonVoters, blocShareOfVotesCast } = input;
  if (
    !Number.isFinite(enrolled) ||
    !Number.isFinite(nonVoters) ||
    !Number.isFinite(blocShareOfVotesCast) ||
    enrolled <= 0 ||
    nonVoters < 0 ||
    nonVoters >= enrolled ||
    blocShareOfVotesCast < 0 ||
    blocShareOfVotesCast > 1
  ) {
    throw new Error("Invalid turnout example inputs");
  }

  const votesCast = enrolled - nonVoters;
  const turnoutRate = votesCast / enrolled;
  const blocVotes = votesCast * blocShareOfVotesCast;
  const blocShareOfEnrolled = blocVotes / enrolled;

  return {
    votesCast,
    turnoutRate,
    blocVotes,
    blocShareOfEnrolled,
  };
}

/** Format a 0-1 fraction as a percentage string with no trailing .0 when whole. */
export function formatPercent(fraction: number, digits = 0): string {
  const value = fraction * 100;
  const fixed = value.toFixed(digits);
  return `${fixed.replace(/\.0+$/, "")}%`;
}
