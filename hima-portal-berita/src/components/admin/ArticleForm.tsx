"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/utils";
import type { CategorySummary } from "@/types";

interface ArticleFormProps {
  mode: "create" | "edit";
  articleId?: string;
}

export function ArticleForm({ mode, articleId }: ArticleFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadInitial() {
      try {
        const catRes = await fetch("/api/categories");
        const catJson = await catRes.json();
        if (active && catJson.success) {
          setCategories(catJson.data);
          if (mode === "create" && catJson.data.length > 0) {
            setCategoryId((prev) => prev || catJson.data[0].id);
          }
        }

        if (mode === "edit" && articleId) {
          const artRes = await fetch(`/api/articles/${articleId}`);
          const artJson = await artRes.json();
          if (active) {
            if (artJson.success) {
              setTitle(artJson.data.title || "");
              setSlug(artJson.data.slug || "");
              setExcerpt(artJson.data.excerpt || "");
              setContent(artJson.data.content || "");
              setThumbnail(artJson.data.thumbnail || "");
              setCategoryId(artJson.data.categoryId || "");
              setStatus(artJson.data.status || "DRAFT");
            } else {
              setError(artJson.error || "Gagal memuat berita");
            }
          }
        }
      } catch {
        if (active) setError("Gagal memuat data awal.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadInitial();
    return () => {
      active = false;
    };
  }, [mode, articleId]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal mengunggah gambar");
      } else {
        setThumbnail(json.data.url);
      }
    } catch {
      setError("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!categoryId) {
      setError("Silakan pilih kategori terlebih dahulu.");
      return;
    }
    const strippedContent = content.replace(/<[^>]*>/g, "").trim();
    if (!strippedContent) {
      setError("Konten berita wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const endpoint =
        mode === "create" ? "/api/articles" : `/api/articles/${articleId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          excerpt: excerpt || undefined,
          content,
          thumbnail: thumbnail || null,
          categoryId,
          status,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal menyimpan berita");
      } else {
        router.push("/admin/berita");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan jaringan saat menyimpan berita.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div
        role="status"
        className="rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-8 text-center text-sm text-[#475467]"
      >
        Memuat data berita...
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link
          href="/admin/berita"
          className="mb-2 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-[#475467] hover:text-[#14263D]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke Daftar Berita
        </Link>
        <h1 className="font-serif text-2xl font-bold text-[#14263D]">
          {mode === "create" ? "Tambah Berita Baru" : "Edit Berita"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-6"
      >
        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="article-title"
            className="mb-1 block text-sm font-medium text-[#14263D]"
          >
            Judul Berita <span className="text-red-700">*</span>
          </label>
          <Input
            id="article-title"
            placeholder="Masukkan judul berita..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="article-slug"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Slug URL
            </label>
            <Input
              id="article-slug"
              placeholder="otomatis-dari-judul"
              value={slug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                setSlug(e.target.value);
              }}
            />
            <p className="mt-1 text-xs text-[#475467]">
              Preview: /berita/{slug || "slug-berita"}
            </p>
          </div>

          <div>
            <label
              htmlFor="article-category"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Kategori <span className="text-red-700">*</span>
            </label>
            <select
              id="article-category"
              className="min-h-11 w-full rounded-md border border-[#8C8272] bg-[#FFFDF9] px-3 py-2 text-sm text-[#14263D] focus:border-[#1E3A5F]"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                Pilih Kategori
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-1 text-xs text-[#785B0A]">
                Belum ada kategori. Tambahkan kategori terlebih dahulu di menu Kelola Kategori.
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="article-excerpt"
            className="mb-1 block text-sm font-medium text-[#14263D]"
          >
            Ringkasan (Excerpt)
          </label>
          <textarea
            id="article-excerpt"
            className="w-full rounded-md border border-[#8C8272] bg-[#FFFDF9] px-3 py-2 text-sm text-[#14263D] placeholder:text-[#5B6472] focus:border-[#1E3A5F]"
            rows={2}
            placeholder="Ringkasan singkat berita (kosongkan agar dibuat otomatis dari konten)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="article-thumbnail-url"
            className="mb-1 block text-sm font-medium text-[#14263D]"
          >
            Thumbnail Berita
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-[#8C8272] bg-[#F7F4EE] px-3.5 py-2 text-sm font-medium text-[#14263D] transition-colors hover:bg-[#EFECE4]">
              <Upload className="h-4 w-4" aria-hidden="true" />
              {uploading ? "Mengunggah..." : "Upload Gambar"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleThumbnailUpload}
                disabled={uploading}
              />
            </label>
            <Input
              id="article-thumbnail-url"
              className="flex-1"
              placeholder="Atau tempel URL gambar (https://...)"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
            {thumbnail && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setThumbnail("")}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Hapus
              </Button>
            )}
          </div>
          {thumbnail && (
            <div className="mt-3 overflow-hidden rounded-lg border border-[#D8D1C3] bg-[#EFECE4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt="Preview thumbnail"
                className="max-h-56 w-full object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-[#14263D]">
            Konten Berita <span className="text-red-700">*</span>
          </p>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#D8D1C3] pt-4">
          <div className="flex items-center gap-3">
            <label
              htmlFor="article-status"
              className="text-sm font-medium text-[#14263D]"
            >
              Status:
            </label>
            <select
              id="article-status"
              className="min-h-11 rounded-md border border-[#8C8272] bg-[#FFFDF9] px-3 py-2 text-sm text-[#14263D] focus:border-[#1E3A5F]"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "DRAFT" | "PUBLISHED")
              }
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/admin/berita")}
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting || uploading}>
              {submitting
                ? "Menyimpan..."
                : mode === "create"
                  ? "Simpan Berita"
                  : "Perbarui Berita"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
