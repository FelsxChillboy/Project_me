"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import type { CategorySummary } from "@/types";

export function KategoriAdminClient() {
  const [items, setItems] = useState<CategorySummary[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editTarget, setEditTarget] = useState<CategorySummary | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CategorySummary | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setItems(json.data);
      else setError(json.error || "Gagal memuat kategori");
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal menambahkan kategori");
      } else {
        setSuccessMsg(`Kategori "${name}" berhasil ditambahkan.`);
        setName("");
        await load();
      }
    } catch {
      setError("Terjadi kesalahan saat menambahkan kategori.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    setError("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/categories/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal memperbarui kategori");
      } else {
        setSuccessMsg(`Kategori "${editName}" berhasil diperbarui.`);
        setEditTarget(null);
        await load();
      }
    } catch {
      setError("Terjadi kesalahan saat memperbarui kategori.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setError("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal menghapus kategori");
        setDeleteTarget(null);
      } else {
        setSuccessMsg(`Kategori "${deleteTarget.name}" berhasil dihapus.`);
        setDeleteTarget(null);
        await load();
      }
    } catch {
      setError("Terjadi kesalahan saat menghapus kategori.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 border-b border-[#D8D1C3] pb-5">
        <h1 className="font-serif text-2xl font-bold text-[#14263D]">
          Kelola Kategori
        </h1>
        <p className="mt-0.5 text-sm text-[#475467]">
          Tambah, ubah, atau hapus rubrik berita (khusus Editor dan Super Admin)
        </p>
      </div>

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

      <form
        onSubmit={handleAdd}
        className="mb-6 flex flex-wrap gap-2 rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-4 sm:flex-nowrap"
      >
        <label htmlFor="new-category-name" className="sr-only">
          Nama kategori baru
        </label>
        <Input
          id="new-category-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kategori baru (mis. Kajian Hukum)"
          required
        />
        <Button type="submit" disabled={submitting} className="shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-[#D8D1C3] bg-[#FFFDF9]">
        {loading ? (
          <p className="p-6 text-center text-sm text-[#475467]">
            Memuat kategori...
          </p>
        ) : items.length === 0 ? (
          <p className="p-6 text-center text-sm text-[#475467]">
            Belum ada kategori. Tambahkan kategori pertama melalui formulir di atas.
          </p>
        ) : (
          <ul className="divide-y divide-[#ECE6D9]">
            {items.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-[#F7F4EE]"
              >
                <div>
                  <p className="font-medium text-[#14263D]">{c.name}</p>
                  <p className="text-xs text-[#475467]">/{c.slug}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="gray" className="tabular-nums">
                    {c._count?.articles ?? 0} berita
                  </Badge>
                  <button
                    type="button"
                    aria-label={`Edit kategori ${c.name}`}
                    onClick={() => {
                      setEditTarget(c);
                      setEditName(c.name);
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#1E3A5F] hover:bg-[#EFECE4]"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus kategori ${c.name}`}
                    onClick={() => setDeleteTarget(c)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Kategori"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-category-name"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Nama Kategori
            </label>
            <Input
              id="edit-category-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditTarget(null)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Kategori"
      >
        <p className="text-sm text-[#475467]">
          Yakin ingin menghapus kategori{" "}
          <strong className="text-[#14263D]">{deleteTarget?.name}</strong>?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={submitting}
          >
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={submitting}>
            {submitting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
