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

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] transition hover:-translate-y-0.5 hover:border-[#8C8272]">
      <Link
        href={`/berita/${article.slug}`}
        className="block aspect-[16/10] w-full overflow-hidden bg-[#EFECE4]"
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
          <div className="flex h-full w-full flex-col justify-between border-b border-[#D8D1C3] bg-[#F2EDE1] p-5">
            <span className="font-serif text-xs font-semibold text-[#785B0A]">
              {article.category.name}
            </span>
            <p className="font-serif text-lg font-bold leading-snug text-[#14263D]">
              HIMA Ilmu Hukum
            </p>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/kategori/${article.category.slug}`}
          className="w-fit text-xs font-semibold text-[#785B0A] hover:underline"
        >
          {article.category.name}
        </Link>

        <h3 className="mt-2 font-serif text-xl font-bold leading-snug tracking-tight text-[#14263D]">
          <Link
            href={`/berita/${article.slug}`}
            className="transition-colors hover:text-[#1E3A5F] hover:underline hover:decoration-[#C9A227] hover:underline-offset-4"
          >
            {article.title}
          </Link>
        </h3>

        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#475467]">
            {article.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#ECE6D9] pt-3.5 text-xs text-[#475467] tabular-nums">
          <span className="truncate">
            {article.author.name}, {formatDate(article.publishedAt || article.createdAt)}
          </span>
          <span className="shrink-0">{article.views} dibaca</span>
        </div>
      </div>
    </article>
  );
}
