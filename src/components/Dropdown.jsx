import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({ options, label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:border-2 focus:border-yellow-300 duration-300 focus:outline-none"
      >
        {value || label}
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <ul className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-auto">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
