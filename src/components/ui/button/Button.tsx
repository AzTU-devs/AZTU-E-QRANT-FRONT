import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-3.5 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "relative overflow-hidden text-white font-semibold bg-brand-600 ring-1 ring-inset ring-white/15 shadow-[0_4px_12px_-3px_rgba(24,47,121,0.5)] hover:bg-brand-700 hover:shadow-[0_8px_22px_-4px_rgba(24,47,121,0.55)] active:scale-[0.97] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-gradient-to-b before:from-white/20 before:to-transparent disabled:opacity-60 disabled:shadow-none",
    outline:
      "bg-white text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50 hover:ring-brand-300 active:scale-[0.97] dark:bg-white/[0.04] dark:text-gray-200 dark:ring-white/10 dark:hover:bg-white/[0.08] dark:hover:text-white",
  };

  return (
    <button
    type="submit"
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-60 active:scale-100" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="relative z-10 flex items-center">{startIcon}</span>}
      <span className="relative z-10">{children}</span>
      {endIcon && <span className="relative z-10 flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
