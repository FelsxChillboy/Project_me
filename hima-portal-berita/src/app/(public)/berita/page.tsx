import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { PortalSidebar } from "@/components/articles/PortalSidebar";

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
  const perPage = 10;

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

  const [articles, total, popular, categories] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.article.count({ where }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        publishedAt: true,
        createdAt: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: { views: "desc" },
      take: 5,
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { status: "PUBLISHED" } } },
        },
      },
      orderBy: { name: "asc" },
    }),
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <section className="rounded-md border border-[#DCE2EA] bg-white p-5 md:p-6">
          <div className="portal-section-heading flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#111827] md:text-3xl">
                <span className="text-[#0B4F9C]">Indeks</span> Berita
              </h1>
              <p className="mt-1 text-xs text-[#475569] tabular-nums">
                Menampilkan {total} berita dipublikasikan
              </p>
            </div>

            <form action="/berita" method="GET" className="flex w-full gap-2 sm:w-auto">
              {categorySlug && (
                <input type="hidden" name="category" value={categorySlug} />
              )}
              <label htmlFor="search-berita" className="sr-only">
                Cari judul atau ringkasan berita
              </label>
              <div className="relative flex-1 sm:w-64">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#475569]"
                  aria-hidden="true"
                />
                <input
                  id="search-berita"
                  type="search"
                  name="search"
                  defaultValue={search}
                  placeholder="Cari judul berita..."
                  className="min-h-11 w-full rounded-md border border-[#64748B] bg-[#F4F6F9] py-2 pr-3 pl-9 text-sm text-[#111827] placeholder:text-[#475569] focus:border-[#0B4F9C] focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="min-h-11 rounded-md bg-[#0B4F9C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0F213E]"
              >
                Cari
              </button>
            </form>
          </div>

          {/* Category Filter */}
          <div
            role="navigation"
            aria-label="Filter kategori berita"
            className="mt-4 flex flex-wrap gap-2 border-b border-[#E2E8F0] pb-4"
          >
            <Link
              href={buildUrl({ search })}
              className={`inline-flex min-h-10 items-center rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${
                !categorySlug
                  ? "border-[#0F213E] bg-[#0F213E] text-white"
                  : "border-[#DCE2EA] bg-[#F4F6F9] text-[#111827] hover:border-[#0B4F9C] hover:text-[#0B4F9C]"
              }`}
            >
              Semua Rubrik
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={buildUrl({ search, category: cat.slug })}
                className={`inline-flex min-h-10 items-center rounded border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  categorySlug === cat.slug
                    ? "border-[#0F213E] bg-[#0F213E] text-white"
                    : "border-[#DCE2EA] bg-[#F4F6F9] text-[#111827] hover:border-[#0B4F9C] hover:text-[#0B4F9C]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {articles.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-serif text-lg font-bold text-[#111827]">
                Tidak ada tulisan yang cocok
              </p>
              <p className="mt-1.5 text-sm text-[#475569]">
                {search || categorySlug
                  ? "Coba ubah kata kunci pencarian atau pilih rubrik lainnya."
                  : "Redaksi belum mempublikasikan berita apa pun."}
              </p>
              {(search || categorySlug) && (
                <Link
                  href="/berita"
                  className="mt-4 inline-flex min-h-11 items-center rounded-md border border-[#64748B] bg-[#F4F6F9] px-4 py-2 text-sm font-semibold text-[#111827] hover:bg-[#E2E8F0]"
                >
                  Tampilkan Semua Berita
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-2 divide-y divide-[#E2E8F0]">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} variant="horizontal" />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Navigasi halaman arsip"
              className="mt-6 flex items-center justify-center gap-3 border-t border-[#E2E8F0] pt-5 text-sm"
            >
              {page > 1 && (
                <Link
                  href={buildUrl({
                    search,
                    category: categorySlug,
                    page: page - 1,
                  })}
                  className="inline-flex min-h-11 items-center rounded-md border border-[#64748B] bg-white px-4 py-2 font-semibold text-[#111827] hover:bg-[#F4F6F9]"
                >
                  Sebelumnya
                </Link>
              )}
              <span className="px-3 py-2 text-[#475569] tabular-nums">
                Halaman {page} dari {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={buildUrl({
                    search,
                    category: categorySlug,
                    page: page + 1,
                  })}
                  className="inline-flex min-h-11 items-center rounded-md border border-[#64748B] bg-white px-4 py-2 font-semibold text-[#111827] hover:bg-[#F4F6F9]"
                >
                  Berikutnya
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>

      <div className="lg:col-span-4">
        <PortalSidebar popular={popular} categories={categories} />
      </div>
    </div>
  );
}
