import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { PortalSidebar } from "@/components/articles/PortalSidebar";

export const dynamic = "force-dynamic";

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const [articles, popular, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED", categoryId: category.id },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
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

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <section className="rounded-md border border-[#DCE2EA] bg-white p-5 md:p-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex items-center gap-1.5 text-xs text-[#475569]"
          >
            <Link href="/" className="hover:text-[#0B4F9C] hover:underline">
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <Link href="/berita" className="hover:text-[#0B4F9C] hover:underline">
              Berita
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-semibold text-[#0B4F9C]">{category.name}</span>
          </nav>

          <div className="portal-section-heading">
            <h1 className="font-serif text-2xl font-bold text-[#111827] md:text-3xl">
              <span className="text-[#0B4F9C]">Rubrik</span> {category.name}
            </h1>
            <p className="mt-1 text-xs text-[#475569] tabular-nums">
              {articles.length} tulisan tersedia pada rubrik ini
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-serif text-lg font-bold text-[#111827]">
                Belum ada tulisan di rubrik {category.name}
              </p>
              <p className="mt-1.5 text-sm text-[#475569]">
                Periksa rubrik lainnya atau lihat seluruh indeks berita redaksi.
              </p>
              <Link
                href="/berita"
                className="mt-4 inline-flex min-h-11 items-center rounded-md bg-[#0B4F9C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0F213E]"
              >
                Buka Indeks Berita
              </Link>
            </div>
          ) : (
            <div className="mt-2 divide-y divide-[#E2E8F0]">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} variant="horizontal" />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-4">
        <PortalSidebar popular={popular} categories={categories} />
      </div>
    </div>
  );
}
