"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Plus, CheckCircle2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

interface GalleryItem {
  id: string;
  title: string;
  caption: string | null;
  imageUrl: string;
  createdAt: string;
}

export function GaleriAdminClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const json = await res.json();
      if (json.success) setItems(json.data);
      else setError(json.error || "Gagal memuat galeri");
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.success) setError(json.error || "Gagal mengunggah gambar");
      else setImageUrl(json.data.url);
    } catch {
      setError("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!imageUrl) {
      setError("Unggah gambar atau masukkan URL gambar terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, caption: caption || null, imageUrl }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal menyimpan foto galeri");
      } else {
        setSuccessMsg(`Foto "${title}" berhasil ditambahkan ke galeri.`);
        setTitle("");
        setCaption("");
        setImageUrl("");
        await load();
      }
    } catch {
      setError("Terjadi kesalahan saat menyimpan foto galeri.");
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
      const res = await fetch(`/api/gallery/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal menghapus foto");
      } else {
        setSuccessMsg(`Foto "${deleteTarget.title}" berhasil dihapus.`);
        setDeleteTarget(null);
        await load();
      }
    } catch {
      setError("Terjadi kesalahan saat menghapus foto.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6 border-b border-[#D8D1C3] pb-5">
        <h1 className="font-serif text-2xl font-bold text-[#14263D]">
          Kelola Galeri Kegiatan
        </h1>
        <p className="mt-0.5 text-sm text-[#475467]">
          Unggah foto dokumentasi kegiatan HIMA Ilmu Hukum untuk ditampilkan di halaman Galeri
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
        className="mb-8 space-y-4 rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-5"
      >
        <h2 className="font-serif text-base font-bold text-[#14263D]">
          Tambah Foto Baru
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="gallery-title" className="mb-1 block text-xs font-medium text-[#14263D]">
              Judul Kegiatan / Foto
            </label>
            <Input
              id="gallery-title"
              placeholder="Judul kegiatan atau foto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="gallery-caption" className="mb-1 block text-xs font-medium text-[#14263D]">
              Keterangan Singkat (Opsional)
            </label>
            <Input
              id="gallery-caption"
              placeholder="Keterangan singkat"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-[#8C8272] bg-[#F7F4EE] px-3.5 py-2 text-sm font-medium text-[#14263D] hover:bg-[#EFECE4]">
            <Upload className="h-4 w-4" aria-hidden="true" />
            {uploading ? "Mengunggah..." : "Upload Foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          <label htmlFor="gallery-url" className="sr-only">
            URL Foto
          </label>
          <Input
            id="gallery-url"
            className="flex-1"
            placeholder="Atau tempel URL foto (https://...)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button type="submit" disabled={submitting || uploading}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Simpan Foto
          </Button>
        </div>

        {imageUrl && (
          <div className="overflow-hidden rounded-lg border border-[#D8D1C3] bg-[#EFECE4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Preview"
              className="max-h-52 w-full object-cover"
            />
          </div>
        )}
      </form>

      {loading ? (
        <p className="rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-8 text-center text-sm text-[#475467]">
          Memuat galeri...
        </p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-12 text-center">
          <ImageIcon className="h-10 w-10 text-[#8C8272]" aria-hidden="true" />
          <p className="mt-3 text-sm text-[#475467]">
            Belum ada foto galeri khusus yang diunggah.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg border border-[#D8D1C3] bg-[#FFFDF9]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#EFECE4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  width={640}
                  height={480}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-2 p-3.5">
                <div className="min-w-0">
                  <p className="truncate font-serif font-bold text-[#14263D]">
                    {item.title}
                  </p>
                  {item.caption && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-[#475467]">
                      {item.caption}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[#475467] tabular-nums">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Hapus foto ${item.title}`}
                  onClick={() => setDeleteTarget(item)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Foto Galeri"
      >
        <p className="text-sm text-[#475467]">
          Yakin ingin menghapus foto{" "}
          <strong className="text-[#14263D]">{deleteTarget?.title}</strong>?
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
