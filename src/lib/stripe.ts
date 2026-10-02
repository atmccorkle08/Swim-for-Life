import Stripe from "stripe";

// Server-only: never import this from a client component. The secret key is
// not exposed to the browser (no NEXT_PUBLIC_ prefix), so this would fail
// there anyway.

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY environment variable. Add it to .env.local (use an sk_test_ key for development)."
    );
  }

  // apiVersion is omitted on purpose: the SDK pins to the API version its
  // types were generated for.
  _stripe = new Stripe(key, {
    appInfo: { name: "Swim for Life Website" },
  });

  return _stripe;
}
