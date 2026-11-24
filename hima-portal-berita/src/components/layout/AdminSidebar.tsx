"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Newspaper,
  Tags,
  Image as ImageIcon,
  Users,
  UserCog,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import type { Role } from "@prisma/client";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: Role;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const contentItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["SUPER_ADMIN", "EDITOR", "PENULIS"] as Role[],
    },
    {
      href: "/admin/berita",
      label: "Kelola Berita",
      icon: Newspaper,
      roles: ["SUPER_ADMIN", "EDITOR", "PENULIS"] as Role[],
    },
    {
      href: "/admin/kategori",
      label: "Kelola Kategori",
      icon: Tags,
      roles: ["SUPER_ADMIN", "EDITOR"] as Role[],
    },
    {
      href: "/admin/galeri",
      label: "Kelola Galeri",
      icon: ImageIcon,
      roles: ["SUPER_ADMIN", "EDITOR"] as Role[],
    },
  ].filter((item) => item.roles.includes(user.role));

  const settingsItems = [
    {
      href: "/admin/pengguna",
      label: "Kelola Pengguna",
      icon: Users,
      roles: ["SUPER_ADMIN"] as Role[],
    },
    {
      href: "/admin/profil",
      label: "Profil dan Password",
      icon: UserCog,
      roles: ["SUPER_ADMIN", "EDITOR", "PENULIS"] as Role[],
    },
  ].filter((item) => item.roles.includes(user.role));

  function renderNavGroup(
    label: string,
    items: typeof contentItems
  ) {
    if (items.length === 0) return null;
    return (
      <div className="mt-5 first:mt-0">
        <p className="mb-1.5 px-3 text-xs font-semibold text-[#785B0A]">
          {label}
        </p>
        <div className="flex flex-col gap-1 text-sm">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2.5 rounded-md px-3 font-medium transition-colors",
                  active
                    ? "bg-[#14263D] font-semibold text-white"
                    : "text-[#14263D] hover:bg-[#EFECE4]"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-[#F0D57A]" : "text-[#475467]"
                  )}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div>
        <div className="mb-5 border-b border-[#D8D1C3] pb-4">
          <Link
            href="/admin/dashboard"
            className="font-serif text-lg font-bold text-[#14263D]"
          >
            Redaksi HIMA Hukum
          </Link>
          <p className="mt-1 truncate text-xs text-[#475467]">
            {user.name || user.email}
          </p>
          <span className="mt-1.5 inline-block rounded border border-[#D4BA6A] bg-[#EFE4C0] px-2 py-0.5 text-[11px] font-semibold text-[#5C4507]">
            {user.role.replace("_", " ")}
          </span>
        </div>

        <nav aria-label="Navigasi admin">
          {renderNavGroup("Redaksi", contentItems)}
          {renderNavGroup("Pengaturan", settingsItems)}
        </nav>
      </div>

      <div className="space-y-1 border-t border-[#D8D1C3] pt-4 text-sm">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5 rounded-md px-3 font-medium text-[#14263D] transition-colors hover:bg-[#EFECE4]"
        >
          <ExternalLink className="h-4 w-4 text-[#475467]" aria-hidden="true" />
          Lihat Portal
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex min-h-11 w-full items-center gap-2.5 rounded-md px-3 text-left font-medium text-red-700 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-[#D8D1C3] bg-[#FFFDF9] px-4 py-2.5 md:hidden">
        <span className="font-serif text-base font-bold text-[#14263D]">
          Redaksi HIMA Hukum
        </span>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-drawer"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-[#D8D1C3] bg-[#F7F4EE] px-3 text-sm font-medium text-[#14263D] hover:bg-[#EFECE4]"
        >
          {mobileOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{mobileOpen ? "Tutup" : "Menu"}</span>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          id="admin-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi admin"
          className="fixed inset-0 z-40 flex md:hidden"
        >
          <div className="w-64 border-r border-[#D8D1C3] bg-[#FFFDF9] shadow-xl">
            {sidebarContent}
          </div>
          <div
            className="flex-1 bg-[#14263D]/45"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[#D8D1C3] bg-[#FFFDF9] md:block">
        {sidebarContent}
      </aside>
    </>
  );
}
