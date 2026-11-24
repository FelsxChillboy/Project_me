import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function TambahBeritaPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return <ArticleForm mode="create" />;
}
