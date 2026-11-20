"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: DropdownOption[];
}

export const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
  ({ label, options, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full text-xs relative">
        {label && (
          <label className="font-sans font-medium text-[#101B38] block tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-4 py-3 bg-[#FCFBF8] border border-[#EDEAE4] rounded-[2px] text-xs text-[#333333] appearance-none focus:outline-none focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38] transition-all duration-200 pr-10 cursor-pointer ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";
export default Dropdown;
