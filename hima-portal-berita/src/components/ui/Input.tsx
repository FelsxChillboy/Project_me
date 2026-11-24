import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "min-h-11 w-full rounded-md border border-[#8C8272] bg-[#FFFDF9] px-3 py-2 text-sm text-[#14263D] placeholder:text-[#5B6472] focus:border-[#1E3A5F]",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
