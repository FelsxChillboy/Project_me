import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditBeritaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  return <ArticleForm mode="edit" articleId={id} />;
}
