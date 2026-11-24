import React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md border border-[#DCE2EA] bg-white transition-colors",
        className
      )}
      {...props}
    />
  );
}
