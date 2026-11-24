import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "gold" | "navy" | "green" | "gray" | "red";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  gold: "bg-[#EAF2FB] text-[#0B4F9C] border border-[#C7DCF6]",
  navy: "bg-[#0F213E] text-white",
  green: "bg-emerald-50 text-emerald-900 border border-emerald-300",
  gray: "bg-[#F4F6F9] text-[#475569] border border-[#DCE2EA]",
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
