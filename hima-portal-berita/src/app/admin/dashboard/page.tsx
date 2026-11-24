import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const whereScope =
    session.user.role === "PENULIS" ? { authorId: session.user.id } : {};

  const [total, published, draft, viewsAgg, recent] = await Promise.all([
    prisma.article.count({ where: whereScope }),
    prisma.article.count({ where: { ...whereScope, status: "PUBLISHED" } }),
    prisma.article.count({ where: { ...whereScope, status: "DRAFT" } }),
    prisma.article.aggregate({ where: whereScope, _sum: { views: true } }),
    prisma.article.findMany({
      where: whereScope,
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Total Artikel", value: total },
    { label: "Terpublikasi", value: published },
    { label: "Draf", value: draft },
    { label: "Total Pembaca", value: viewsAgg._sum.views || 0 },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#D8D1C3] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#14263D]">
            Meja Redaksi
          </h1>
          <p className="mt-0.5 text-sm text-[#475467]">
            Masuk sebagai {session.user.name}
          </p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#14263D]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tulis Berita Baru
        </Link>
      </div>

      <dl className="grid grid-cols-2 divide-y divide-[#D8D1C3] rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {stats.map((s) => (
          <div key={s.label} className="p-5">
            <dt className="text-xs font-semibold text-[#475467]">{s.label}</dt>
            <dd className="mt-1.5 font-serif text-3xl font-bold text-[#14263D] tabular-nums">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 rounded-lg border border-[#D8D1C3] bg-[#FFFDF9]">
        <div className="flex items-center justify-between border-b border-[#D8D1C3] px-5 py-4">
          <h2 className="font-serif text-lg font-bold text-[#14263D]">
            Tulisan Terbaru
          </h2>
          <Link
            href="/admin/berita"
            className="text-sm font-semibold text-[#1E3A5F] hover:underline"
          >
            Kelola Semua
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#475467]">
              Belum ada artikel yang tersimpan. Mulai tulis berita pertama Anda.
            </p>
            <Link
              href="/admin/berita/tambah"
              className="mt-3 inline-flex min-h-11 items-center rounded-md border border-[#8C8272] bg-[#F7F4EE] px-4 py-2 text-sm font-semibold text-[#14263D] hover:bg-[#EFECE4]"
            >
              Buat Tulisan Pertama
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[#ECE6D9]">
            {recent.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-[#F7F4EE]"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/berita/edit/${a.id}`}
                    className="block truncate font-serif text-base font-bold text-[#14263D] hover:text-[#1E3A5F] hover:underline"
                  >
                    {a.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-[#475467] tabular-nums">
                    {a.category.name}, {a.author.name}, {formatDate(a.createdAt)},{" "}
                    {a.views} dibaca
                  </p>
                </div>
                <Badge variant={a.status === "PUBLISHED" ? "green" : "gray"}>
                  {a.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
