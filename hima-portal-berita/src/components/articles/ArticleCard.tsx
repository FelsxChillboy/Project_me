import Link from "next/link";
import { formatDate } from "@/lib/utils";

export interface ArticleCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  views: number;
  createdAt: Date | string;
  publishedAt?: Date | string | null;
  author: { name: string };
  category: { name: string; slug: string };
}

interface ArticleCardProps {
  article: ArticleCardData;
  variant?: "horizontal" | "grid";
}

export function ArticleCard({ article, variant = "horizontal" }: ArticleCardProps) {
  const dateStr = formatDate(article.publishedAt || article.createdAt);

  if (variant === "grid") {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-md border border-[#DCE2EA] bg-white transition-colors hover:border-[#0B4F9C]">
        <Link
          href={`/berita/${article.slug}`}
          className="block aspect-[16/10] w-full overflow-hidden bg-[#EAF2FB]"
        >
          {article.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.thumbnail}
              alt={article.title}
              width={640}
              height={400}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full flex-col justify-between bg-[#0F213E] p-4 text-white">
              <span className="text-xs font-semibold text-[#F5D061]">
                {article.category.name}
              </span>
              <span className="font-serif text-base font-bold leading-snug">
                HIMA Ilmu Hukum
              </span>
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-4">
          <Link
            href={`/kategori/${article.category.slug}`}
            className="w-fit rounded bg-[#EAF2FB] px-2 py-0.5 text-xs font-semibold text-[#0B4F9C] hover:underline"
          >
            {article.category.name}
          </Link>

          <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-[#111827]">
            <Link
              href={`/berita/${article.slug}`}
              className="transition-colors hover:text-[#0B4F9C]"
            >
              {article.title}
            </Link>
          </h3>

          {article.excerpt && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#475569]">
              {article.excerpt}
            </p>
          )}

          <p className="mt-auto pt-3 text-xs text-[#475569] tabular-nums">
            {dateStr} · {article.views} dibaca
          </p>
        </div>
      </article>
    );
  }

  // Default: Horizontal Indonesian Legal News Feed Row (PortalHukum-style)
  return (
    <article className="group flex flex-col gap-4 py-5 first:pt-2 last:pb-1 sm:flex-row">
      <Link
        href={`/berita/${article.slug}`}
        className="block aspect-[16/10] w-full shrink-0 overflow-hidden rounded border border-[#DCE2EA] bg-[#EAF2FB] sm:w-52"
      >
        {article.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.thumbnail}
            alt={article.title}
            width={416}
            height={260}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-between bg-[#0F213E] p-3.5 text-white">
            <span className="text-[11px] font-semibold text-[#F5D061]">
              {article.category.name}
            </span>
            <span className="font-serif text-sm font-bold leading-snug">
              HIMA Ilmu Hukum
            </span>
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link
            href={`/kategori/${article.category.slug}`}
            className="rounded bg-[#EAF2FB] px-2 py-0.5 font-semibold text-[#0B4F9C] hover:underline"
          >
            {article.category.name}
          </Link>
          <span className="text-[#475569] tabular-nums">{dateStr}</span>
        </div>

        <h3 className="mt-1.5 font-serif text-xl font-bold leading-snug text-[#111827]">
          <Link
            href={`/berita/${article.slug}`}
            className="transition-colors hover:text-[#0B4F9C]"
          >
            {article.title}
          </Link>
        </h3>

        {article.excerpt && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#475569]">
            {article.excerpt}
          </p>
        )}

        <p className="mt-auto pt-2 text-xs text-[#475569] tabular-nums">
          Oleh <span className="font-medium text-[#111827]">{article.author.name}</span> ·{" "}
          {article.views} dibaca
        </p>
      </div>
    </article>
  );
}
