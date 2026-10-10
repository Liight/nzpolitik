/**
 * @file Layout.test.tsx
 * @description Mobile nav open/close behaviour
 * @onboarding
 * - Uses MemoryRouter + Routes so Outlet and NavLink work
 * - Dependencies: @testing-library/react, react-router-dom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Layout } from "./Layout";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>Home</p>} />
          <Route path="/parties" element={<p>Parties page</p>} />
          <Route path="/about" element={<p>About page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("Layout mobile menu", () => {
  it("toggles the mobile nav panel", () => {
    renderAt("/");

    expect(screen.queryByLabelText("Primary mobile")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByLabelText("Primary mobile")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.queryByLabelText("Primary mobile")).not.toBeInTheDocument();
  });

  it("closes the panel after navigating", () => {
    renderAt("/");

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    const mobileNav = screen.getByLabelText("Primary mobile");
    expect(mobileNav).toBeInTheDocument();

    // jsdom does not apply Tailwind `hidden`, so scope to the mobile panel
    fireEvent.click(
      mobileNav.querySelector('a[href="/about"]') as HTMLAnchorElement,
    );
    expect(screen.getByText("About page")).toBeInTheDocument();
    expect(screen.queryByLabelText("Primary mobile")).not.toBeInTheDocument();
  });
});
