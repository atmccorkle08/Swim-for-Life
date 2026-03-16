import { Heart } from "lucide-react";

export default function FundraisingPlaceholder() {
  return (
    <section className="relative overflow-hidden gradient-warm py-20 md:py-24">
      {/* Decorative wave pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
          Support Our Mission
        </h2>
        <p className="mt-4 text-white/80 text-base md:text-lg max-w-xl mx-auto">
          Help us continue providing free swim lessons to children in our
          community.
        </p>
        <div className="mt-8">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white text-coral rounded-full px-8 py-3 font-semibold hover:bg-sand-light transition-colors shadow-md hover:shadow-lg"
          >
            <Heart className="h-4 w-4" />
            Donate
          </a>
        </div>
      </div>
    </section>
  );
}
