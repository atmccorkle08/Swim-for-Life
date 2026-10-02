import type { Metadata } from "next";
import { Heart, Mail } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import { getStripe } from "@/lib/stripe";
import type { DonationFrequency } from "@/lib/donations";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

interface DonationSummary {
  amount: string;
  frequency: DonationFrequency;
}

const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]+$/;

async function getDonationSummary(
  sessionId: string | undefined
): Promise<DonationSummary | null> {
  if (!sessionId || !SESSION_ID_PATTERN.test(sessionId)) return null;

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.status !== "complete" || session.amount_total == null) {
      return null;
    }

    const cents = session.amount_total;
    const amount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (session.currency ?? "usd").toUpperCase(),
      minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    }).format(cents / 100);

    return {
      amount,
      frequency: session.mode === "subscription" ? "monthly" : "once",
    };
  } catch (error) {
    // Invalid/expired session ID, wrong Stripe mode, or missing key: fall back
    // to the generic thank-you message.
    console.error("Unable to retrieve Stripe checkout session:", error);
    return null;
  }
}

export default async function DonateThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const { session_id } = await searchParams;
  const sessionId = Array.isArray(session_id) ? session_id[0] : session_id;
  const summary = await getDonationSummary(sessionId);

  return (
    <>
      <PageHero
        title="Thank You!"
        subtitle="Your generosity helps keep swim lessons free for every child."
      />

      <section className="py-20 md:py-24 bg-sky">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-ocean/10 shadow-md text-center">
            <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-coral" aria-hidden="true" />
            </div>

            <h2 className="mt-6 font-display text-2xl md:text-3xl font-bold text-deep">
              {summary
                ? summary.frequency === "monthly"
                  ? `Thank you for your monthly gift of ${summary.amount}!`
                  : `Thank you for your gift of ${summary.amount}!`
                : "Thank you for supporting Swim for Life!"}
            </h2>

            <p className="mt-4 text-stone-600 text-base md:text-lg leading-relaxed">
              {summary?.frequency === "monthly"
                ? "As a monthly supporter, you're helping us plan ahead and keep lessons free season after season."
                : "Your donation helps children of all abilities learn to swim — completely free of charge."}
            </p>

            <div className="mt-8 flex items-start gap-3 rounded-xl bg-sky px-5 py-4 text-left">
              <Mail className="h-5 w-5 mt-0.5 flex-shrink-0 text-ocean" aria-hidden="true" />
              <p className="text-sm text-stone-600 leading-relaxed">
                A receipt has been emailed to you. Swim for Life is a
                registered 501(c)(3) nonprofit, and donations are
                tax-deductible to the extent allowed by law. Please keep your
                receipt for your records.
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/" variant="primary">
                Back to Home
              </Button>
              <Button href="/gallery" variant="secondary" showArrow>
                View Our Gallery
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
