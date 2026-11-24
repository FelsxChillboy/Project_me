import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ArticleCard } from "@/components/articles/ArticleCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [latest, mostViewed, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 7,
    }),
    prisma.article.findFirst({
      where: { status: "PUBLISHED" },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { views: "desc" },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { status: "PUBLISHED" } } },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const lead = latest[0];
  const secondaryList = latest.slice(1, 4);
  const moreStories = latest.slice(4);
  const todayLabel = formatDate(new Date());

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Broadsheet masthead & rubric navigation */}
      <section className="editorial-rule-top pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8D1C3] pb-3 text-xs text-[#475467]">
          <span className="font-semibold text-[#14263D]">
            Edisi Digital Redaksi HIMA Ilmu Hukum
          </span>
          <time className="tabular-nums">{todayLabel}</time>
        </div>

        {categories.length > 0 && (
          <nav
            aria-label="Rubrik berita"
            className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-[#D8D1C3] py-3"
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="inline-flex min-h-10 items-center rounded border border-[#D8D1C3] bg-[#FFFDF9] px-3 py-1.5 text-xs font-semibold text-[#14263D] transition-colors hover:border-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white"
              >
                <span>{cat.name}</span>
                <span className="ml-1.5 text-[11px] opacity-75 tabular-nums">
                  ({cat._count.articles})
                </span>
              </Link>
            ))}
          </nav>
        )}

        {/* Asymmetric editorial front-page lead */}
        {lead ? (
          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <article className="lg:col-span-7">
              {lead.thumbnail && (
                <Link
                  href={`/berita/${lead.slug}`}
                  className="mb-5 block aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#D8D1C3] bg-[#EFECE4]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lead.thumbnail}
                    alt={lead.title}
                    width={960}
                    height={600}
                    fetchPriority="high"
                    className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                  />
                </Link>
              )}

              <Link
                href={`/kategori/${lead.category.slug}`}
                className="text-xs font-semibold text-[#785B0A] hover:underline"
              >
                {lead.category.name}
              </Link>

              <h1 className="mt-2 font-serif text-[clamp(1.85rem,3.4vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[#14263D]">
                <Link
                  href={`/berita/${lead.slug}`}
                  className="transition-colors hover:text-[#1E3A5F]"
                >
                  {lead.title}
                </Link>
              </h1>

              {lead.excerpt && (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475467]">
                  {lead.excerpt}
                </p>
              )}

              <p className="mt-4 text-xs text-[#475467] tabular-nums">
                Oleh <strong className="text-[#14263D]">{lead.author.name}</strong>,{" "}
                {formatDate(lead.publishedAt || lead.createdAt)}, {lead.views} dibaca
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/berita/${lead.slug}`}
                  className="inline-flex min-h-11 items-center rounded-md bg-[#1E3A5F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#14263D]"
                >
                  Baca Laporan Utama
                </Link>
                <Link
                  href="/berita"
                  className="inline-flex min-h-11 items-center rounded-md border border-[#8C8272] bg-[#FFFDF9] px-5 py-2.5 text-sm font-semibold text-[#14263D] transition-colors hover:bg-[#EFECE4]"
                >
                  Buka Arsip Berita
                </Link>
              </div>
            </article>

            {/* Right editorial column */}
            <aside className="border-t border-[#D8D1C3] pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              {secondaryList.length > 0 ? (
                <>
                  <h2 className="font-serif text-xl font-bold text-[#14263D]">
                    Terbaru di Redaksi
                  </h2>
                  <ul className="mt-4 divide-y divide-[#D8D1C3]">
                    {secondaryList.map((item) => (
                      <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                        <Link
                          href={`/kategori/${item.category.slug}`}
                          className="text-xs font-semibold text-[#785B0A] hover:underline"
                        >
                          {item.category.name}
                        </Link>
                        <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-[#14263D]">
                          <Link
                            href={`/berita/${item.slug}`}
                            className="hover:text-[#1E3A5F] hover:underline hover:decoration-[#C9A227] hover:underline-offset-4"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        <p className="mt-1.5 text-xs text-[#475467] tabular-nums">
                          {item.author.name},{" "}
                          {formatDate(item.publishedAt || item.createdAt)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#14263D]">
                      Tentang Meja Redaksi
                    </h2>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#475467]">
                      Portal ini menghimpun pengumuman resmi, laporan kegiatan,
                      serta tulisan opini hukum dari mahasiswa dan pengurus
                      Himpunan Mahasiswa Ilmu Hukum.
                    </p>
                    <Link
                      href="/tentang"
                      className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#1E3A5F] underline decoration-[#C9A227] underline-offset-4 hover:text-[#14263D]"
                    >
                      Lihat Profil HIMA Ilmu Hukum
                    </Link>
                  </div>

                  {categories.length > 0 && (
                    <div className="border-t border-[#D8D1C3] pt-5">
                      <h3 className="font-serif text-lg font-bold text-[#14263D]">
                        Indeks Rubrik
                      </h3>
                      <ul className="mt-3 divide-y divide-[#ECE6D9] text-sm">
                        {categories.map((cat) => (
                          <li key={cat.id}>
                            <Link
                              href={`/kategori/${cat.slug}`}
                              className="flex min-h-11 items-center justify-between text-[#14263D] hover:text-[#1E3A5F]"
                            >
                              <span className="font-medium">{cat.name}</span>
                              <span className="text-xs text-[#475467] tabular-nums">
                                {cat._count.articles} tulisan
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </aside>
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-8 md:p-12">
            <h1 className="font-serif text-[clamp(1.85rem,3.4vw,2.75rem)] font-bold leading-tight text-[#14263D]">
              Portal Berita HIMA Ilmu Hukum
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#475467]">
              Belum ada berita yang dipublikasikan oleh redaksi saat ini.
              Pengurus dapat masuk ke panel admin untuk menulis laporan kegiatan,
              pengumuman akademik, atau opini hukum pertama.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/login"
                className="inline-flex min-h-11 items-center rounded-md bg-[#1E3A5F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#14263D]"
              >
                Masuk Panel Redaksi
              </Link>
              <Link
                href="/tentang"
                className="inline-flex min-h-11 items-center rounded-md border border-[#8C8272] bg-[#FFFDF9] px-5 py-2.5 text-sm font-semibold text-[#14263D] hover:bg-[#EFECE4]"
              >
                Baca Profil HIMA
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Contrasting legal-ink editorial band: Paling Banyak Dibaca */}
      {mostViewed && (
        <section className="rounded-lg border border-[#14263D] bg-[#14263D] p-7 text-white md:p-10">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="text-xs font-semibold text-[#F0D57A]">
                Paling Banyak Dibaca · {mostViewed.category.name}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold leading-snug text-white md:text-3xl">
                <Link
                  href={`/berita/${mostViewed.slug}`}
                  className="hover:underline hover:decoration-[#C9A227] hover:underline-offset-4"
                >
                  {mostViewed.title}
                </Link>
              </h2>
              {mostViewed.excerpt && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#E5DEC9]">
                  {mostViewed.excerpt}
                </p>
              )}
              <p className="mt-4 text-xs text-[#E5DEC9] tabular-nums">
                {mostViewed.author.name},{" "}
                {formatDate(mostViewed.publishedAt || mostViewed.createdAt)},{" "}
                {mostViewed.views} kali dibaca
              </p>
            </div>

            <div className="flex md:col-span-4 md:justify-end">
              <Link
                href={`/berita/${mostViewed.slug}`}
                className="inline-flex min-h-11 items-center rounded-md bg-[#C9A227] px-5 py-2.5 text-sm font-semibold text-[#14263D] transition-colors hover:bg-[#b8921f]"
              >
                Baca Artikel Populer
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Remaining recent stories */}
      {moreStories.length > 0 && (
        <section className="border-t border-[#D8D1C3] pt-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-2xl font-bold text-[#14263D]">
              Tulisan Lainnya
            </h2>
            <Link
              href="/berita"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-[#1E3A5F] underline decoration-[#C9A227] underline-offset-4 hover:text-[#14263D]"
            >
              Lihat Semua Berita
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moreStories.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
