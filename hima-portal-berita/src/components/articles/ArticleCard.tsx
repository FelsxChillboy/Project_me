import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export function ArticleCard({ article }: { article: any }) {
  return (
    <Card className="overflow-hidden">
      {article.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.thumbnail} alt={article.title} className="h-40 w-full object-cover" />
      )}
      <div className="p-4">
        <Badge>{article.category?.name}</Badge>
        <h3 className="mt-2 font-serif text-lg font-bold">
          <Link href={`/berita/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{article.excerpt}</p>
        <p className="mt-2 text-xs text-gray-400">
          {article.author?.name} · {formatDate(article.createdAt)}
        </p>
      </div>
    </Card>
  );
}
