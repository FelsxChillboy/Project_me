import React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] transition-colors",
        className
      )}
      {...props}
    />
  );
}
