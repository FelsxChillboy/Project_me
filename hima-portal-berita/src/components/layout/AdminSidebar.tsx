import Link from "next/link";

export function AdminSidebar() {
  return (
    <aside className="w-60 border-r bg-white p-4">
      <h2 className="mb-4 font-serif text-lg font-bold text-[#1E3A5F]">Admin</h2>
      <nav className="flex flex-col gap-2 text-sm">
        <Link href="/admin/dashboard">Dashboard</Link>
        <Link href="/admin/berita">Kelola Berita</Link>
        <Link href="/admin/kategori">Kelola Kategori</Link>
        <Link href="/admin/pengguna">Kelola Pengguna</Link>
      </nav>
    </aside>
  );
}
