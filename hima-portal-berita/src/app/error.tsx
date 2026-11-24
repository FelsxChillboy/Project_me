"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4F6F9] px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-700">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>
      <h1 className="mt-4 font-serif text-2xl font-bold text-[#111827]">
        Halaman Gagal Dimuat
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#475569]">
        Terjadi kendala saat mengambil data dari server. Muat ulang halaman ini
        atau kembali ke beranda.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()}>Muat Ulang</Button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-md border border-[#64748B] bg-white px-4 py-2 text-sm font-semibold text-[#111827] hover:bg-[#F4F6F9]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
