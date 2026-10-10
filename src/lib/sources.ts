/**
 * @file sources.ts
 * @description Lookup helpers for citation IDs
 * @onboarding
 * - sources.json is generated from notes/sources.md
 * - Missing IDs return null; UI should still show the ID
 * - Dependencies: src/data/sources.json
 * @see notes/sources.md for the access log
 */
import sources from "../data/sources.json";

export type SourceRecord = {
  id: string;
  url: string;
  accessed: string;
  usedFor: string;
};

const sourceMap = sources as Record<string, SourceRecord>;

export function getSource(id: string): SourceRecord | null {
  return sourceMap[id] ?? null;
}

export function getSourceUrl(id: string): string | null {
  return sourceMap[id]?.url ?? null;
}

export function listSourceIds(): string[] {
  return Object.keys(sourceMap);
}
