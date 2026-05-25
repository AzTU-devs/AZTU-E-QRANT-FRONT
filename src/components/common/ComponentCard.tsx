interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm dark:border-white/[0.06] dark:bg-gray-900/40 shadow-theme-sm hover:shadow-theme-md transition-shadow ${className}`}
    >
      {/* Card Header */}
      <div className="relative px-6 py-5 bg-gradient-to-r from-gray-50/60 to-transparent dark:from-white/[0.02] rounded-t-2xl">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-gradient-to-b from-brand-500 to-purple-500" />
        <h3 className="pl-4 text-base font-semibold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h3>
        {desc && (
          <p className="pl-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-white/[0.05] sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
