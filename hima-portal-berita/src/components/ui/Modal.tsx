import React from "react";
import { cn } from "@/lib/utils";

export function Modal({ open, children }: { open: boolean; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={cn("rounded-lg bg-white p-6 shadow-lg")}>{children}</div>
    </div>
  );
}
