/**
 * @file turnout.test.ts
 * @description Unit tests for civic turnout maths
 * @onboarding
 * - Locks the 30% non-vote / 51% of ballots worked example
 * - Dependencies: vitest, turnout.ts
 */
import { describe, expect, it } from "vitest";
import { effectiveShareOfEnrolled, formatPercent } from "./turnout";

describe("effectiveShareOfEnrolled", () => {
  it("shows 51% of votes cast is 35.7% of enrolled when 30% do not vote", () => {
    const result = effectiveShareOfEnrolled({
      enrolled: 100,
      nonVoters: 30,
      blocShareOfVotesCast: 0.51,
    });
    expect(result.votesCast).toBe(70);
    expect(result.turnoutRate).toBeCloseTo(0.7);
    expect(result.blocVotes).toBeCloseTo(35.7);
    expect(result.blocShareOfEnrolled).toBeCloseTo(0.357);
  });

  it("rejects invalid inputs", () => {
    expect(() =>
      effectiveShareOfEnrolled({
        enrolled: 0,
        nonVoters: 0,
        blocShareOfVotesCast: 0.5,
      }),
    ).toThrow(/Invalid/);
    expect(() =>
      effectiveShareOfEnrolled({
        enrolled: 100,
        nonVoters: 100,
        blocShareOfVotesCast: 0.5,
      }),
    ).toThrow(/Invalid/);
  });
});

describe("formatPercent", () => {
  it("formats whole and fractional percentages", () => {
    expect(formatPercent(0.51)).toBe("51%");
    expect(formatPercent(0.357, 1)).toBe("35.7%");
  });
});
