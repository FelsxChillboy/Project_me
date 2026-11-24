import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-xl font-bold text-[#1E3A5F]">HIMA Ilmu Hukum</Link>
        <div className="flex gap-4 text-sm">
          <Link href="/">Beranda</Link>
          <Link href="/berita">Berita</Link>
          <Link href="/tentang">Tentang</Link>
          <Link href="/galeri">Galeri</Link>
        </div>
      </nav>
    </header>
  );
}
