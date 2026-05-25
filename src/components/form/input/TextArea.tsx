import React from "react";

interface TextareaProps {
  placeholder?: string; // Placeholder text
  rows?: number; // Number of rows
  value?: string; // Current value
  onChange?: (value: string) => void; // Change handler
  className?: string; // Additional CSS classes
  disabled?: boolean; // Disabled state
  error?: boolean; // Error state
  hint?: string; // Hint text to display
}

const TextArea: React.FC<TextareaProps> = ({
  placeholder = "Enter your message", // Default placeholder
  rows = 3, // Default number of rows
  value = "", // Default value
  onChange, // Callback for changes
  className = "", // Additional custom styles
  disabled = false, // Disabled state
  error = false, // Error state
  hint = "", // Default hint text
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  let textareaClasses = `w-full rounded-xl border px-4 py-3 text-sm shadow-theme-xs transition-all duration-200 focus:outline-none placeholder:text-gray-400 ${className} `;

  if (disabled) {
    textareaClasses += ` bg-gray-100 opacity-60 text-gray-500 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    textareaClasses += ` bg-error-25 border-error-400 focus:border-error-400 focus:ring-4 focus:ring-error-500/15 dark:border-error-500/60 dark:bg-error-500/[0.04] dark:text-white/90`;
  } else {
    textareaClasses += ` bg-white/70 backdrop-blur text-gray-900 border-gray-200 hover:border-gray-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 dark:border-white/10 dark:hover:border-white/20 dark:bg-gray-900/60 dark:text-white/90 dark:focus:border-brand-500`;
  }

  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={textareaClasses}
      />
      {hint && (
        <p
          className={`mt-2 text-sm ${
            error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
