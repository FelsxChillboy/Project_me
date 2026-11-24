import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Eye, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ShareButtons } from "@/components/articles/ShareButtons";

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

  const related = await prisma.article.findMany({
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
    take: 3,
  });

  const safeContent = sanitizeArticleHtml(article.content);
  const readingMinutes = estimateReadingMinutes(safeContent);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/berita"
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[#475467] hover:text-[#14263D]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke Arsip Berita
      </Link>

      <article className="editorial-rule-top rounded-b-lg border border-t-0 border-[#D8D1C3] bg-[#FFFDF9] p-6 md:p-12">
        <Link
          href={`/kategori/${article.category.slug}`}
          className="text-xs font-semibold text-[#785B0A] hover:underline"
        >
          {article.category.name}
        </Link>

        <h1 className="mt-2 font-serif text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.18] tracking-[-0.02em] text-[#14263D]">
          {article.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[#D8D1C3] py-3.5 text-sm text-[#475467] tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4 text-[#1E3A5F]" aria-hidden="true" />
            {article.author.name}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#1E3A5F]" aria-hidden="true" />
            {formatDate(article.publishedAt || article.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#1E3A5F]" aria-hidden="true" />
            {readingMinutes} menit baca
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-[#1E3A5F]" aria-hidden="true" />
            {article.views + 1} kali dibaca
          </span>
        </div>

        {article.thumbnail && (
          <div className="my-7 aspect-[16/10] w-full overflow-hidden rounded-md border border-[#D8D1C3] bg-[#EFECE4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.thumbnail}
              alt={article.title}
              width={960}
              height={600}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div
          className="article-content mx-auto mt-7"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />

        <ShareButtons title={article.title} slug={article.slug} />
      </article>

      {related.length > 0 && (
        <section className="mt-12 border-t border-[#D8D1C3] pt-8">
          <h2 className="mb-5 font-serif text-2xl font-bold text-[#14263D]">
            Berita Terkait
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ArticleCard key={r.id} article={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
