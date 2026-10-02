"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { Heart, Loader2, Lock, AlertCircle } from "lucide-react";
import {
  DONATION_MAX_DOLLARS,
  DONATION_MIN_DOLLARS,
  DONATION_PRESETS,
  type DonationFrequency,
} from "@/lib/donations";

const DEFAULT_PRESET = 50;

const formatDollars = (value: number) =>
  `$${value.toLocaleString("en-US")}`;

/** Parse a custom amount. Accepts "25", "$1,000", "25.00"; rejects cents. */
function parseCustomAmount(raw: string): { amount: number | null; error: string | null } {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (cleaned === "") return { amount: null, error: null };
  if (!/^\d+(\.0{1,2})?$/.test(cleaned)) {
    return { amount: null, error: "Please enter a whole-dollar amount." };
  }
  const amount = parseInt(cleaned, 10);
  if (amount < DONATION_MIN_DOLLARS) {
    return { amount: null, error: `The minimum donation is ${formatDollars(DONATION_MIN_DOLLARS)}.` };
  }
  if (amount > DONATION_MAX_DOLLARS) {
    return {
      amount: null,
      error: `The maximum online donation is ${formatDollars(DONATION_MAX_DOLLARS)}.`,
    };
  }
  return { amount, error: null };
}

const FREQUENCIES: { value: DonationFrequency; label: string }[] = [
  { value: "once", label: "One-time" },
  { value: "monthly", label: "Monthly" },
];

export default function DonationForm() {
  const [frequency, setFrequency] = useState<DonationFrequency>("once");
  const [preset, setPreset] = useState<number | null>(DEFAULT_PRESET);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customId = useId();
  const customHintId = useId();
  const customErrorId = useId();

  // If the donor returns from Stripe with the browser Back button, the page
  // may be restored from the back/forward cache with the spinner still showing.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setLoading(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const customResult = parseCustomAmount(custom);
  const usingCustom = preset === null;
  const amount = usingCustom ? customResult.amount : preset;
  const customError = usingCustom ? customResult.error : null;
  const canSubmit = amount !== null && !loading;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (amount === null || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, frequency }),
      });
      const data: { url?: string; error?: string } = await res
        .json()
        .catch(() => ({}));

      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const buttonLabel =
    amount === null
      ? "Donate"
      : `Donate ${formatDollars(amount)}${frequency === "monthly" ? " / month" : ""}`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl p-6 sm:p-8 border border-ocean/10 shadow-md space-y-7"
      aria-describedby={error ? "donate-error" : undefined}
    >
      {/* Frequency toggle */}
      <div>
        <p id="donate-frequency-label" className="block text-sm font-semibold text-deep mb-3">
          How often would you like to give?
        </p>
        <div
          role="group"
          aria-labelledby="donate-frequency-label"
          className="grid grid-cols-2 gap-1 rounded-full bg-sky p-1 border border-ocean/10"
        >
          {FREQUENCIES.map((f) => {
            const active = frequency === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFrequency(f.value)}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 ${
                  active
                    ? "bg-ocean text-white shadow-sm"
                    : "text-stone-600 hover:text-deep hover:bg-white/70"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset amounts */}
      <div>
        <p id="donate-amount-label" className="block text-sm font-semibold text-deep mb-3">
          Choose an amount
        </p>
        <div
          role="group"
          aria-labelledby="donate-amount-label"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {DONATION_PRESETS.map((value) => {
            const active = preset === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setPreset(value);
                  setCustom("");
                  setError(null);
                }}
                className={`rounded-xl border-2 px-4 py-3 font-display text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 ${
                  active
                    ? "border-coral bg-coral text-white shadow-sm"
                    : "border-ocean/15 bg-white text-deep hover:border-coral/60 hover:bg-cream"
                }`}
              >
                {formatDollars(value)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom amount */}
      <div>
        <label htmlFor={customId} className="block text-sm font-semibold text-deep mb-2">
          Or enter a custom amount
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-500 font-semibold"
          >
            $
          </span>
          <input
            id={customId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Other amount"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setPreset(null);
              setError(null);
            }}
            aria-invalid={customError ? true : undefined}
            aria-describedby={customError ? `${customHintId} ${customErrorId}` : customHintId}
            className={`w-full rounded-xl border-2 bg-white py-3 pl-8 pr-4 text-deep text-lg placeholder:text-stone-400 placeholder:text-base focus:outline-none focus:ring-2 transition-colors ${
              customError
                ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                : usingCustom && custom !== ""
                  ? "border-coral focus:border-coral focus:ring-coral/20"
                  : "border-ocean/15 focus:border-ocean focus:ring-ocean/20"
            }`}
          />
        </div>
        <p id={customHintId} className="mt-2 text-xs text-stone-500">
          Whole dollars, {formatDollars(DONATION_MIN_DOLLARS)} to{" "}
          {formatDollars(DONATION_MAX_DOLLARS)}.
        </p>
        {customError && (
          <p id={customErrorId} className="mt-1 text-sm text-red-600">
            {customError}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="space-y-3">
        <button
          type="submit"
          disabled={!canSubmit}
          aria-busy={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 text-lg font-semibold text-white shadow-sm transition-all duration-200 hover:bg-coral-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Redirecting to secure checkout…
            </>
          ) : (
            <>
              <Heart className="h-5 w-5" aria-hidden="true" />
              {buttonLabel}
            </>
          )}
        </button>

        {error && (
          <div
            id="donate-error"
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {frequency === "monthly" && (
          <p className="text-xs text-stone-500 text-center">
            Monthly gifts renew automatically. You can cancel anytime by
            contacting us.
          </p>
        )}
      </div>

      {/* Trust notes */}
      <div className="border-t border-ocean/10 pt-5 space-y-2 text-sm text-stone-600">
        <p className="flex items-start gap-2">
          <Lock className="h-4 w-4 mt-0.5 flex-shrink-0 text-ocean" aria-hidden="true" />
          <span>
            Payments are processed securely by Stripe. We never see or store
            your card details.
          </span>
        </p>
        <p className="text-xs text-stone-500 leading-relaxed">
          Swim for Life is a registered 501(c)(3) nonprofit. Donations are
          tax-deductible to the extent allowed by law.
        </p>
      </div>
    </form>
  );
}
