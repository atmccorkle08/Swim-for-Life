"use client";

import { useState, FormEvent } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMessage(data.message || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 border border-ocean/10 shadow-sm text-center">
        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
        <h3 className="font-display text-lg font-bold text-deep mt-4">
          Message Sent!
        </h3>
        <p className="text-stone-600 mt-2">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-ocean hover:text-ocean-dark font-medium transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-8 border border-ocean/10 shadow-sm space-y-5"
    >
      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-deep mb-1"
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl px-4 py-3 border border-stone-200 text-deep placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-deep mb-1"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl px-4 py-3 border border-stone-200 text-deep placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-deep mb-1"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="w-full rounded-xl px-4 py-3 border border-stone-200 text-deep placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent resize-none"
          placeholder="How can we help?"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

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
        Send Message
      </button>
    </form>
  );
}
