interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  dark?: boolean;
  centered?: boolean;
}

export default function SectionHeading({
  eyebrow,
  heading,
  subtitle,
  dark = false,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      {eyebrow && (
        <p className="text-sm uppercase tracking-widest font-semibold text-primary mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl md:text-4xl font-bold ${
          dark ? "text-white" : "text-slate-800"
        }`}
      >
        {heading}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg ${
            dark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
