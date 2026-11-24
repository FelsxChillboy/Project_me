import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminArticleTable } from "@/components/admin/AdminArticleTable";

export const dynamic = "force-dynamic";

export default async function AdminBeritaPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const whereScope =
    session.user.role === "PENULIS" ? { authorId: session.user.id } : {};

  const articles = await prisma.article.findMany({
    where: whereScope,
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = articles.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
  }));

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#D8D1C3] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#14263D]">
            Kelola Berita
          </h1>
          <p className="mt-0.5 text-sm text-[#475467]">
            {session.user.role === "PENULIS"
              ? "Daftar berita yang Anda tulis"
              : "Kelola seluruh berita dan pengumuman portal"}
          </p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#14263D]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah Berita Baru
        </Link>
      </div>

      <AdminArticleTable initialArticles={serialized} />
    </div>
  );
}
