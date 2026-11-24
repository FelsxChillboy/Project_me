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
            className="group overflow-hidden rounded-md border border-[#DCE2EA] bg-white text-left transition-colors hover:border-[#0B4F9C]"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#EAF2FB]">
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
              <span className="inline-block rounded bg-[#EAF2FB] px-2 py-0.5 text-xs font-semibold text-[#0B4F9C]">
                {item.label}
              </span>
              <p className="mt-2 line-clamp-2 font-serif text-base font-bold text-[#111827] group-hover:text-[#0B4F9C]">
                {item.title}
              </p>
              <p className="mt-1.5 text-xs text-[#475569] tabular-nums">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F213E]/80 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-md border border-[#DCE2EA] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Tutup tampilan foto"
              className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#0F213E]/85 text-white hover:bg-[#0F213E]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="bg-[#0F213E]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.imageUrl}
                alt={selected.title}
                className="max-h-[65vh] w-full object-contain"
              />
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold text-[#0B4F9C] tabular-nums">
                {selected.label}, {formatDate(selected.date)}
              </p>
              <h3 className="mt-1 font-serif text-2xl font-bold text-[#111827]">
                {selected.title}
              </h3>
              {selected.caption && (
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  {selected.caption}
                </p>
              )}
              {selected.articleSlug && (
                <Link
                  href={`/berita/${selected.articleSlug}`}
                  className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-md bg-[#0B4F9C] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F213E]"
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
