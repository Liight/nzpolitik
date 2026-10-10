/**
 * @file Layout.tsx
 * @description Shared chrome: nav, footer, disclaimer strip
 * @onboarding
 * - Wraps all routes via App.tsx
 * - Brand wordmark is nzpolitik
 * - Below md: hamburger opens a full-width nav panel; closes on navigate / Escape / backdrop
 * - Dependencies: react-router-dom
 */
import { useEffect, useId, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { to: "/parties", label: "Parties" },
  { to: "/compare", label: "Compare" },
  { to: "/compare/tax", label: "Taxes" },
  { to: "/compare/coalition", label: "Coalitions" },
  { to: "/compare/track-record", label: "Record" },
  { to: "/democracy", label: "Democracy" },
  { to: "/about", label: "About / MMP" },
] as const;

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "px-3 py-2 text-sm font-semibold tracking-wide rounded-md transition-colors min-h-11 inline-flex items-center",
    isActive ? "bg-fern-600 text-white" : "text-ink-900 hover:bg-sand-100",
  ].join(" ");

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block w-full px-4 py-3 text-base font-semibold tracking-wide rounded-md transition-colors min-h-11",
    isActive ? "bg-fern-600 text-white" : "text-ink-900 hover:bg-sand-100",
  ].join(" ");

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const panelId = useId();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (target && headerRef.current && !headerRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <header
        ref={headerRef}
        className="border-b border-ink-900/10 bg-white/70 backdrop-blur sticky top-0 z-20 pt-[env(safe-area-inset-top)]"
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <NavLink
            to="/"
            className="font-display text-2xl font-bold text-ink-950 tracking-tight"
            onClick={() => setMenuOpen(false)}
          >
            nzpolitik
          </NavLink>

          <nav className="hidden md:flex flex-wrap gap-1" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center min-h-11 min-w-11 rounded-md border border-ink-900/15 bg-white/90 text-ink-950"
            aria-expanded={menuOpen}
            aria-controls={panelId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-5 bg-ink-950 transition-transform ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-ink-950 transition-opacity ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-ink-950 transition-transform ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {menuOpen && (
          <nav
            id={panelId}
            className="md:hidden border-t border-ink-900/10 bg-white/95 px-4 py-3"
            aria-label="Primary mobile"
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={mobileLinkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-ink-900/10 bg-ink-950 text-sand-50 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:py-6 text-sm space-y-2">
          <p className="font-display text-lg">nzpolitik</p>
          <p className="text-sand-100/80 max-w-3xl">
            Unofficial voter information. Not affiliated with the Electoral Commission.
            Always verify enrolment and voting details on{" "}
            <a className="underline decoration-fern-500" href="https://vote.nz/" target="_blank" rel="noreferrer">
              vote.nz
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
