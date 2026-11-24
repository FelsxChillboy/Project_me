"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Email atau password tidak sesuai. Periksa kembali akun Anda.");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kendala saat masuk ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center px-4 py-12"
    >
      <div className="editorial-rule-top w-full max-w-md rounded-b-lg border border-t-0 border-[#D8D1C3] bg-[#FFFDF9] p-8">
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-[#14263D] text-[#C9A227]"
            aria-hidden="true"
          >
            <Scale className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#14263D]">
            Masuk Panel Redaksi
          </h1>
          <p className="mt-1 text-sm text-[#475467]">
            Portal Berita HIMA Ilmu Hukum
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              placeholder="nama@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1 block text-sm font-medium text-[#14263D]"
            >
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900"
            >
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Masuk ke Dashboard"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[#475467] hover:text-[#14263D]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke Portal Berita
          </Link>
        </div>
      </div>
    </main>
  );
}
