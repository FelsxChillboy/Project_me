import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { KategoriAdminClient } from "@/components/admin/KategoriAdminClient";

export const dynamic = "force-dynamic";

export default async function KategoriAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "EDITOR") {
    redirect("/admin/dashboard");
  }

  return <KategoriAdminClient />;
}
