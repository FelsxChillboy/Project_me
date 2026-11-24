import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/articles/ArticleCard";

export default async function BeritaPage({ searchParams }: { searchParams: Promise<{ search?: string; category?: string; page?: string }> }) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const perPage = 10;
  const where: any = { status: "PUBLISHED" };
  if (sp.search) where.title = { contains: sp.search, mode: "insensitive" };
  if (sp.category) where.category = { slug: sp.category };
  const articles = await prisma.article.findMany({
    where,
    include: { author: true, category: true },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
  });
  return (
    <div>
      <h1 className="mb-4 font-serif text-2xl font-bold">Daftar Berita</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
