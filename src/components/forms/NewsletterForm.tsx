"use client";

import { useState, FormEvent } from "react";
import { Send, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

interface NewsletterFormProps {
  variant?: "default" | "compact";
}

type FormStatus = "idle" | "loading" | "success" | "already-subscribed" | "error";

export default function NewsletterForm({
  variant = "default",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.alreadySubscribed) {
        setStatus("already-subscribed");
      } else if (data.success) {
        setStatus("success");
      } else {
        setErrorMessage(data.message || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  // Success / already-subscribed states
  if (status === "success" || status === "already-subscribed") {
    const message =
      status === "success"
        ? "You're subscribed! Thanks for joining."
        : "You're already on the list! Thanks for being a supporter.";

    return (
      <div className="flex items-center justify-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <p className={variant === "compact" ? "text-sm text-cyan-200" : "text-green-500"}>
          {message}
        </p>
      </div>
    );
  }

  // Compact variant (footer)
  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="flex-1 min-w-0 rounded-full px-4 py-2 text-sm text-deep placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-ocean bg-white"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-shrink-0 bg-ocean text-white rounded-full p-2 hover:bg-ocean-dark transition-colors disabled:opacity-50 shadow-sm hover:shadow-md"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
        {status === "error" && (
          <p className="text-red-400 text-xs mt-1">{errorMessage}</p>
        )}
      </form>
    );
  }

  // Default variant (homepage CTA)
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full sm:flex-1 rounded-full px-6 py-3 text-deep placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-ocean bg-white"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 bg-ocean text-white rounded-full px-8 py-3 font-semibold hover:bg-ocean-dark transition-colors disabled:opacity-50 shadow-sm hover:shadow-md"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Subscribe
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-400 text-center">{errorMessage}</p>
      )}
    </div>
  );
}
