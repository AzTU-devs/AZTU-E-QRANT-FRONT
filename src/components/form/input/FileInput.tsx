import { FC } from "react";

interface FileInputProps {
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: FC<FileInputProps> = ({ className, onChange }) => {
  return (
    <input
      type="file"
      className={`h-11 w-full overflow-hidden rounded-xl border border-gray-200 bg-white/70 backdrop-blur text-sm text-gray-500 shadow-theme-xs transition-all duration-200 hover:border-gray-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 file:mr-5 file:cursor-pointer file:rounded-l-xl file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gradient-to-br file:from-brand-500 file:to-purple-500 file:py-3 file:pl-4 file:pr-4 file:text-sm file:font-semibold file:text-white placeholder:text-gray-400 hover:file:brightness-110 focus:outline-none dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-300 dark:placeholder:text-gray-500 ${className}`}
      onChange={onChange}
    />
  );
};

export default FileInput;
