interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  accentWord?: string;
  accentColor?: string;
  subtitle?: string;
  dark?: boolean;
  centered?: boolean;
  size?: "default" | "large";
}

export default function SectionHeading({
  eyebrow,
  heading,
  accentWord,
  accentColor = "text-coral",
  subtitle,
  dark = false,
  centered = false,
  size = "default",
}: SectionHeadingProps) {
  const sizeClasses = {
    default: "text-3xl md:text-5xl",
    large: "text-4xl md:text-6xl",
  };

  const renderHeading = () => {
    if (!accentWord) {
      return heading;
    }

    const index = heading.indexOf(accentWord);
    if (index === -1) {
      return heading;
    }

    const before = heading.slice(0, index);
    const after = heading.slice(index + accentWord.length);

    return (
      <>
        {before}
        <span className={accentColor}>{accentWord}</span>
        {after}
      </>
    );
  };

  return (
    <div className={centered ? "text-center" : ""}>
      {eyebrow && (
        <p
          className={`text-sm uppercase tracking-widest font-semibold mb-3 ${
            dark ? "text-ocean-light" : "text-ocean"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display ${sizeClasses[size]} font-bold ${
          dark ? "text-white" : "text-deep"
        }`}
      >
        {renderHeading()}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg ${
            dark ? "text-cyan-200" : "text-stone-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
