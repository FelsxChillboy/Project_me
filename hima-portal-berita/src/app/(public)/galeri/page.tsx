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

  const seenImageUrls = new Set(galleryItems.map((g) => g.imageUrl));

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
      .filter((a) => Boolean(a.thumbnail) && !seenImageUrls.has(a.thumbnail!))
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
    <div className="rounded-md border border-[#DCE2EA] bg-white p-5 md:p-8">
      <div className="portal-section-heading mb-6">
        <h1 className="font-serif text-2xl font-bold text-[#111827] md:text-3xl">
          <span className="text-[#0B4F9C]">Galeri</span> Kegiatan
        </h1>
        <p className="mt-1 text-sm text-[#475569]">
          Arsip foto seminar, diskusi hukum, dan kegiatan lapangan HIMA Ilmu Hukum
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded border border-[#DCE2EA] bg-[#F4F6F9] p-12 text-center">
          <ImageIcon className="h-10 w-10 text-[#64748B]" aria-hidden="true" />
          <p className="mt-3 font-serif text-lg font-bold text-[#111827]">
            Belum ada foto dokumentasi
          </p>
          <p className="mt-1 max-w-md text-sm text-[#475569]">
            Pengurus redaksi dapat mengunggah dokumentasi melalui menu Kelola
            Galeri, atau foto thumbnail berita akan muncul otomatis di halaman ini.
          </p>
          <Link
            href="/berita"
            className="mt-5 inline-flex min-h-11 items-center rounded-md bg-[#0B4F9C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0F213E]"
          >
            Buka Indeks Berita
          </Link>
        </div>
      ) : (
        <GalleryGrid photos={photos} />
      )}
    </div>
  );
}
