/**
 * @file App.tsx
 * @description Route table for nzpolitik
 * @onboarding
 * - Routes: /, /parties, /parties/:partyId, /compare, /compare/tax, /compare/coalition, /compare/track-record, /democracy, /about
 * - Dependencies: react-router-dom, Layout, pages
 * @see src/main.tsx for BrowserRouter mount
 */
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { CoalitionComparePage } from "./pages/CoalitionComparePage";
import { ComparePage } from "./pages/ComparePage";
import { DemocracyPage } from "./pages/DemocracyPage";
import { HomePage } from "./pages/HomePage";
import { PartiesPage } from "./pages/PartiesPage";
import { PartyDetailPage } from "./pages/PartyDetailPage";
import { TaxComparePage } from "./pages/TaxComparePage";
import { TrackRecordComparePage } from "./pages/TrackRecordComparePage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="parties" element={<PartiesPage />} />
        <Route path="parties/:partyId" element={<PartyDetailPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="compare/tax" element={<TaxComparePage />} />
        <Route path="compare/coalition" element={<CoalitionComparePage />} />
        <Route path="compare/track-record" element={<TrackRecordComparePage />} />
        <Route path="democracy" element={<DemocracyPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
