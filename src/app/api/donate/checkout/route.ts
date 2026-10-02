import { NextResponse } from "next/server";
import { z } from "zod";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { DONATION_MAX_DOLLARS, DONATION_MIN_DOLLARS } from "@/lib/donations";

const donationSchema = z.object({
  amount: z
    .number({ error: "Please enter a donation amount." })
    .int("Please enter a whole-dollar amount.")
    .min(DONATION_MIN_DOLLARS, `The minimum donation is $${DONATION_MIN_DOLLARS}.`)
    .max(
      DONATION_MAX_DOLLARS,
      `The maximum online donation is $${DONATION_MAX_DOLLARS.toLocaleString("en-US")}.`
    ),
  frequency: z.enum(["once", "monthly"], {
    error: "Please choose a one-time or monthly donation.",
  }),
});

/**
 * In production, redirect back to the canonical site URL. In development, use
 * the request origin so Stripe returns to localhost even if .env.local has the
 * production NEXT_PUBLIC_SITE_URL.
 */
function getBaseUrl(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (configured && process.env.NODE_ENV === "production") return configured;
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = donationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid donation details." },
      { status: 400 }
    );
  }

  const { amount, frequency } = parsed.data;
  const isMonthly = frequency === "monthly";
  const baseUrl = getBaseUrl(request);
  const metadata = { source: "website", frequency };
  const productName = isMonthly
    ? "Monthly donation to Swim for Life"
    : "Donation to Swim for Life";

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: isMonthly ? "subscription" : "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amount * 100,
          product_data: {
            name: productName,
            description:
              "Supporting free swim lessons for children of all abilities in North Palm Beach, FL.",
          },
          ...(isMonthly ? { recurring: { interval: "month" as const } } : {}),
        },
      },
    ],
    billing_address_collection: "required",
    metadata,
    success_url: `${baseUrl}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/donate`,
    ...(isMonthly
      ? {
          subscription_data: { description: productName, metadata },
        }
      : {
          submit_type: "donate" as const,
          customer_creation: "always" as const,
          payment_intent_data: { description: productName, metadata },
        }),
  };

  try {
    const session = await getStripe().checkout.sessions.create(params);

    if (!session.url) {
      console.error("Stripe checkout session created without a URL:", session.id);
      return NextResponse.json(
        { error: "Unable to start checkout. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    // Log details server-side only; never return Stripe internals to the client.
    console.error("Stripe checkout session error:", error);
    const isConfigError =
      error instanceof Error && error.message.includes("STRIPE_SECRET_KEY");
    return NextResponse.json(
      {
        error: isConfigError
          ? "Online donations are temporarily unavailable. Please try again later."
          : "Unable to start checkout. Please try again.",
      },
      { status: isConfigError ? 503 : 502 }
    );
  }
}
