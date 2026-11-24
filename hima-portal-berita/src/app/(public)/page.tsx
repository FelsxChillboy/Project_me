import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/articles/ArticleCard";

export default async function HomePage() {
  const latest = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { author: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  const mostViewed = await prisma.article.findFirst({
    where: { status: "PUBLISHED" },
    include: { author: true, category: true },
    orderBy: { views: "desc" },
  });

  return (
    <div>
      <section className="mb-8 rounded-lg bg-[#1E3A5F] p-8 text-white">
        <h1 className="font-serif text-3xl font-bold">HIMA Ilmu Hukum</h1>
        <p className="mt-2">Portal berita, pengumuman, dan kegiatan Himpunan Mahasiswa Ilmu Hukum.</p>
      </section>
      <h2 className="mb-4 font-serif text-2xl font-bold">Berita Terbaru</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {latest.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
      {mostViewed && (
        <section className="mt-8">
          <h2 className="mb-4 font-serif text-2xl font-bold">Paling Banyak Dibaca</h2>
          <ArticleCard article={mostViewed} />
        </section>
      )}
    </div>
  );
}
