import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  GalleryGrid,
  type PublicPhotoItem,
} from "@/components/articles/GalleryGrid";

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const [galleryItems, articleItems] = await Promise.all([
    prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        thumbnail: { not: null },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnail: true,
        publishedAt: true,
        createdAt: true,
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
  ]);

  const photos: PublicPhotoItem[] = [
    ...galleryItems.map((g) => ({
      id: `gal-${g.id}`,
      title: g.title,
      caption: g.caption,
      imageUrl: g.imageUrl,
      label: "Dokumentasi",
      date: g.createdAt.toISOString(),
    })),
    ...articleItems
      .filter((a) => Boolean(a.thumbnail))
      .map((a) => ({
        id: `art-${a.id}`,
        title: a.title,
        caption: a.excerpt,
        imageUrl: a.thumbnail!,
        label: a.category.name,
        date: (a.publishedAt || a.createdAt).toISOString(),
        articleSlug: a.slug,
      })),
  ];

  return (
    <div className="editorial-rule-top pt-6">
      <div className="mb-8 border-b border-[#D8D1C3] pb-5">
        <h1 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-[#14263D]">
          Galeri Kegiatan
        </h1>
        <p className="mt-1 text-sm text-[#475467]">
          Arsip foto seminar, diskusi hukum, dan kegiatan lapangan HIMA Ilmu Hukum
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-12 text-center">
          <ImageIcon className="h-10 w-10 text-[#8C8272]" aria-hidden="true" />
          <p className="mt-3 font-serif text-lg font-bold text-[#14263D]">
            Belum ada foto dokumentasi
          </p>
          <p className="mt-1 max-w-md text-sm text-[#475467]">
            Pengurus redaksi dapat mengunggah dokumentasi melalui menu Kelola
            Galeri, atau foto thumbnail berita akan muncul otomatis di halaman ini.
          </p>
          <Link
            href="/berita"
            className="mt-5 inline-flex min-h-11 items-center rounded-md border border-[#8C8272] bg-[#F7F4EE] px-4 py-2 text-sm font-semibold text-[#14263D] hover:bg-[#EFECE4]"
          >
            Baca Arsip Berita
          </Link>
        </div>
      ) : (
        <GalleryGrid photos={photos} />
      )}
    </div>
  );
}
