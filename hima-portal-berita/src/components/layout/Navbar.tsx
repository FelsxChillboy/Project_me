"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavCategory {
  id: string;
  name: string;
  slug: string;
}

interface NavbarProps {
  categories: NavCategory[];
  todayLabel: string;
}

export function Navbar({ categories, todayLabel }: NavbarProps) {
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

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-[#0F213E] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Lewati ke konten utama
      </a>

      {/* Tier 1: Institutional Legal Utility Strip */}
      <div className="hidden bg-[#0F213E] text-xs text-[#CBD5E1] md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
          <p className="tabular-nums">
            <span className="font-semibold text-white">Portal Berita HIMA Ilmu Hukum</span>
            <span className="mx-2 text-[#64748B]">|</span>
            <time>{todayLabel}</time>
          </p>
          <div className="flex items-center gap-5">
            <Link href="/tentang" className="hover:text-[#F5D061]">
              Tentang Redaksi
            </Link>
            <Link href="/galeri" className="hover:text-[#F5D061]">
              Galeri Kegiatan
            </Link>
            <Link href="/admin/login" className="font-semibold text-[#F5D061] hover:underline">
              Masuk Redaksi
            </Link>
          </div>
        </div>
      </div>

      {/* Tier 2: Main Brand & Search Bar */}
      <div className="border-b border-[#DCE2EA] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="flex min-h-11 items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#0F213E] text-[#F5D061]"
              aria-hidden="true"
            >
              <Scale className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="font-serif text-xl font-bold leading-none tracking-tight text-[#0F213E] md:text-2xl">
                HIMA Ilmu Hukum
              </span>
              <span className="mt-1 hidden text-[11px] font-medium text-[#475569] sm:block">
                Portal Berita, Opini, dan Kajian Hukum Mahasiswa
              </span>
            </span>
          </Link>

          {/* Desktop Integrated Search + Action */}
          <div className="hidden items-center gap-3 md:flex">
            <form action="/berita" method="GET" className="flex items-center">
              <label htmlFor="header-search-input" className="sr-only">
                Cari berita hukum
              </label>
              <div className="relative">
                <input
                  id="header-search-input"
                  type="search"
                  name="search"
                  placeholder="Cari berita, opini, kegiatan..."
                  className="min-h-10 w-64 rounded-l-md border border-r-0 border-[#64748B] bg-[#F4F6F9] py-1.5 pr-3 pl-3 text-sm text-[#111827] placeholder:text-[#475569] focus:border-[#0B4F9C] focus:bg-white lg:w-72"
                />
              </div>
              <button
                type="submit"
                aria-label="Cari berita"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-r-md bg-[#0B4F9C] px-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F213E]"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>Cari</span>
              </button>
            </form>

            <Link
              href="/berita"
              className="inline-flex min-h-10 items-center rounded-md border border-[#142D55] px-3.5 text-xs font-semibold text-[#142D55] transition-colors hover:bg-[#142D55] hover:text-white"
            >
              Indeks Berita
            </Link>
          </div>

          {/* Mobile Menu Button with Explicit Label */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-[#64748B] bg-[#F4F6F9] px-3 text-sm font-semibold text-[#0F213E] hover:bg-[#E2E8F0] md:hidden"
          >
            {open ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{open ? "Tutup" : "Menu"}</span>
          </button>
        </div>
      </div>

      {/* Tier 3: Deep Institutional Navy Category Rubric Bar (Desktop) */}
      <nav
        aria-label="Rubrik portal hukum"
        className="hidden bg-[#142D55] text-white md:block"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-1 px-6 text-sm">
          <Link
            href="/"
            aria-current={isActive("/") ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center border-b-2 px-3.5 font-semibold transition-colors",
              isActive("/")
                ? "border-[#D4A72C] text-[#F5D061]"
                : "border-transparent text-white hover:bg-[#0F213E]"
            )}
          >
            Beranda
          </Link>
          <Link
            href="/berita"
            aria-current={pathname === "/berita" ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center border-b-2 px-3.5 font-medium transition-colors",
              pathname === "/berita"
                ? "border-[#D4A72C] font-semibold text-[#F5D061]"
                : "border-transparent text-white hover:bg-[#0F213E]"
            )}
          >
            Berita Terbaru
          </Link>
          {categories.slice(0, 6).map((cat) => {
            const href = `/kategori/${cat.slug}`;
            const active = isActive(href);
            return (
              <Link
                key={cat.id}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center border-b-2 px-3.5 font-medium transition-colors",
                  active
                    ? "border-[#D4A72C] font-semibold text-[#F5D061]"
                    : "border-transparent text-white hover:bg-[#0F213E]"
                )}
              >
                {cat.name}
              </Link>
            );
          })}
          <Link
            href="/galeri"
            aria-current={isActive("/galeri") ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center border-b-2 px-3.5 font-medium transition-colors",
              isActive("/galeri")
                ? "border-[#D4A72C] font-semibold text-[#F5D061]"
                : "border-transparent text-white hover:bg-[#0F213E]"
            )}
          >
            Galeri
          </Link>
          <Link
            href="/tentang"
            aria-current={isActive("/tentang") ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center border-b-2 px-3.5 font-medium transition-colors",
              isActive("/tentang")
                ? "border-[#D4A72C] font-semibold text-[#F5D061]"
                : "border-transparent text-white hover:bg-[#0F213E]"
            )}
          >
            Tentang
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div
          id="mobile-nav-menu"
          className="border-b border-[#DCE2EA] bg-white px-4 py-4 md:hidden"
        >
          <form
            action="/berita"
            method="GET"
            className="mb-4 flex gap-2"
            onSubmit={() => setOpen(false)}
          >
            <label htmlFor="mobile-search-input" className="sr-only">
              Cari berita
            </label>
            <input
              id="mobile-search-input"
              type="search"
              name="search"
              placeholder="Cari berita hukum..."
              className="min-h-11 flex-1 rounded-md border border-[#64748B] bg-[#F4F6F9] px-3 text-sm text-[#111827] placeholder:text-[#475569]"
            />
            <button
              type="submit"
              className="min-h-11 rounded-md bg-[#0B4F9C] px-4 text-sm font-semibold text-white"
            >
              Cari
            </button>
          </form>

          <div className="flex flex-col gap-1 text-sm">
            {[
              { href: "/", label: "Beranda" },
              { href: "/berita", label: "Berita Terbaru" },
              ...categories.map((c) => ({
                href: `/kategori/${c.slug}`,
                label: c.name,
              })),
              { href: "/galeri", label: "Galeri Kegiatan" },
              { href: "/tentang", label: "Tentang HIMA" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-md px-3 font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-[#EAF2FB] font-semibold text-[#0B4F9C]"
                    : "text-[#111827] hover:bg-[#F4F6F9]"
                )}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-2 flex min-h-11 items-center justify-center rounded-md bg-[#0F213E] px-3 font-semibold text-white"
            >
              Masuk Redaksi
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
