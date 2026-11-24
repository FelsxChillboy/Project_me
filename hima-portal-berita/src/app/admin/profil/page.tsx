import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfilAdminClient } from "@/components/admin/ProfilAdminClient";

export const dynamic = "force-dynamic";

export default async function ProfilAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, role: true },
  });
  if (!user) redirect("/admin/login");

  return <ProfilAdminClient initialUser={user} />;
}
