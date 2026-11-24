import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return <div className="min-h-screen bg-[#F7F4EE]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EE] md:flex-row">
      <AdminSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
        }}
      />
      <main id="main-content" className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
