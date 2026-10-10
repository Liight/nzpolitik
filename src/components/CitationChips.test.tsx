/**
 * @file CitationChips.test.tsx
 * @description Citation chips show usedFor labels, not bare Sxx alone
 * @onboarding
 * - Dependencies: @testing-library/react, CitationChips
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CitationChips, formatCitationLabel } from "./CitationChips";

describe("formatCitationLabel", () => {
  it("truncates long labels with an ellipsis", () => {
    const long = "A".repeat(60);
    expect(formatCitationLabel(long, 48).endsWith("…")).toBe(true);
    expect(formatCitationLabel(long, 48).length).toBe(48);
  });
});

describe("CitationChips", () => {
  it("renders usedFor text for S05, not only the id", () => {
    render(<CitationChips sourceIds={["S05"]} />);
    const link = screen.getByRole("link");
    expect(link).toHaveTextContent(/MMP/i);
    expect(link).not.toHaveTextContent(/^S05$/);
    expect(link).toHaveAttribute("aria-label", expect.stringContaining("S05"));
  });

  it("shows missing source when id is unknown", () => {
    render(<CitationChips sourceIds={["S9999"]} />);
    expect(screen.getByText("S9999 (missing source)")).toBeInTheDocument();
  });
});
