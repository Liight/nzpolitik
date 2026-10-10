/**
 * @file compare.ts
 * @description Helpers for selecting parties to compare (2-4)
 * @onboarding
 * - MIN_COMPARE=2, MAX_COMPARE=4
 * - Pure functions; unit tested
 * - Dependencies: none
 * @see src/pages/ComparePage.tsx for UI usage
 */

export const MIN_COMPARE = 2;
export const MAX_COMPARE = 4;

export function canAddParty(selected: readonly string[], partyId: string): boolean {
  if (selected.includes(partyId)) return false;
  return selected.length < MAX_COMPARE;
}

export function togglePartySelection(
  selected: readonly string[],
  partyId: string,
): string[] {
  if (selected.includes(partyId)) {
    return selected.filter((id) => id !== partyId);
  }
  if (!canAddParty(selected, partyId)) {
    return [...selected];
  }
  return [...selected, partyId];
}

export function isCompareReady(selected: readonly string[]): boolean {
  return selected.length >= MIN_COMPARE && selected.length <= MAX_COMPARE;
}

export function compareStatusMessage(selectedCount: number): string {
  if (selectedCount < MIN_COMPARE) {
    return `Select at least ${MIN_COMPARE} parties to compare.`;
  }
  if (selectedCount > MAX_COMPARE) {
    return `Select at most ${MAX_COMPARE} parties.`;
  }
  return `Comparing ${selectedCount} parties. Results below.`;
}
