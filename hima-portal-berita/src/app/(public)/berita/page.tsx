import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/articles/ArticleCard";

export const dynamic = "force-dynamic";

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.search?.trim() || "";
  const categorySlug = sp.category?.trim() || "";
  const rawPage = parseInt(sp.page || "1", 10);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const perPage = 9;

  const where: Prisma.ArticleWhereInput = { status: "PUBLISHED" };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  const [articles, total, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.article.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  function buildUrl(params: {
    search?: string;
    category?: string;
    page?: number;
  }) {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.category) qs.set("category", params.category);
    if (params.page && params.page > 1) qs.set("page", String(params.page));
    const str = qs.toString();
    return str ? `/berita?${str}` : "/berita";
  }

  return (
    <div className="editorial-rule-top pt-6">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#D8D1C3] pb-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight text-[#14263D]">
            Arsip Berita
          </h1>
          <p className="mt-1 text-sm text-[#475467] tabular-nums">
            {total} tulisan dipublikasikan oleh redaksi HIMA Ilmu Hukum
          </p>
        </div>

        <form action="/berita" method="GET" className="flex w-full gap-2 md:w-auto">
          {categorySlug && (
            <input type="hidden" name="category" value={categorySlug} />
          )}
          <label htmlFor="search-berita" className="sr-only">
            Cari judul atau ringkasan berita
          </label>
          <div className="relative flex-1 md:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#475467]"
              aria-hidden="true"
            />
            <input
              id="search-berita"
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Cari judul berita..."
              className="min-h-11 w-full rounded-md border border-[#8C8272] bg-[#FFFDF9] py-2 pr-3 pl-9 text-sm text-[#14263D] placeholder:text-[#5B6472] focus:border-[#1E3A5F]"
            />
          </div>
          <button
            type="submit"
            className="min-h-11 rounded-md bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#14263D]"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Category Filter */}
      <div
        role="navigation"
        aria-label="Filter kategori berita"
        className="mb-8 flex flex-wrap gap-2"
      >
        <Link
          href={buildUrl({ search })}
          className={`inline-flex min-h-10 items-center rounded border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            !categorySlug
              ? "border-[#14263D] bg-[#14263D] text-white"
              : "border-[#D8D1C3] bg-[#FFFDF9] text-[#14263D] hover:border-[#1E3A5F]"
          }`}
        >
          Semua Rubrik
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={buildUrl({ search, category: cat.slug })}
            className={`inline-flex min-h-10 items-center rounded border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              categorySlug === cat.slug
                ? "border-[#14263D] bg-[#14263D] text-white"
                : "border-[#D8D1C3] bg-[#FFFDF9] text-[#14263D] hover:border-[#1E3A5F]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-12 text-center">
          <p className="font-serif text-lg font-bold text-[#14263D]">
            Tidak ada tulisan yang cocok
          </p>
          <p className="mt-1.5 text-sm text-[#475467]">
            {search || categorySlug
              ? "Coba ubah kata kunci pencarian atau pilih rubrik lainnya."
              : "Redaksi belum mempublikasikan berita apa pun."}
          </p>
          {(search || categorySlug) && (
            <Link
              href="/berita"
              className="mt-4 inline-flex min-h-11 items-center rounded-md border border-[#8C8272] bg-[#F7F4EE] px-4 py-2 text-sm font-semibold text-[#14263D] hover:bg-[#EFECE4]"
            >
              Tampilkan Semua Berita
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Navigasi halaman arsip"
          className="mt-10 flex items-center justify-center gap-3 text-sm"
        >
          {page > 1 && (
            <Link
              href={buildUrl({ search, category: categorySlug, page: page - 1 })}
              className="inline-flex min-h-11 items-center rounded-md border border-[#8C8272] bg-[#FFFDF9] px-4 py-2 font-semibold text-[#14263D] hover:bg-[#EFECE4]"
            >
              Sebelumnya
            </Link>
          )}
          <span className="px-3 py-2 text-[#475467] tabular-nums">
            Halaman {page} dari {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildUrl({ search, category: categorySlug, page: page + 1 })}
              className="inline-flex min-h-11 items-center rounded-md border border-[#8C8272] bg-[#FFFDF9] px-4 py-2 font-semibold text-[#14263D] hover:bg-[#EFECE4]"
            >
              Berikutnya
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
