type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant; // Light or solid variant
  size?: BadgeSize; // Badge size
  color?: BadgeColor; // Badge color
  startIcon?: React.ReactNode; // Icon at the start
  endIcon?: React.ReactNode; // Icon at the end
  children: React.ReactNode; // Badge content
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-1 justify-center gap-1 rounded-full font-semibold ring-1 ring-inset";

  // Define size styles
  const sizeStyles = {
    sm: "text-theme-xs", // Smaller padding and font size
    md: "text-sm", // Default padding and font size
  };

  // Define color styles for variants
  const variants = {
    light: {
      primary:
        "bg-brand-50 text-brand-700 ring-brand-200/60 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-400/20",
      success:
        "bg-success-50 text-success-700 ring-success-200/60 dark:bg-success-500/15 dark:text-success-400 dark:ring-success-400/20",
      error:
        "bg-error-50 text-error-700 ring-error-200/60 dark:bg-error-500/15 dark:text-error-400 dark:ring-error-400/20",
      warning:
        "bg-warning-50 text-warning-700 ring-warning-200/60 dark:bg-warning-500/15 dark:text-warning-400 dark:ring-warning-400/20",
      info: "bg-blue-light-50 text-blue-light-700 ring-blue-light-200/60 dark:bg-blue-light-500/15 dark:text-blue-light-400 dark:ring-blue-light-400/20",
      light: "bg-gray-100 text-gray-700 ring-gray-200/60 dark:bg-white/5 dark:text-white/80 dark:ring-white/10",
      dark: "bg-gray-800 text-white ring-gray-700/40 dark:bg-white/10 dark:text-white",
    },
    solid: {
      primary: "bg-gradient-to-r from-brand-500 to-purple-500 text-white ring-transparent shadow-[0_4px_10px_-2px_rgba(24,47,121,0.45)]",
      success: "bg-gradient-to-r from-success-500 to-success-600 text-white ring-transparent",
      error: "bg-gradient-to-r from-error-500 to-error-600 text-white ring-transparent",
      warning: "bg-gradient-to-r from-warning-500 to-orange-500 text-white ring-transparent",
      info: "bg-gradient-to-r from-blue-light-500 to-blue-light-600 text-white ring-transparent",
      light: "bg-gray-400 ring-transparent dark:bg-white/10 text-white dark:text-white/80",
      dark: "bg-gray-800 text-white ring-transparent dark:bg-white/10 dark:text-white",
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
