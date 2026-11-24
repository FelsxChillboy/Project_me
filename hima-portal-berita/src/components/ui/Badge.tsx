import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "gold" | "navy" | "green" | "gray" | "red";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  gold: "bg-[#EFE4C0] text-[#5C4507] border border-[#D4BA6A]",
  navy: "bg-[#1E3A5F] text-white",
  green: "bg-emerald-50 text-emerald-900 border border-emerald-300",
  gray: "bg-[#EFECE4] text-[#3B4654] border border-[#D8D1C3]",
  red: "bg-red-50 text-red-900 border border-red-300",
};

export function Badge({
  className,
  variant = "gold",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
