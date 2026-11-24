import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { GaleriAdminClient } from "@/components/admin/GaleriAdminClient";

export const dynamic = "force-dynamic";

export default async function GaleriAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "EDITOR") {
    redirect("/admin/dashboard");
  }

  return <GaleriAdminClient />;
}
