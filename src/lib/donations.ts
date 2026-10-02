// Shared donation constants — safe to import from both client and server code
// (keep Stripe SDK imports out of this file).

/** Donation limits in whole US dollars. */
export const DONATION_MIN_DOLLARS = 5;
export const DONATION_MAX_DOLLARS = 10_000;

export const DONATION_PRESETS = [25, 50, 100, 250] as const;

export type DonationFrequency = "once" | "monthly";
