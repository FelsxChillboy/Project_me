import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, Eye, User, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ShareButtons } from "@/components/articles/ShareButtons";
import { PortalSidebar } from "@/components/articles/PortalSidebar";

export const dynamic = "force-dynamic";

function estimateReadingMinutes(html: string): number {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      excerpt: true,
      thumbnail: true,
      publishedAt: true,
      createdAt: true,
    },
  });
  if (!article) {
    return { title: "Berita Tidak Ditemukan" };
  }
  return {
    title: article.title,
    description: article.excerpt || undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt || undefined,
      publishedTime: (article.publishedAt || article.createdAt).toISOString(),
      images: article.thumbnail ? [{ url: article.thumbnail }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || undefined,
      images: article.thumbnail ? [article.thumbnail] : undefined,
    },
  };
}

export default async function DetailBerita({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!article) notFound();

  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  });

  const [related, popular, categories] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        categoryId: article.categoryId,
        id: { not: article.id },
      },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
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

  const safeContent = sanitizeArticleHtml(article.content);
  const readingMinutes = estimateReadingMinutes(safeContent);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Main Legal Reading Column (~67%) */}
      <div className="space-y-8 lg:col-span-8">
        <article className="rounded-md border border-[#DCE2EA] bg-white p-5 md:p-9">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-[#475569]"
          >
            <Link href="/" className="hover:text-[#0B4F9C] hover:underline">
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <Link
              href={`/kategori/${article.category.slug}`}
              className="font-semibold text-[#0B4F9C] hover:underline"
            >
              {article.category.name}
            </Link>
          </nav>

          <h1 className="font-serif text-[clamp(1.65rem,3.2vw,2.5rem)] font-bold leading-[1.18] tracking-[-0.015em] text-[#111827]">
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[#E2E8F0] py-3 text-xs text-[#475569] tabular-nums">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#111827]">
              <User className="h-3.5 w-3.5 text-[#0B4F9C]" aria-hidden="true" />
              {article.author.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#0B4F9C]" aria-hidden="true" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#0B4F9C]" aria-hidden="true" />
              {readingMinutes} menit baca
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-[#0B4F9C]" aria-hidden="true" />
              {article.views + 1} kali dibaca
            </span>
          </div>

          {article.thumbnail && (
            <div className="my-6 aspect-[16/9] w-full overflow-hidden rounded border border-[#DCE2EA] bg-[#F4F6F9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.thumbnail}
                alt={article.title}
                width={960}
                height={540}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div
            className="article-content mt-6"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />

          <ShareButtons title={article.title} slug={article.slug} />

          <div className="mt-6 border-t border-[#E2E8F0] pt-4">
            <Link
              href="/berita"
              className="inline-flex min-h-10 items-center text-sm font-semibold text-[#0B4F9C] hover:underline"
            >
              Kembali ke Indeks Berita
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <section className="rounded-md border border-[#DCE2EA] bg-white p-5 md:p-6">
            <h2 className="portal-section-heading font-serif text-xl font-bold text-[#111827]">
              <span className="text-[#0B4F9C]">Berita</span> Terkait
            </h2>
            <div className="mt-2 divide-y divide-[#E2E8F0]">
              {related.map((r) => (
                <ArticleCard key={r.id} article={r} variant="horizontal" />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Legal Portal Sidebar (~33%) */}
      <div className="lg:col-span-4">
        <PortalSidebar popular={popular} categories={categories} />
      </div>
    </div>
  );
}
