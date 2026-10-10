/**
 * @file compare.test.ts
 * @description Unit tests for compare selection helpers
 * @onboarding
 * - Covers min/max selection rules
 * - Dependencies: vitest, compare.ts
 */
import { describe, expect, it } from "vitest";
import {
  MAX_COMPARE,
  MIN_COMPARE,
  canAddParty,
  compareStatusMessage,
  isCompareReady,
  togglePartySelection,
} from "./compare";

describe("togglePartySelection", () => {
  it("adds a party when under the max", () => {
    expect(togglePartySelection(["act"], "labour")).toEqual(["act", "labour"]);
  });

  it("removes a selected party", () => {
    expect(togglePartySelection(["act", "labour"], "act")).toEqual(["labour"]);
  });

  it("does not add beyond MAX_COMPARE", () => {
    const selected = ["act", "labour", "national", "green"];
    expect(selected.length).toBe(MAX_COMPARE);
    expect(togglePartySelection(selected, "alliance")).toEqual(selected);
  });
});

describe("canAddParty", () => {
  it("returns false for duplicates", () => {
    expect(canAddParty(["act"], "act")).toBe(false);
  });

  it("returns true when room remains", () => {
    expect(canAddParty(["act"], "labour")).toBe(true);
  });
});

describe("isCompareReady", () => {
  it("requires at least MIN_COMPARE parties", () => {
    expect(isCompareReady(["act"])).toBe(false);
    expect(isCompareReady(["act", "labour"])).toBe(true);
    expect(MIN_COMPARE).toBe(2);
  });
});

describe("compareStatusMessage", () => {
  it("guides the user when under-selected", () => {
    expect(compareStatusMessage(1)).toContain("at least");
  });

  it("confirms when ready and points below", () => {
    expect(compareStatusMessage(3)).toContain("Comparing 3");
    expect(compareStatusMessage(3)).toContain("Results below");
  });
});
