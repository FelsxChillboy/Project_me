"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function EditBeritaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/articles/${id}`).then((r) => r.json()).then((j) => {
      if (j.success) {
        setTitle(j.data.title);
        setContent(j.data.content);
        setCategoryId(j.data.categoryId);
        setStatus(j.data.status);
      }
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, categoryId, status }),
    });
    const json = await res.json();
    if (!json.success) setError(json.error);
    else router.push("/admin/berita");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-3">
      <h1 className="font-serif text-2xl font-bold">Edit Berita</h1>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required />
      <textarea className="w-full rounded border p-2" rows={10} value={content} onChange={(e) => setContent(e.target.value)} required />
      <select className="rounded border p-2" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </select>
      {error && <p className="text-red-600">{error}</p>}
      <Button type="submit">Update</Button>
    </form>
  );
}
