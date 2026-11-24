import Link from "next/link";
import type { NavCategory } from "./Navbar";

export function Footer({ categories = [] }: { categories?: NavCategory[] }) {
  return (
    <footer className="mt-auto border-t-4 border-[#0B4F9C] bg-[#0F213E] text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-12 md:px-6">
        <div className="md:col-span-5">
          <p className="font-serif text-xl font-bold text-white">
            HIMA Ilmu Hukum
          </p>
          <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-[#CBD5E1]">
            Portal berita, informasi akademik, dokumentasi kegiatan, dan ruang
            opini hukum Himpunan Mahasiswa Ilmu Hukum.
          </p>
        </div>

        <div className="md:col-span-4">
          <h2 className="border-b border-white/15 pb-2 text-xs font-bold uppercase tracking-wider text-[#F5D061]">
            Rubrik Hukum
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#CBD5E1]">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/kategori/${cat.slug}`}
                  className="inline-block py-0.5 transition-colors hover:text-white hover:underline"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="border-b border-white/15 pb-2 text-xs font-bold uppercase tracking-wider text-[#F5D061]">
            Redaksi dan Kanal
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[#CBD5E1]">
            <li>
              <Link href="/" className="inline-block py-0.5 hover:text-white hover:underline">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/berita" className="inline-block py-0.5 hover:text-white hover:underline">
                Indeks Berita
              </Link>
            </li>
            <li>
              <Link href="/galeri" className="inline-block py-0.5 hover:text-white hover:underline">
                Galeri Kegiatan
              </Link>
            </li>
            <li>
              <Link href="/tentang" className="inline-block py-0.5 hover:text-white hover:underline">
                Tentang HIMA
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="inline-block py-0.5 text-[#F5D061] hover:underline">
                Masuk Panel Redaksi
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#0B4F9C] py-3.5 text-center text-xs font-medium text-white">
        © {new Date().getFullYear()} Portal Berita HIMA Ilmu Hukum. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
