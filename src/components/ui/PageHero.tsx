import WaveDivider from "./WaveDivider";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  waveFill?: string;
}

export default function PageHero({
  title,
  subtitle,
  waveFill = "#ECFEFF",
}: PageHeroProps) {
  return (
    <section className="relative gradient-hero">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-[20%] w-64 h-64 rounded-full bg-ocean-light/10 blur-3xl" />
        <div className="absolute bottom-10 left-[10%] w-48 h-48 rounded-full bg-coral/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-28">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-cyan-200 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <WaveDivider variant="gentle" fill={waveFill} />
    </section>
  );
}
