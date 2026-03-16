"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import WaveDivider from "@/components/ui/WaveDivider";

export default function NewsletterPlaceholder() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Newsletter coming soon! We'll let you know when it's ready.");
    setEmail("");
  };

  return (
    <>
      <section className="bg-deep py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
            Stay in the Loop
          </h2>
          <p className="mt-4 text-cyan-200 text-base md:text-lg max-w-xl mx-auto">
            Sign up to be the first to know when new sessions open.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
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
              className="inline-flex items-center gap-2 bg-ocean text-white rounded-full px-8 py-3 font-semibold hover:bg-ocean-dark transition-colors shadow-sm hover:shadow-md"
            >
              <Send className="h-4 w-4" />
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
