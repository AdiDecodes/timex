"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glassmorphic?: boolean;
  children: React.ReactNode;
}

export function Card({ hoverEffect = true, glassmorphic = false, children, className = "", ...props }: CardProps) {
  const baseStyle = "rounded-[2px] overflow-hidden bg-[#FCFBF8] border border-[#EDEAE4] transition-all duration-300";
  
  const shadowStyle = hoverEffect 
    ? "shadow-[0_4px_20px_-4px_rgba(16,27,56,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(16,27,56,0.08)] hover:-translate-y-0.5 hover:border-[#C95745]/30"
    : "shadow-[0_4px_20px_-4px_rgba(16,27,56,0.04)]";

  const glassStyle = glassmorphic
    ? "backdrop-blur-md bg-[#FCFBF8]/80 border border-[#EDEAE4]"
    : "";

  return (
    <div
      className={`${baseStyle} ${shadowStyle} ${glassStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
