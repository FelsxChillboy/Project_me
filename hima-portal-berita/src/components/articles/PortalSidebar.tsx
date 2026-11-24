import Link from "next/link";
import { formatDate } from "@/lib/utils";

export interface SidebarPopularArticle {
  id: string;
  title: string;
  slug: string;
  views: number;
  publishedAt: Date | null;
  createdAt: Date;
  category: { name: string; slug: string };
}

export interface SidebarCategory {
  id: string;
  name: string;
  slug: string;
  _count: { articles: number };
}

interface PortalSidebarProps {
  popular: SidebarPopularArticle[];
  categories: SidebarCategory[];
}

export function PortalSidebar({ popular, categories }: PortalSidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
      {/* Widget 1: Terpopuler (Ranked list without thumbnail clutter) */}
      <section className="rounded-md border border-[#DCE2EA] bg-white p-5">
        <h2 className="portal-section-heading font-serif text-lg font-bold text-[#111827]">
          <span className="text-[#0B4F9C]">Berita</span> Terpopuler
        </h2>

        {popular.length === 0 ? (
          <p className="mt-4 text-sm text-[#475569]">
            Belum ada berita terpopuler yang tercatat.
          </p>
        ) : (
          <ol className="mt-3 divide-y divide-[#E2E8F0]">
            {popular.map((item, idx) => (
              <li key={item.id} className="flex gap-3 py-3.5 first:pt-2 last:pb-0">
                <span
                  aria-hidden="true"
                  className="font-serif text-xl font-bold leading-none text-[#0B4F9C] tabular-nums"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/berita/${item.slug}`}
                    className="block text-sm font-semibold leading-snug text-[#111827] transition-colors hover:text-[#0B4F9C] hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-xs text-[#475569] tabular-nums">
                    {item.category.name} · {item.views} dibaca ·{" "}
                    {formatDate(item.publishedAt || item.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Widget 2: Rubrik Hukum */}
      {categories.length > 0 && (
        <section className="rounded-md border border-[#DCE2EA] bg-white p-5">
          <h2 className="portal-section-heading font-serif text-lg font-bold text-[#111827]">
            <span className="text-[#0B4F9C]">Rubrik</span> Hukum
          </h2>
          <ul className="mt-3 divide-y divide-[#E2E8F0] text-sm">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/kategori/${cat.slug}`}
                  className="flex min-h-11 items-center justify-between text-[#111827] transition-colors hover:text-[#0B4F9C]"
                >
                  <span className="font-medium">{cat.name}</span>
                  <span className="rounded bg-[#EAF2FB] px-2 py-0.5 text-xs font-semibold text-[#0B4F9C] tabular-nums">
                    {cat._count.articles}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Widget 3: Institutional Legal Desk Box (Hukumonline-inspired dark navy card) */}
      <section className="rounded-md bg-[#0F213E] p-6 text-white">
        <h2 className="font-serif text-lg font-bold text-white">
          Redaksi HIMA Ilmu Hukum
        </h2>
        <div className="mt-2 h-0.5 w-10 bg-[#D4A72C]" aria-hidden="true" />
        <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
          Menyajikan laporan kegiatan kemahasiswaan, pengumuman akademik, serta
          ruang gagasan dan opini hukum dari mahasiswa Fakultas Hukum.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/tentang"
            className="inline-flex min-h-10 items-center rounded bg-[#D4A72C] px-4 py-2 text-xs font-bold text-[#0F213E] transition-colors hover:bg-[#c29622]"
          >
            Profil HIMA
          </Link>
          <Link
            href="/galeri"
            className="inline-flex min-h-10 items-center rounded border border-white/30 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            Lihat Galeri
          </Link>
        </div>
      </section>
    </aside>
  );
}
