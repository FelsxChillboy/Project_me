import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { PortalSidebar } from "@/components/articles/PortalSidebar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [latest, popular, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 10,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        publishedAt: true,
        createdAt: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: { views: "desc" },
      take: 5,
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { status: "PUBLISHED" } } },
        },
        articles: {
          where: { status: "PUBLISHED" },
          select: {
            id: true,
            title: true,
            slug: true,
            publishedAt: true,
            createdAt: true,
          },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          take: 3,
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const headline = latest[0];
  const feedStories = latest.slice(1);
  const populatedCategories = categories.filter((c) => c.articles.length > 0);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Main Newsroom Column (~67%) */}
      <div className="space-y-8 lg:col-span-8">
        {/* Section 1: Berita Utama (PortalHukum / Hukumonline Headline Box) */}
        <section className="rounded-md border border-[#DCE2EA] bg-white p-5 md:p-6">
          <div className="portal-section-heading flex items-baseline justify-between gap-3">
            <h2 className="font-serif text-xl font-bold text-[#111827]">
              <span className="text-[#0B4F9C]">Berita</span> Utama
            </h2>
            <Link
              href="/berita"
              className="text-xs font-semibold text-[#0B4F9C] hover:underline"
            >
              Indeks Berita
            </Link>
          </div>

          {headline ? (
            <article className="mt-5">
              <Link
                href={`/berita/${headline.slug}`}
                className="block aspect-[16/9] w-full overflow-hidden rounded border border-[#DCE2EA] bg-[#0F213E]"
              >
                {headline.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={headline.thumbnail}
                    alt={headline.title}
                    width={960}
                    height={540}
                    fetchPriority="high"
                    className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col justify-between p-6 text-white md:p-9">
                    <span className="w-fit rounded bg-[#D4A72C] px-2.5 py-1 text-xs font-bold text-[#0F213E]">
                      {headline.category.name}
                    </span>
                    <div>
                      <p className="font-serif text-2xl font-bold leading-snug text-white md:text-3xl">
                        {headline.title}
                      </p>
                      <p className="mt-2 text-xs text-[#CBD5E1] tabular-nums">
                        Redaksi HIMA Ilmu Hukum ·{" "}
                        {formatDate(headline.publishedAt || headline.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </Link>

              <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
                <Link
                  href={`/kategori/${headline.category.slug}`}
                  className="rounded bg-[#EAF2FB] px-2.5 py-1 font-semibold text-[#0B4F9C] hover:underline"
                >
                  {headline.category.name}
                </Link>
                <span className="text-[#475569] tabular-nums">
                  {formatDate(headline.publishedAt || headline.createdAt)}
                </span>
                <span className="text-[#475569] tabular-nums">
                  · {headline.views} dibaca
                </span>
              </div>

              <h1 className="mt-2.5 font-serif text-[clamp(1.6rem,3vw,2.35rem)] font-bold leading-tight text-[#111827]">
                <Link
                  href={`/berita/${headline.slug}`}
                  className="transition-colors hover:text-[#0B4F9C]"
                >
                  {headline.title}
                </Link>
              </h1>

              {headline.excerpt && (
                <p className="mt-3 text-sm leading-relaxed text-[#475569] md:text-base">
                  {headline.excerpt}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
                <p className="text-xs text-[#475569]">
                  Oleh{" "}
                  <strong className="font-semibold text-[#111827]">
                    {headline.author.name}
                  </strong>
                </p>
                <Link
                  href={`/berita/${headline.slug}`}
                  className="inline-flex min-h-10 items-center rounded bg-[#0B4F9C] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F213E]"
                >
                  Baca Selengkapnya
                </Link>
              </div>
            </article>
          ) : (
            <div className="mt-5 rounded border border-[#DCE2EA] bg-[#F4F6F9] p-8 text-center">
              <h1 className="font-serif text-2xl font-bold text-[#111827]">
                Portal Berita HIMA Ilmu Hukum
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-sm text-[#475569]">
                Belum ada berita yang dipublikasikan. Pengurus redaksi dapat
                masuk ke panel admin untuk menerbitkan berita pertama.
              </p>
              <Link
                href="/admin/login"
                className="mt-4 inline-flex min-h-11 items-center rounded bg-[#0B4F9C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0F213E]"
              >
                Masuk Panel Redaksi
              </Link>
            </div>
          )}
        </section>

        {/* Section 2: Berita Terbaru (Horizontal Legal Newsroom Feed) */}
        {feedStories.length > 0 && (
          <section className="rounded-md border border-[#DCE2EA] bg-white p-5 md:p-6">
            <div className="portal-section-heading flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-xl font-bold text-[#111827]">
                <span className="text-[#0B4F9C]">Berita</span> Terbaru
              </h2>
              <Link
                href="/berita"
                className="text-xs font-semibold text-[#0B4F9C] hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="mt-2 divide-y divide-[#E2E8F0]">
              {feedStories.map((story) => (
                <ArticleCard key={story.id} article={story} variant="horizontal" />
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Side-by-Side Category Directory / Kanal Kajian (PortalHukum 2-col split) */}
        <section className="rounded-md border border-[#DCE2EA] bg-white p-5 md:p-6">
          <div className="portal-section-heading flex items-baseline justify-between gap-3">
            <h2 className="font-serif text-xl font-bold text-[#111827]">
              <span className="text-[#0B4F9C]">Kanal</span> Rubrik Hukum
            </h2>
            <Link
              href="/berita"
              className="text-xs font-semibold text-[#0B4F9C] hover:underline"
            >
              Semua Rubrik
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {(populatedCategories.length >= 2 ? populatedCategories : categories)
              .slice(0, 4)
              .map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col rounded border border-[#DCE2EA] bg-[#F4F6F9] p-4"
                >
                  <div className="flex items-center justify-between border-b border-[#DCE2EA] pb-2.5">
                    <Link
                      href={`/kategori/${cat.slug}`}
                      className="font-serif text-base font-bold text-[#0B4F9C] hover:underline"
                    >
                      {cat.name}
                    </Link>
                    <span className="text-xs font-medium text-[#475569] tabular-nums">
                      {cat._count.articles} tulisan
                    </span>
                  </div>

                  {cat.articles.length > 0 ? (
                    <ul className="mt-3 divide-y divide-[#DCE2EA] text-sm">
                      {cat.articles.map((art) => (
                        <li key={art.id} className="py-2 first:pt-0 last:pb-0">
                          <Link
                            href={`/berita/${art.slug}`}
                            className="block font-medium leading-snug text-[#111827] hover:text-[#0B4F9C] hover:underline"
                          >
                            {art.title}
                          </Link>
                          <p className="mt-0.5 text-xs text-[#475569] tabular-nums">
                            {formatDate(art.publishedAt || art.createdAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs leading-relaxed text-[#475569]">
                      Belum ada tulisan terbit di rubrik {cat.name}.
                    </p>
                  )}

                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="mt-auto pt-3 text-xs font-semibold text-[#0B4F9C] hover:underline"
                  >
                    Buka Rubrik {cat.name}
                  </Link>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Right Sticky Legal Portal Sidebar (~33%) */}
      <div className="lg:col-span-4">
        <PortalSidebar popular={popular} categories={categories} />
      </div>
    </div>
  );
}
