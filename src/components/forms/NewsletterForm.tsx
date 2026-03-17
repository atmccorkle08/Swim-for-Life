"use client";

import { useState } from "react";
import { Send, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

interface NewsletterFormProps {
  variant?: "default" | "compact";
}

type FormStatus = "idle" | "loading" | "success" | "already-subscribed" | "error";

export default function NewsletterForm({ variant = "default" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus(data.alreadySubscribed ? "already-subscribed" : "success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success" || status === "already-subscribed") {
    return (
      <div className={"flex items-center justify-center gap-2 " + (variant === "compact" ? "text-sm" : "")}>
        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
        <p className={variant === "compact" ? "text-slate-300 text-sm" : "text-white"}>
          {message}
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === "loading"}
          className="flex-1 rounded-full px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center bg-primary text-white rounded-full w-9 h-9 hover:bg-primary-hover transition-colors disabled:opacity-50"
          aria-label="Subscribe"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
        {status === "error" && (
          <p className="text-red-400 text-xs mt-1">{message}</p>
        )}
      </form>
    );
  }

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
          disabled={status === "loading"}
          className="w-full sm:flex-1 rounded-full px-6 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-8 py-3 font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
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
        <p className="text-red-400 text-sm text-center mt-3">{message}</p>
      )}
    </div>
  );
}
