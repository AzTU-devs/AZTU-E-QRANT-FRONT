import { useState } from "react";

// interface CountryCode {
//   code: string;
//   label: string;
// }

interface PhoneInputProps {
  placeholder?: string;
  onChange?: (phoneNumber: string) => void;
  selectPosition?: "start" | "end";
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  placeholder = "+1 (555) 000-0000",
  onChange,
  // selectPosition = "start", // Default position is 'start'
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("+994");


  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    if (onChange) {
      onChange(newPhoneNumber);
    }
  };

  return (
    <div className="relative flex">
      {/* Dropdown position: Start */}

      {/* Input field */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        maxLength={13}
        className={`h-11 w-full rounded-xl border border-gray-200 bg-white/70 backdrop-blur py-3 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 transition-all duration-200 hover:border-gray-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/15 dark:border-white/10 dark:bg-gray-900/60 dark:text-white/90 dark:placeholder:text-white/30 dark:hover:border-white/20 dark:focus:border-brand-500`}
      />

      {/* Dropdown position: End */}
    </div>
  );
};

export default PhoneInput;
