interface CardProps {
  children: React.ReactNode;
  variant?: "light" | "dark" | "tinted" | "warm";
  accent?: "ocean" | "coral" | "sand" | "none";
  className?: string;
}

export default function Card({
  children,
  variant = "light",
  accent = "none",
  className = "",
}: CardProps) {
  const variants = {
    light: "bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-ocean-50/80",
    dark: "bg-deep rounded-2xl p-6",
    tinted: "bg-sky rounded-2xl p-6 border border-ocean/10",
    warm: "bg-sand-light rounded-2xl p-6 border border-coral/10",
  };

  const accents = {
    none: "",
    ocean: "border-t-4 border-t-ocean",
    coral: "border-t-4 border-t-coral",
    sand: "border-t-4 border-t-amber-400",
  };

  return (
    <div className={`${variants[variant]} ${accents[accent]} ${className}`}>
      {children}
    </div>
  );
}
