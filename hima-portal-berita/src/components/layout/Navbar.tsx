"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/berita", label: "Berita" },
  { href: "/galeri", label: "Galeri" },
  { href: "/tentang", label: "Tentang" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#D8D1C3] bg-[#FFFDF9]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[#14263D] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Lewati ke konten utama
      </a>

      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 md:px-6"
      >
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5 font-serif text-xl font-bold tracking-tight text-[#14263D]"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded bg-[#14263D] text-[#C9A227]"
            aria-hidden="true"
          >
            <Scale className="h-4 w-4" />
          </span>
          <span>HIMA Ilmu Hukum</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 text-sm md:flex">
          {links.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center px-3.5 font-medium transition-colors",
                  active
                    ? "text-[#14263D] underline decoration-[#C9A227] decoration-2 underline-offset-8"
                    : "text-[#475467] hover:text-[#14263D]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/admin/login"
            className="ml-3 inline-flex min-h-10 items-center rounded-md border border-[#1E3A5F] px-3.5 text-xs font-semibold text-[#1E3A5F] transition-colors hover:bg-[#1E3A5F] hover:text-white"
          >
            Masuk Admin
          </Link>
        </div>

        {/* Mobile menu button with explicit label */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-[#D8D1C3] bg-[#F7F4EE] px-3 text-sm font-medium text-[#14263D] hover:bg-[#EFECE4] md:hidden"
        >
          {open ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{open ? "Tutup" : "Menu"}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-nav-menu"
          className="border-t border-[#D8D1C3] bg-[#FFFDF9] px-4 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1.5 text-sm">
            {links.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center rounded-md px-3 font-medium transition-colors",
                    active
                      ? "bg-[#EFECE4] font-semibold text-[#14263D]"
                      : "text-[#475467] hover:bg-[#F7F4EE] hover:text-[#14263D]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-2 flex min-h-11 items-center justify-center rounded-md bg-[#1E3A5F] px-3 font-medium text-white hover:bg-[#14263D]"
            >
              Masuk Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
