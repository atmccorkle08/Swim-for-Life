import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
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
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold transition-colors duration-200 text-base";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed",
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
