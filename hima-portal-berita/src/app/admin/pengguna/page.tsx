import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PenggunaAdminClient } from "@/components/admin/PenggunaAdminClient";

export const dynamic = "force-dynamic";

export default async function PenggunaPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  return <PenggunaAdminClient />;
}
