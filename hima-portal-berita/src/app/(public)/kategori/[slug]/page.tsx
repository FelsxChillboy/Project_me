import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/articles/ArticleCard";

export default async function KategoriPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return <div>Kategori tidak ditemukan.</div>;
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", categoryId: category.id },
    include: { author: true, category: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <h1 className="mb-4 font-serif text-2xl font-bold">{category.name}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
