import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F4EE] px-4 text-center">
      <p className="text-sm font-semibold text-[#785B0A] tabular-nums">404</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-[#14263D]">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#475467]">
        Halaman atau berita yang Anda cari tidak tersedia atau telah dihapus dari
        arsip redaksi.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-md bg-[#1E3A5F] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#14263D]"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
