"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function PenggunaPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "PENULIS" });

  async function load() {
    const res = await fetch("/api/users");
    const json = await res.json();
    if (json.success) setUsers(json.data);
  }
  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "", password: "", role: "PENULIS" });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Kelola Pengguna</h1>
      <form onSubmit={handleAdd} className="my-4 grid grid-cols-2 gap-2">
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama" required />
        <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
        <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
        <select className="rounded border p-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="PENULIS">Penulis</option>
          <option value="EDITOR">Editor</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        <Button type="submit">Tambah</Button>
      </form>
      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u.id} className="rounded border bg-white p-3">{u.name} — {u.email} ({u.role})</li>
        ))}
      </ul>
    </div>
  );
}
