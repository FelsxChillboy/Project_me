"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface PublicPhotoItem {
  id: string;
  title: string;
  caption?: string | null;
  imageUrl: string;
  label: string;
  date: string;
  articleSlug?: string;
}

export function GalleryGrid({ photos }: { photos: PublicPhotoItem[] }) {
  const [selected, setSelected] = useState<PublicPhotoItem | null>(null);

  useEffect(() => {
    if (!selected) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item)}
            className="group overflow-hidden rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] text-left transition hover:-translate-y-0.5 hover:border-[#8C8272]"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#EFECE4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                width={640}
                height={480}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-[#785B0A]">
                {item.label}
              </p>
              <p className="mt-1 line-clamp-2 font-serif text-base font-bold text-[#14263D] group-hover:text-[#1E3A5F]">
                {item.title}
              </p>
              <p className="mt-1.5 text-xs text-[#475467] tabular-nums">
                {formatDate(item.date)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#14263D]/80 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Tutup tampilan foto"
              className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#14263D]/85 text-white hover:bg-[#14263D]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="bg-[#14263D]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.imageUrl}
                alt={selected.title}
                className="max-h-[65vh] w-full object-contain"
              />
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold text-[#785B0A] tabular-nums">
                {selected.label}, {formatDate(selected.date)}
              </p>
              <h3 className="mt-1 font-serif text-2xl font-bold text-[#14263D]">
                {selected.title}
              </h3>
              {selected.caption && (
                <p className="mt-2 text-sm leading-relaxed text-[#475467]">
                  {selected.caption}
                </p>
              )}
              {selected.articleSlug && (
                <Link
                  href={`/berita/${selected.articleSlug}`}
                  className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-md bg-[#1E3A5F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14263D]"
                >
                  Baca Berita Terkait
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
