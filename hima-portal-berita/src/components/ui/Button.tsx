import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "brass";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1E3A5F] text-white hover:bg-[#14263D] active:translate-y-px",
  brass:
    "bg-[#C9A227] text-[#14263D] font-semibold hover:bg-[#b8921f] active:translate-y-px",
  secondary:
    "border border-[#8C8272] bg-[#FFFDF9] text-[#14263D] hover:bg-[#EFECE4] active:translate-y-px",
  danger:
    "bg-red-700 text-white hover:bg-red-800 active:translate-y-px",
  ghost:
    "bg-transparent text-[#14263D] hover:bg-[#EFECE4] active:translate-y-px",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-1.5 text-xs",
  md: "min-h-11 px-4 py-2 text-sm",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
