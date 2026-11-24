import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const total = await prisma.article.count();
  const published = await prisma.article.count({ where: { status: "PUBLISHED" } });
  const draft = await prisma.article.count({ where: { status: "DRAFT" } });
  const viewsAgg = await prisma.article.aggregate({ _sum: { views: true } });
  const recent = await prisma.article.findMany({
    include: { author: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded border bg-white p-4">Total Artikel: {total}</div>
        <div className="rounded border bg-white p-4">Published: {published}</div>
        <div className="rounded border bg-white p-4">Draft: {draft}</div>
        <div className="rounded border bg-white p-4">Total Views: {viewsAgg._sum.views || 0}</div>
      </div>
      <h2 className="mt-6 font-serif text-xl font-bold">5 Artikel Terbaru</h2>
      <ul className="mt-2 space-y-2">
        {recent.map((a) => (
          <li key={a.id} className="rounded border bg-white p-3">
            {a.title} — {a.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
