import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function DetailBerita({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: true, category: true },
  });
  if (!article) return <div>Artikel tidak ditemukan.</div>;
  await prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } });
  const related = await prisma.article.findMany({
    where: { status: "PUBLISHED", categoryId: article.categoryId, id: { not: article.id } },
    include: { author: true, category: true },
    take: 3,
  });
  return (
    <article>
      <h1 className="font-serif text-3xl font-bold">{article.title}</h1>
      <p className="mt-2 text-sm text-gray-500">
        {article.author.name} · {formatDate(article.publishedAt || article.createdAt)} · {article.views + 1} views
      </p>
      {article.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.thumbnail} alt={article.title} className="my-4 w-full rounded-lg" />
      )}
      <div className="prose mt-4" dangerouslySetInnerHTML={{ __html: article.content }} />
      <h3 className="mt-8 font-serif text-xl font-bold">Berita Terkait</h3>
      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
        {related.map((r) => (
          <a key={r.id} href={`/berita/${r.slug}`} className="rounded-lg border p-3 hover:shadow">
            {r.title}
          </a>
        ))}
      </div>
    </article>
  );
}
