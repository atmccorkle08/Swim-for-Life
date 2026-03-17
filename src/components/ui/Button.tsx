import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "coral" | "ghost" | "outline-coral";
  showArrow?: boolean;
  icon?: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  href,
  variant = "primary",
  showArrow = false,
  icon,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold transition-all duration-200 text-base shadow-sm hover:shadow-md";

  const variants = {
    primary:
      "bg-ocean text-white hover:bg-ocean-dark disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-white text-deep border border-ocean/20 hover:bg-sky disabled:opacity-50 disabled:cursor-not-allowed",
    coral:
      "bg-coral text-white hover:bg-coral-dark disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
      "bg-transparent text-ocean hover:bg-ocean/10 shadow-none hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed",
    "outline-coral":
      "border-2 border-coral text-coral hover:bg-coral hover:text-white shadow-none disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const styles = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {icon}
        {children}
        {showArrow && <ArrowRight className="h-4 w-4" />}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={styles}
    >
      {icon}
      {children}
      {showArrow && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}
