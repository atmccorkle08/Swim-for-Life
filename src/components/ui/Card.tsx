interface CardProps {
  children: React.ReactNode;
  variant?: "light" | "dark";
  className?: string;
}

export default function Card({
  children,
  variant = "light",
  className = "",
}: CardProps) {
  const variants = {
    light: "bg-white rounded-xl shadow-lg p-6",
    dark: "bg-slate-800 rounded-xl p-6",
  };

  return (
    <div className={`${variants[variant]} ${className}`}>{children}</div>
  );
}
