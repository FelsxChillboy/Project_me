"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ExternalLink, Search, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import type { ArticleWithRelations } from "@/types";

interface AdminArticleTableProps {
  initialArticles: ArticleWithRelations[];
}

const PER_PAGE = 10;

export function AdminArticleTable({ initialArticles }: AdminArticleTableProps) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<ArticleWithRelations | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = articles.filter((a) => {
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/articles/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal menghapus berita");
      } else {
        const title = deleteTarget.title;
        setArticles((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        setDeleteTarget(null);
        setSuccessMsg(`Berita "${title}" berhasil dihapus.`);
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan saat menghapus berita.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900"
        >
          {error}
        </div>
      )}
      {successMsg && (
        <div
          role="status"
          className="mb-4 flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          {successMsg}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <label htmlFor="admin-article-search" className="sr-only">
            Cari judul atau kategori berita
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#475467]"
            aria-hidden="true"
          />
          <Input
            id="admin-article-search"
            className="pl-9"
            placeholder="Cari judul atau kategori..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div>
          <label htmlFor="admin-status-filter" className="sr-only">
            Filter status berita
          </label>
          <select
            id="admin-status-filter"
            className="min-h-11 rounded-md border border-[#8C8272] bg-[#FFFDF9] px-3 py-2 text-sm text-[#14263D] focus:border-[#1E3A5F]"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "ALL" | "PUBLISHED" | "DRAFT");
              setPage(1);
            }}
          >
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#D8D1C3] bg-[#FFFDF9]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#D8D1C3] bg-[#F2EDE1] text-left text-xs font-semibold text-[#14263D]">
              <th className="p-3.5">Judul</th>
              <th className="p-3.5">Kategori</th>
              <th className="p-3.5">Penulis</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Dibaca</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECE6D9]">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#475467]">
                  Tidak ada berita yang cocok dengan filter saat ini.
                </td>
              </tr>
            ) : (
              paginated.map((a) => (
                <tr key={a.id} className="hover:bg-[#F7F4EE]">
                  <td className="p-3.5">
                    <p className="font-medium text-[#14263D]">{a.title}</p>
                    <p className="text-xs text-[#475467] tabular-nums">
                      {formatDate(a.createdAt)}
                    </p>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="gold">{a.category.name}</Badge>
                  </td>
                  <td className="p-3.5 text-[#475467]">{a.author.name}</td>
                  <td className="p-3.5">
                    <Badge variant={a.status === "PUBLISHED" ? "green" : "gray"}>
                      {a.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-[#475467] tabular-nums">{a.views}</td>
                  <td className="p-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {a.status === "PUBLISHED" && (
                        <Link
                          href={`/berita/${a.slug}`}
                          target="_blank"
                          aria-label={`Lihat ${a.title} di portal`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#475467] hover:bg-[#EFECE4] hover:text-[#14263D]"
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/berita/edit/${a.id}`}
                        aria-label={`Edit ${a.title}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#1E3A5F] hover:bg-[#EFECE4]"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Hapus ${a.title}`}
                        onClick={() => setDeleteTarget(a)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#475467]">
          <span className="tabular-nums">
            Menampilkan {(safePage - 1) * PER_PAGE + 1} sampai{" "}
            {Math.min(safePage * PER_PAGE, filtered.length)} dari {filtered.length}{" "}
            berita
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
            >
              Sebelumnya
            </Button>
            <span className="text-xs tabular-nums">
              Hal {safePage}/{totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Hapus Berita"
      >
        <p className="text-sm text-[#475467]">
          Yakin ingin menghapus berita{" "}
          <strong className="text-[#14263D]">{deleteTarget?.title}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Batal
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
