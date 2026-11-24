import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/articles/ArticleCard";

export const dynamic = "force-dynamic";

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", categoryId: category.id },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="editorial-rule-top pt-6">
      <Link
        href="/berita"
        className="mb-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[#475467] hover:text-[#14263D]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Semua Berita
      </Link>
      <div className="mb-8 border-b border-[#D8D1C3] pb-5">
        <h1 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-[#14263D]">
          Rubrik {category.name}
        </h1>
        <p className="mt-1 text-sm text-[#475467] tabular-nums">
          {articles.length} tulisan tersedia pada rubrik ini
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-12 text-center">
          <p className="font-serif text-lg font-bold text-[#14263D]">
            Belum ada tulisan di rubrik {category.name}
          </p>
          <p className="mt-1.5 text-sm text-[#475467]">
            Periksa rubrik lainnya atau lihat seluruh arsip berita redaksi.
          </p>
          <Link
            href="/berita"
            className="mt-4 inline-flex min-h-11 items-center rounded-md bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#14263D]"
          >
            Buka Arsip Berita
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
