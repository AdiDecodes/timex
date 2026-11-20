"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({ variant = "primary", size = "md", children, className = "", ...props }: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-sans font-medium tracking-wider uppercase transition-all duration-300 rounded-[2px] cursor-pointer focus:outline-none select-none";
  
  const variants = {
    primary: "bg-[#101B38] text-[#FCFBF8] hover:bg-[#C95745] border border-[#101B38] hover:border-[#C95745] shadow-xs",
    secondary: "bg-transparent text-[#101B38] hover:bg-[#101B38] hover:text-[#FCFBF8] border border-[#333333] hover:border-[#101B38]",
    outline: "bg-transparent text-[#101B38] hover:bg-[#101B38] hover:text-[#FCFBF8] border border-[#333333] hover:border-[#101B38]",
    gold: "bg-[#C95745] text-[#FCFBF8] hover:bg-[#101B38] border border-[#C95745] hover:border-[#101B38] shadow-sm",
  };

  const sizes = {
    sm: "px-4 py-2 text-[11px] gap-1.5",
    md: "px-6 py-3 text-xs gap-2",
    lg: "px-8 py-3.5 text-xs gap-2.5",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
