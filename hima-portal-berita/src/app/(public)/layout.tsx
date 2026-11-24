import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: { id: string; name: string; slug: string }[] = [];
  try {
    categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });
  } catch {
    categories = [];
  }

  const todayLabel = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F6F9]">
      <Navbar categories={categories} todayLabel={todayLabel || formatDate(new Date())} />
      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8"
      >
        {children}
      </main>
      <Footer categories={categories} />
    </div>
  );
}
