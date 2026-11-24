"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

interface ProfilAdminClientProps {
  initialUser: {
    name: string;
    email: string;
    role: string;
  };
}

export function ProfilAdminClient({ initialUser }: ProfilAdminClientProps) {
  const router = useRouter();
  const [name, setName] = useState(initialUser.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Gagal memperbarui profil");
      } else {
        setSuccessMsg(
          newPassword
            ? "Profil dan password berhasil diperbarui."
            : "Profil berhasil diperbarui."
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan saat memperbarui profil.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 border-b border-[#D8D1C3] pb-5">
        <h1 className="font-serif text-2xl font-bold text-[#14263D]">
          Profil dan Ganti Password
        </h1>
        <p className="mt-0.5 text-sm text-[#475467]">
          Kelola nama tampilan dan keamanan akun Anda sendiri
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
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-serif text-base font-bold text-[#14263D]">
            <User className="h-4 w-4 text-[#1E3A5F]" aria-hidden="true" />
            Informasi Akun
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Email
            </label>
            <Input
              id="profile-email"
              value={initialUser.email}
              disabled
              className="bg-[#EFECE4] text-[#475467]"
            />
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-[#14263D]">Role</p>
            <Badge variant="navy">{initialUser.role.replace("_", " ")}</Badge>
          </div>

          <div>
            <label
              htmlFor="profile-name"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Nama Tampilan
            </label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-[#D8D1C3] pt-5">
          <div className="flex items-center gap-2 font-serif text-base font-bold text-[#14263D]">
            <KeyRound className="h-4 w-4 text-[#1E3A5F]" aria-hidden="true" />
            Ganti Password (Opsional)
          </div>

          <div>
            <label
              htmlFor="profile-current-password"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Password Saat Ini
            </label>
            <Input
              id="profile-current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Wajib diisi jika ingin mengganti password"
              autoComplete="current-password"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label
                htmlFor="profile-new-password"
                className="mb-1 block text-sm font-medium text-[#14263D]"
              >
                Password Baru
              </label>
              <Input
                id="profile-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label
                htmlFor="profile-confirm-password"
                className="mb-1 block text-sm font-medium text-[#14263D]"
              >
                Konfirmasi Password Baru
              </label>
              <Input
                id="profile-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-[#D8D1C3] pt-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
