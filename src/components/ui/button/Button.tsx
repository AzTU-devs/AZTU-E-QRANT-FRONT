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
    sm: "px-4 py-2.5 text-sm",
    md: "px-5 py-3 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "text-white font-semibold btn-gradient btn-gradient-hover shadow-[0_8px_20px_-8px_rgba(91,91,240,0.55)] disabled:opacity-60 disabled:shadow-none",
    outline:
      "bg-white/80 backdrop-blur text-gray-700 ring-1 ring-inset ring-gray-200 hover:ring-brand-300 hover:bg-white hover:text-brand-600 hover:-translate-y-px hover:shadow-theme-sm dark:bg-white/[0.04] dark:text-gray-300 dark:ring-white/10 dark:hover:bg-white/[0.08] dark:hover:text-white",
  };

  return (
    <button
    type="submit"
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
