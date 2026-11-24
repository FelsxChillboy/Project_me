import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@hima.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@hima.com",
      password,
      role: "SUPER_ADMIN",
    },
  });

  const cats = ["Akademik", "Kegiatan", "Pengumuman", "Opini Hukum"];
  const categoryMap: Record<string, string> = {};
  for (const name of cats) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const cat = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    categoryMap[slug] = cat.id;
  }

  await prisma.article.upsert({
    where: { slug: "selamat-datang-di-portal-berita-hima-ilmu-hukum" },
    update: {},
    create: {
      title: "Selamat Datang di Portal Berita HIMA Ilmu Hukum",
      slug: "selamat-datang-di-portal-berita-hima-ilmu-hukum",
      excerpt:
        "Portal resmi informasi akademik, kegiatan kemahasiswaan, pengumuman, dan opini hukum Himpunan Mahasiswa Ilmu Hukum.",
      content:
        "<p>Selamat datang di portal berita resmi <strong>Himpunan Mahasiswa Ilmu Hukum (HIMA Ilmu Hukum)</strong>.</p><p>Melalui platform ini, seluruh mahasiswa, dosen, dan masyarakat umum dapat mengakses informasi terkini seputar kegiatan organisasi, agenda akademik, pengumuman resmi, serta tulisan opini hukum dari kader dan akademisi.</p><h2>Tujuan Portal</h2><ul><li>Menyediakan informasi organisasi secara cepat dan transparan.</li><li>Menjadi wadah publikasi karya tulis dan opini hukum mahasiswa.</li><li>Mendokumentasikan berbagai kegiatan dan prestasi HIMA Ilmu Hukum.</li></ul>",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categoryMap["pengumuman"],
    },
  });
}

main()
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
