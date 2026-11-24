import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminBeritaPage() {
  const articles = await prisma.article.findMany({
    include: { author: true, category: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">Kelola Berita</h1>
        <Link href="/admin/berita/tambah" className="rounded bg-[#1E3A5F] px-3 py-2 text-white">Tambah Berita Baru</Link>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-sm">
            <th className="p-2">Judul</th>
            <th className="p-2">Kategori</th>
            <th className="p-2">Penulis</th>
            <th className="p-2">Status</th>
            <th className="p-2">Views</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="p-2">{a.title}</td>
              <td className="p-2">{a.category.name}</td>
              <td className="p-2">{a.author.name}</td>
              <td className="p-2">{a.status}</td>
              <td className="p-2">{a.views}</td>
              <td className="p-2">
                <Link href={`/admin/berita/edit/${a.id}`} className="text-blue-600">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
