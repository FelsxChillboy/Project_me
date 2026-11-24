"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function KategoriAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");

  async function load() {
    const res = await fetch("/api/categories");
    const json = await res.json();
    if (json.success) setItems(json.data);
  }
  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Kelola Kategori</h1>
      <form onSubmit={handleAdd} className="my-4 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kategori" required />
        <Button type="submit">Tambah</Button>
      </form>
      <ul className="space-y-2">
        {items.map((c) => (
          <li key={c.id} className="rounded border bg-white p-3">{c.name} ({c.slug})</li>
        ))}
      </ul>
    </div>
  );
}
