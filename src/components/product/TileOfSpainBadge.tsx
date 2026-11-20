import React from "react";
import Image from "next/image";

interface TileOfSpainBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TileOfSpainBadge({ size = "md", className = "" }: TileOfSpainBadgeProps) {
  // Exact 2:1 aspect ratio preserving the provided logo appearance
  // sm: for compact cards / thumbnails (~48x24 to 54x27)
  // md: for standard product cards (~56x28 to 72x36)
  // lg: for main product detail gallery image (~76x38 to 100x50)
  const sizeClasses = {
    sm: "w-[48px] sm:w-[54px] h-auto aspect-[2/1]",
    md: "w-[56px] sm:w-[64px] md:w-[72px] h-auto aspect-[2/1]",
    lg: "w-[76px] sm:w-[90px] md:w-[100px] h-auto aspect-[2/1]",
  }[size];

  return (
    <div
      className={`absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-20 pointer-events-none select-none drop-shadow-md transition-all duration-200 ${className}`}
      title="Tile of Spain"
      aria-label="Tile of Spain Badge"
    >
      <Image
        src="/images/tile-of-spain.png"
        alt="Tile of Spain"
        width={100}
        height={50}
        priority={size === "lg"}
        className={`${sizeClasses} object-contain block`}
      />
    </div>
  );
}

