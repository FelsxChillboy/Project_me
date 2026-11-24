import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-[#C9A227] bg-[#14263D] text-white">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-4 py-10 md:flex-row md:items-center md:px-6">
        <div className="max-w-md">
          <p className="font-serif text-lg font-bold tracking-tight text-white">
            HIMA Ilmu Hukum
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#E5DEC9]">
            Media publikasi berita kegiatan, pengumuman akademik, dan kajian
            opini hukum Himpunan Mahasiswa Ilmu Hukum.
          </p>
        </div>

        <nav
          aria-label="Navigasi footer"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#E5DEC9]"
        >
          <Link href="/" className="py-1.5 transition-colors hover:text-[#F0D57A]">
            Beranda
          </Link>
          <Link href="/berita" className="py-1.5 transition-colors hover:text-[#F0D57A]">
            Arsip Berita
          </Link>
          <Link href="/galeri" className="py-1.5 transition-colors hover:text-[#F0D57A]">
            Galeri
          </Link>
          <Link href="/tentang" className="py-1.5 transition-colors hover:text-[#F0D57A]">
            Tentang
          </Link>
          <Link href="/admin/login" className="py-1.5 transition-colors hover:text-[#F0D57A]">
            Redaksi
          </Link>
        </nav>
      </div>

      <div className="border-t border-white/15 py-4 text-center text-xs text-[#E5DEC9]">
        © {new Date().getFullYear()} HIMA Ilmu Hukum. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
