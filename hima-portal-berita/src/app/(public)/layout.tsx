import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EE]">
      <Navbar />
      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 md:px-6 md:py-10"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
