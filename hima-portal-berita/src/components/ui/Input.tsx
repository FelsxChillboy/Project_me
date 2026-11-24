import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "min-h-11 w-full rounded-md border border-[#64748B] bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#475569] focus:border-[#0B4F9C]",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
