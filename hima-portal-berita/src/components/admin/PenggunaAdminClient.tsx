"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, UserPlus, CheckCircle2 } from "lucide-react";
import type { Role } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  _count?: { articles: number };
}

export function PenggunaAdminClient() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: Role;
  }>({ name: "", email: "", password: "", role: "PENULIS" });

  const [editTarget, setEditTarget] = useState<UserItem | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: Role;
  }>({ name: "", email: "", password: "", role: "PENULIS" });

  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success) setUsers(json.data);
      else setError(json.error || "Anda tidak memiliki akses ke halaman ini.");
    } catch {
      setError("Gagal memuat daftar pengguna.");
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
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal menambahkan pengguna");
      } else {
        setSuccessMsg(`Pengguna "${form.name}" berhasil ditambahkan.`);
        setForm({ name: "", email: "", password: "", role: "PENULIS" });
        await load();
      }
    } catch {
      setError("Terjadi kesalahan saat menambahkan pengguna.");
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
      const res = await fetch(`/api/users/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal memperbarui pengguna");
      } else {
        setSuccessMsg(`Pengguna "${editForm.name}" berhasil diperbarui.`);
        setEditTarget(null);
        await load();
      }
    } catch {
      setError("Terjadi kesalahan saat memperbarui pengguna.");
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
      const res = await fetch(`/api/users/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal menghapus pengguna");
        setDeleteTarget(null);
      } else {
        setSuccessMsg(`Pengguna "${deleteTarget.name}" berhasil dihapus.`);
        setDeleteTarget(null);
        await load();
      }
    } catch {
      setError("Terjadi kesalahan saat menghapus pengguna.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 border-b border-[#D8D1C3] pb-5">
        <h1 className="font-serif text-2xl font-bold text-[#14263D]">
          Kelola Pengguna
        </h1>
        <p className="mt-0.5 text-sm text-[#475467]">
          Kelola akun Super Admin, Editor, dan Penulis portal berita
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
        className="mb-6 rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-5"
      >
        <h2 className="mb-3 font-serif text-base font-bold text-[#14263D]">
          Tambah Pengguna Baru
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="add-user-name" className="mb-1 block text-xs font-medium text-[#14263D]">
              Nama Lengkap
            </label>
            <Input
              id="add-user-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama lengkap"
              required
            />
          </div>
          <div>
            <label htmlFor="add-user-email" className="mb-1 block text-xs font-medium text-[#14263D]">
              Email
            </label>
            <Input
              id="add-user-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@domain.com"
              required
            />
          </div>
          <div>
            <label htmlFor="add-user-password" className="mb-1 block text-xs font-medium text-[#14263D]">
              Password
            </label>
            <Input
              id="add-user-password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimal 6 karakter"
              minLength={6}
              required
            />
          </div>
          <div>
            <label htmlFor="add-user-role" className="mb-1 block text-xs font-medium text-[#14263D]">
              Role
            </label>
            <select
              id="add-user-role"
              className="min-h-11 w-full rounded-md border border-[#8C8272] bg-[#FFFDF9] px-3 py-2 text-sm text-[#14263D] focus:border-[#1E3A5F]"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as Role })
              }
            >
              <option value="PENULIS">Penulis</option>
              <option value="EDITOR">Editor</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={submitting}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Tambah Pengguna
          </Button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-[#D8D1C3] bg-[#FFFDF9]">
        {loading ? (
          <p className="p-6 text-center text-sm text-[#475467]">
            Memuat pengguna...
          </p>
        ) : users.length === 0 ? (
          <p className="p-6 text-center text-sm text-[#475467]">
            Belum ada data pengguna.
          </p>
        ) : (
          <ul className="divide-y divide-[#ECE6D9]">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 hover:bg-[#F7F4EE]"
              >
                <div>
                  <p className="font-medium text-[#14263D]">{u.name}</p>
                  <p className="text-xs text-[#475467]">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      u.role === "SUPER_ADMIN"
                        ? "navy"
                        : u.role === "EDITOR"
                          ? "gold"
                          : "gray"
                    }
                  >
                    {u.role.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-[#475467] tabular-nums">
                    {u._count?.articles ?? 0} berita
                  </span>
                  <button
                    type="button"
                    aria-label={`Edit pengguna ${u.name}`}
                    onClick={() => {
                      setEditTarget(u);
                      setEditForm({
                        name: u.name,
                        email: u.email,
                        password: "",
                        role: u.role,
                      });
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#1E3A5F] hover:bg-[#EFECE4]"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus pengguna ${u.name}`}
                    onClick={() => setDeleteTarget(u)}
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
        title="Edit Pengguna"
      >
        <form onSubmit={handleEdit} className="space-y-3">
          <div>
            <label
              htmlFor="edit-user-name"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Nama
            </label>
            <Input
              id="edit-user-name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label
              htmlFor="edit-user-email"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Email
            </label>
            <Input
              id="edit-user-email"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label
              htmlFor="edit-user-password"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Password Baru (opsional)
            </label>
            <Input
              id="edit-user-password"
              type="password"
              value={editForm.password}
              onChange={(e) =>
                setEditForm({ ...editForm, password: e.target.value })
              }
              placeholder="Kosongkan jika tidak ingin mengubah"
              minLength={6}
            />
          </div>
          <div>
            <label
              htmlFor="edit-user-role"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Role
            </label>
            <select
              id="edit-user-role"
              className="min-h-11 w-full rounded-md border border-[#8C8272] bg-[#FFFDF9] px-3 py-2 text-sm text-[#14263D] focus:border-[#1E3A5F]"
              value={editForm.role}
              onChange={(e) =>
                setEditForm({ ...editForm, role: e.target.value as Role })
              }
            >
              <option value="PENULIS">Penulis</option>
              <option value="EDITOR">Editor</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
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
        title="Hapus Pengguna"
      >
        <p className="text-sm text-[#475467]">
          Yakin ingin menghapus akun{" "}
          <strong className="text-[#14263D]">{deleteTarget?.name}</strong> (
          {deleteTarget?.email})?
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
