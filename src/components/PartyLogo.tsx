/**
 * @file PartyLogo.tsx
 * @description Displays local party logo with monogram fallback
 * @onboarding
 * - Logos live in public/party-logos via branding.json
 * - primaryHex used for monogram / optional accent only — not page themes
 * - Dependencies: getParty, getPartyBranding, partyLogoUrl
 */
import { useState } from "react";
import { getParty, getPartyBranding, partyLogoUrl } from "../lib/data";

const sizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
} as const;

export function PartyLogo({
  partyId,
  size = "md",
  className = "",
}: {
  partyId: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const party = getParty(partyId);
  const branding = getPartyBranding(partyId);
  const src = partyLogoUrl(partyId);
  const [failed, setFailed] = useState(false);

  if (!party || !branding) return null;

  const box = `${sizes[size]} shrink-0 rounded-md overflow-hidden bg-white border border-ink-900/10 ${className}`;

  if (!src || failed) {
    const label = party.abbreviation.slice(0, 3).toUpperCase();
    return (
      <span
        className={`${box} inline-flex items-center justify-center text-[0.65rem] font-bold text-white`}
        style={{ backgroundColor: branding.primaryHex }}
        role="img"
        aria-label={`${party.name} monogram`}
      >
        {label}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`${party.name} logo`}
      className={`${box} object-contain p-0.5`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
