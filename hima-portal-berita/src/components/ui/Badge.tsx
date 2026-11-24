import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-block rounded-full bg-[#C9A227] px-2 py-0.5 text-xs font-medium text-white", className)} {...props} />;
}
