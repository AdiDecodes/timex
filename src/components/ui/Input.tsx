"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  textarea?: boolean;
  rows?: number;
  error?: string;
  leftAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  ({ label, textarea = false, rows = 4, error, leftAddon, className = "", ...props }, ref) => {
    const inputStyle = `w-full px-4 py-3 bg-[#FCFBF8] border rounded-[2px] text-xs text-[#333333] placeholder-[#888888] focus:outline-none transition-all duration-200 ${
      error
        ? "border-[#C95745] focus:border-[#C95745] focus:ring-1 focus:ring-[#C95745]"
        : "border-[#EDEAE4] focus:border-[#101B38] focus:ring-1 focus:ring-[#101B38]"
    }`;

    return (
      <div className="space-y-1.5 w-full text-xs">
        {label && (
          <label className="font-sans font-medium text-[#101B38] block tracking-wide">
            {label}
          </label>
        )}
        {textarea ? (
          <textarea
            ref={ref as any}
            rows={rows}
            className={`${inputStyle} resize-none ${className}`}
            {...(props as any)}
          />
        ) : leftAddon ? (
          <div className="flex relative">
            <span className="inline-flex items-center px-3 bg-[#EDEAE4] border border-r-0 border-[#DED9D0] rounded-l-[2px] text-xs font-semibold text-[#101B38] select-none shrink-0">
              {leftAddon}
            </span>
            <input
              ref={ref as any}
              className={`${inputStyle} rounded-l-none ${className}`}
              {...props}
            />
          </div>
        ) : (
          <input
            ref={ref as any}
            className={`${inputStyle} ${className}`}
            {...props}
          />
        )}
        {error && (
          <p className="text-[11px] text-[#C95745] font-medium pt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
