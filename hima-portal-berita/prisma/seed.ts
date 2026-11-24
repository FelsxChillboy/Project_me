import "dotenv/config";
import { PrismaClient, Role, Status } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@hima.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@hima.com",
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  const demoPassword = await bcrypt.hash("demo123", 10);
  const demoEditor = await prisma.user.upsert({
    where: { email: "demo@hima.com" },
    update: {},
    create: {
      name: "Redaksi Demo HIMA",
      email: "demo@hima.com",
      password: demoPassword,
      role: Role.EDITOR,
    },
  });

  const categories = ["Akademik", "Kegiatan", "Pengumuman", "Opini Hukum"];
  const categoryMap: Record<string, string> = {};
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    categoryMap[slug] = category.id;
  }

  const demoArticles: Array<{
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    thumbnail: string;
    status: Status;
    views: number;
    publishedAt: Date | null;
    authorId: string;
    categorySlug: string;
  }> = [
    {
      slug: "bedah-implementasi-kuhp-nasional-di-auditorium-fakultas-hukum",
      title: "HIMA Ilmu Hukum Gelar Seminar Nasional Bedah Implementasi KUHP Baru",
      excerpt:
        "Akademisi pidana dan praktisi kejaksaan mengulas kesiapan penegak hukum serta penerapan pidana kerja sosial dan pidana denda dalam UU Nomor 1 Tahun 2023.",
      content: `
        <p>Himpunan Mahasiswa Ilmu Hukum (HIMA Ilmu Hukum) menyelenggarakan seminar nasional bertajuk <strong>"Kesiapan Penegak Hukum dan Akademisi Menyongsong Pemberlakuan KUHP Nasional"</strong> di Auditorium Fakultas Hukum. Kegiatan ini diikuti sekitar 240 peserta yang terdiri dari mahasiswa sarjana, dosen hukum pidana, dan perwakilan organisasi bantuan hukum daerah.</p>
        <p>Dalam sesi pemaparan utama, narasumber menyoroti pergeseran paradigma pemidanaan dalam Undang-Undang Nomor 1 Tahun 2023 yang tidak lagi semata bertumpu pada pembalasan, melainkan mengedepankan pemulihan keseimbangan dan alternatif pidana non-penjara.</p>
        <h2>Tiga Pokok Bahasan Utama</h2>
        <ul>
          <li><strong>Asas legalitas materiil:</strong> batasan penerapan hukum yang hidup dalam masyarakat agar tetap selaras dengan kepastian hukum.</li>
          <li><strong>Pidana kerja sosial dan pengawasan:</strong> kesiapan balai pemasyarakatan serta pemerintah daerah dalam mengawasi pelaksanaan putusan.</li>
          <li><strong>Pembaruan kategori denda:</strong> penyesuaian besaran denda pidana dan mekanisme penyitaan apabila terpidana tidak mampu membayar.</li>
        </ul>
        <blockquote>
          <p>"Keberhasilan KUHP Nasional tidak hanya ditentukan oleh teks pasal, tetapi oleh keseragaman pemahaman penyidik, penuntut umum, hakim, dan mahasiswa hukum yang kelak menjadi praktisi."</p>
        </blockquote>
        <p>Di akhir acara, Bidang Kajian dan Penalaran HIMA Ilmu Hukum menghimpun catatan diskusi untuk disusun menjadi ringkasan kebijakan kampus yang akan dipublikasikan melalui rubrik Akademik bulan depan.</p>
      `.trim(),
      thumbnail: "/demo/seminar-kuhp.jpg",
      status: Status.PUBLISHED,
      views: 342,
      publishedAt: daysAgo(1),
      authorId: admin.id,
      categorySlug: "akademik",
    },
    {
      slug: "delegasi-peradilan-semu-hima-raih-berkas-terbaik-tingkat-regional",
      title: "Delegasi Peradilan Semu HIMA Raih Penghargaan Berkas Terbaik Regional",
      excerpt:
        "Tim mahasiswa semester lima dan tujuh menyusun dakwaan, eksepsi, serta nota pembelaan perkara tindak pidana lingkungan dalam kompetisi peradilan semu.",
      content: `
        <p>Delegasi Kompetisi Peradilan Semu (<em>Moot Court</em>) binaan HIMA Ilmu Hukum meraih penghargaan kategori <strong>Berkas Persidangan Terbaik</strong> pada ajang peradilan semu tingkat regional akhir pekan lalu.</p>
        <p>Tim yang beranggotakan 14 mahasiswa ini mempersiapkan simulasi sidang perkara tindak pidana pencemaran lingkungan selama hampir empat bulan. Seluruh berkas, mulai dari berita acara pemeriksaan, surat dakwaan, tuntutan, hingga pleidoi, disusun berdasarkan hukum acara pidana dan yurisprudensi mutakhir.</p>
        <h2>Tahapan Persiapan Delegasi</h2>
        <ul>
          <li>Riset peraturan perundang-undangan lingkungan hidup dan analisis pembuktian ilmiah (<em>scientific evidence</em>).</li>
          <li>Latihan pemeriksaan saksi ahli dan pembuktian di ruang peradilan semu fakultas bersama alumni praktisi.</li>
          <li>Evaluasi ketepatan struktur surat dakwaan dan konsistensi argumentasi hukum acara.</li>
        </ul>
        <p>Ketua delegasi menyampaikan bahwa capaian ini menjadi bahan evaluasi penting untuk memperkuat program kaderisasi peradilan semu pada semester mendatang, termasuk pembukaan kelas dasar <em>legal drafting</em> bagi mahasiswa angkatan baru.</p>
      `.trim(),
      thumbnail: "/demo/moot-court.jpg",
      status: Status.PUBLISHED,
      views: 289,
      publishedAt: daysAgo(3),
      authorId: demoEditor.id,
      categorySlug: "kegiatan",
    },
    {
      slug: "catatan-kritis-penegakan-uu-pelindungan-data-pribadi-bagi-konsumen",
      title: "Catatan Kritis Penegakan UU Pelindungan Data Pribadi di Sektor Digital",
      excerpt:
        "Masa penyesuaian UU Nomor 27 Tahun 2022 telah berlalu, namun ketiadaan lembaga pengawas independen masih menyisakan celah perlindungan hak warga.",
      content: `
        <p>Berakhirnya masa transisi dua tahun Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) menandai berlakunya kewajiban penuh bagi pengendali dan prosesor data di sektor publik maupun swasta. Meski demikian, implementasi di lapangan belum sepenuhnya menjawab kekhawatiran masyarakat atas maraknya kebocoran data.</p>
        <p>Persoalan mendasar yang masih mengganjal adalah belum beroperasinya secara efektif lembaga penyelenggara pelindungan data pribadi sebagaimana diamanatkan Pasal 58 UU PDP. Tanpa otoritas pengawas yang independen, penjatuhan sanksi administratif hingga denda maksimal dua persen dari pendapatan tahunan sulit dijalankan secara objektif.</p>
        <h2>Aspek yang Perlu Segera Dibenahi</h2>
        <ol>
          <li><strong>Peraturan pelaksana teknis:</strong> standar notifikasi insiden kebocoran data dalam 3x24 jam perlu dilengkapi mekanisme audit yang jelas.</li>
          <li><strong>Akses pemulihan konsumen:</strong> subjek data membutuhkan jalur pengaduan dan ganti rugi yang sederhana tanpa biaya perkara tinggi.</li>
          <li><strong>Kepatuhan institusi publik:</strong> standar keamanan data pada layanan pemerintahan harus diawasi setara dengan penyelenggara swasta.</li>
        </ol>
        <p>Mahasiswa dan akademisi hukum memiliki ruang penting untuk terus mengawal penyusunan peraturan pemerintah turunan UU PDP agar perlindungan privasi warga tidak berhenti sebatas norma di atas kertas.</p>
      `.trim(),
      thumbnail: "/demo/pustaka-hukum.jpg",
      status: Status.PUBLISHED,
      views: 254,
      publishedAt: daysAgo(5),
      authorId: demoEditor.id,
      categorySlug: "opini-hukum",
    },
    {
      slug: "penyuluhan-hukum-pendaftaran-tanah-dan-waris-di-desa-binaan",
      title: "Kader HIMA Gelar Penyuluhan Hukum Pertanahan dan Waris di Desa Binaan",
      excerpt:
        "Sebanyak 60 warga mengikuti sesi diskusi dan konsultasi hukum dasar mengenai sertifikasi tanah, akta hibah, serta pencegahan sengketa batas lahan.",
      content: `
        <p>Bidang Pengabdian Masyarakat HIMA Ilmu Hukum bersama dosen pembimbing hukum agraria melaksanakan penyuluhan hukum di balai desa binaan. Kegiatan ini dihadiri perangkat desa, tokoh masyarakat, dan sekitar 60 warga yang aktif mengajukan pertanyaan seputar dokumen kepemilikan tanah.</p>
        <p>Materi difokuskan pada persoalan sehari-hari yang sering memicu sengketa di tingkat keluarga maupun antar tetangga, seperti peralihan hak atas tanah tanpa akta Pejabat Pembuat Akta Tanah (PPAT) serta pembagian waris yang belum dicatatkan secara administratif.</p>
        <h2>Topik yang Banyak Ditanyakan Warga</h2>
        <ul>
          <li>Syarat pendaftaran tanah pertama kali melalui program Pendaftaran Tanah Sistematis Lengkap (PTSL).</li>
          <li>Perbedaan kekuatan hukum antara surat keterangan desa, akta di bawah tangan, dan sertifikat hak milik.</li>
          <li>Prosedur musyawarah keluarga sebelum pengurusan surat keterangan waris.</li>
        </ul>
        <p>Selain sesi paparan, tim mahasiswa membagikan buku saku panduan dokumen pertanahan dan membuka meja konsultasi awal yang terhubung dengan Lembaga Konsultasi dan Bantuan Hukum (LKBH) fakultas.</p>
      `.trim(),
      thumbnail: "/demo/penyuluhan-hukum.jpg",
      status: Status.PUBLISHED,
      views: 198,
      publishedAt: daysAgo(7),
      authorId: admin.id,
      categorySlug: "kegiatan",
    },
    {
      slug: "forum-kajian-putusan-mk-bahas-uji-materiil-uu-ketenagakerjaan",
      title: "Forum Kajian Putusan MK Bahas Implikasi Uji Materiil Ketenagakerjaan",
      excerpt:
        "Kelompok studi hukum tata negara mengurai pertimbangan hakim konstitusi mengenai upah minimum, perjanjian kerja waktu tertentu, dan hak pekerja.",
      content: `
        <p>Kelompok Studi Hukum Tata Negara dan Administrasi HIMA Ilmu Hukum menggelar diskusi rutin bulanan di ruang baca perpustakaan fakultas. Pertemuan kali ini membedah pertimbangan hukum (<em>ratio decidendi</em>) Mahkamah Konstitusi atas pengujian materiil sejumlah pasal ketenagakerjaan.</p>
        <p>Peserta dibagi ke dalam tiga kelompok analisis untuk memetakan norma yang dinyatakan inkonstitusional bersyarat, dampak langsung terhadap hubungan kerja di perusahaan, serta tindak lanjut legislasi yang menjadi kewenangan DPR dan pemerintah.</p>
        <h2>Hasil Ringkasan Kajian</h2>
        <ul>
          <li>Pembatasan jangka waktu Perjanjian Kerja Waktu Tertentu (PKWT) perlu diawasi ketat oleh pengawas ketenagakerjaan daerah.</li>
          <li>Penetapan upah minimum sektoral kembali memperoleh pijakan hukum untuk melindungi pekerja pada sektor berisiko tinggi.</li>
          <li>Diperlukan pemisahan kodifikasi aturan ketenagakerjaan agar mudah diakses pekerja maupun pengusaha.</li>
        </ul>
        <p>Forum kajian ini terbuka bagi seluruh mahasiswa Fakultas Hukum setiap hari Kamis pekan kedua dan keempat. Naskah anotasi putusan dapat diunduh setelah tahap penyuntingan redaksi selesai.</p>
      `.trim(),
      thumbnail: "/demo/kajian-hukum.jpg",
      status: Status.PUBLISHED,
      views: 176,
      publishedAt: daysAgo(10),
      authorId: demoEditor.id,
      categorySlug: "akademik",
    },
    {
      slug: "selamat-datang-di-portal-berita-hima-ilmu-hukum",
      title: "Selamat Datang di Portal Berita Resmi HIMA Ilmu Hukum",
      excerpt:
        "Portal resmi informasi akademik, kegiatan kemahasiswaan, pengumuman, dan publikasi opini hukum Himpunan Mahasiswa Ilmu Hukum.",
      content: `
        <p>Selamat datang di portal berita resmi <strong>Himpunan Mahasiswa Ilmu Hukum (HIMA Ilmu Hukum)</strong>. Platform ini hadir sebagai kanal publikasi terpadu bagi mahasiswa, dosen, alumni, dan masyarakat umum.</p>
        <p>Seluruh berita kegiatan organisasi, pengumuman agenda akademik, dokumentasi galeri, serta tulisan opini hukum dari kader dan akademisi kini dikelola dalam satu sistem redaksi yang terbuka dan mudah ditelusuri berdasarkan rubrik.</p>
        <h2>Rubrik yang Tersedia</h2>
        <ul>
          <li><strong>Akademik:</strong> liputan seminar, bedah putusan pengadilan, dan informasi forum kajian ilmiah.</li>
          <li><strong>Kegiatan:</strong> dokumentasi program kerja himpunan, delegasi lomba, dan pengabdian masyarakat.</li>
          <li><strong>Opini Hukum:</strong> analisis regulasi, catatan kebijakan publik, dan esai hukum mahasiswa.</li>
          <li><strong>Pengumuman:</strong> jadwal pendaftaran kepanitiaan, beasiswa, dan informasi administrasi organisasi.</li>
        </ul>
        <p>Mahasiswa yang berminat mengirimkan naskah opini hukum atau rilis kegiatan divisi dapat menghubungi redaksi melalui sekretariat HIMA Ilmu Hukum.</p>
      `.trim(),
      thumbnail: "/demo/kampus-hukum.jpg",
      status: Status.PUBLISHED,
      views: 145,
      publishedAt: daysAgo(14),
      authorId: admin.id,
      categorySlug: "pengumuman",
    },
    {
      slug: "draf-jadwal-pendaftaran-klinik-hukum-semester-genap",
      title: "Jadwal Pendaftaran Klinik Hukum Mahasiswa Semester Genap",
      excerpt:
        "Draf pengumuman alur pendaftaran peserta klinik hukum perdata, pidana, dan anti-korupsi bagi mahasiswa minimal semester lima.",
      content: `
        <p>Draf pengumuman internal redaksi untuk pembukaan pendaftaran peserta <strong>Klinik Hukum Semester Genap</strong>. Tanggal final dan tautan formulir akan diperbarui setelah konfirmasi dari koordinator laboratorium hukum fakultas.</p>
        <ul>
          <li>Persyaratan umum: mahasiswa aktif minimal semester lima dan telah lulus mata kuliah Hukum Acara.</li>
          <li>Pilihan divisi: Klinik Hukum Pidana, Klinik Hukum Perdata, dan Klinik Hukum Lingkungan.</li>
        </ul>
      `.trim(),
      thumbnail: "/demo/kampus-hukum.jpg",
      status: Status.DRAFT,
      views: 0,
      publishedAt: null,
      authorId: demoEditor.id,
      categorySlug: "pengumuman",
    },
  ];

  for (const item of demoArticles) {
    await prisma.article.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        thumbnail: item.thumbnail,
        status: item.status,
        views: item.views,
        publishedAt: item.publishedAt,
        categoryId: categoryMap[item.categorySlug],
      },
      create: {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        thumbnail: item.thumbnail,
        status: item.status,
        views: item.views,
        publishedAt: item.publishedAt,
        authorId: item.authorId,
        categoryId: categoryMap[item.categorySlug],
      },
    });
  }

  const demoGallery = [
    {
      title: "Seminar Nasional Bedah Implementasi KUHP Baru",
      caption:
        "Sesi pemaparan narasumber akademisi hukum pidana bersama peserta mahasiswa di Auditorium Fakultas Hukum.",
      imageUrl: "/demo/seminar-kuhp.jpg",
    },
    {
      title: "Simulasi Sidang Kompetisi Peradilan Semu",
      caption:
        "Delegasi Moot Court HIMA Ilmu Hukum saat membacakan argumentasi pembuktian dalam simulasi persidangan.",
      imageUrl: "/demo/moot-court.jpg",
    },
    {
      title: "Penyuluhan Hukum Pertanahan di Desa Binaan",
      caption:
        "Mahasiswa dan warga berdiskusi mengenai prosedur pendaftaran sertifikat tanah serta pencegahan sengketa batas lahan.",
      imageUrl: "/demo/penyuluhan-hukum.jpg",
    },
    {
      title: "Forum Kajian Anotasi Putusan Mahkamah Konstitusi",
      caption:
        "Diskusi kelompok studi mahasiswa membahas pertimbangan hakim dalam uji materiil peraturan ketenagakerjaan.",
      imageUrl: "/demo/kajian-hukum.jpg",
    },
  ];

  for (const photo of demoGallery) {
    const existing = await prisma.gallery.findFirst({
      where: { imageUrl: photo.imageUrl },
    });
    if (existing) {
      await prisma.gallery.update({
        where: { id: existing.id },
        data: { title: photo.title, caption: photo.caption },
      });
    } else {
      await prisma.gallery.create({ data: photo });
    }
  }

  const [userCount, categoryCount, articleCount, galleryCount] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.article.count(),
    prisma.gallery.count(),
  ]);

  console.log(
    `Seed selesai: ${userCount} pengguna, ${categoryCount} kategori, ${articleCount} artikel, ${galleryCount} foto galeri.`
  );
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
