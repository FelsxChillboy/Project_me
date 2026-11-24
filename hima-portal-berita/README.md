# Portal Berita HIMA Ilmu Hukum

Aplikasi web portal berita resmi untuk **Himpunan Mahasiswa Ilmu Hukum (HIMA Ilmu Hukum)** berbasis Next.js App Router, Prisma ORM (PostgreSQL), dan NextAuth v5.

## Fitur Utama

### Halaman Publik
- **Beranda**: Hero profil, navigasi kategori, daftar berita terbaru, dan berita paling banyak dibaca.
- **Daftar Berita (`/berita`)**: Pencarian kata kunci, filter kategori, dan pagination.
- **Detail Berita (`/berita/[slug]`)**: Konten HTML tersanitasi, penghitung views otomatis, metadata SEO dinamis, dan berita terkait.
- **Kategori (`/kategori/[slug]`)**: Daftar berita berdasarkan kategori.
- **Galeri (`/galeri`)**: Dokumentasi visual dinamis dari thumbnail berita yang dipublikasikan.
- **Tentang (`/tentang`)**: Profil, visi & misi, dan struktur bidang kepengurusan HIMA Ilmu Hukum.

### Admin Panel (`/admin`)
- **Autentikasi & RBAC**: Login kredensial (`SUPER_ADMIN`, `EDITOR`, `PENULIS`) dengan proteksi middleware dan validasi sisi server.
- **Dashboard**: Statistik total berita, published, draft, total views, dan daftar 5 berita terbaru.
- **Kelola Berita**: Tambah, edit, hapus, filter status, pencarian, upload thumbnail (Cloudinary atau fallback lokal `public/uploads`), toolbar formatting, dan preview konten.
- **Kelola Kategori**: CRUD kategori (Editor & Super Admin) dengan proteksi hapus bila kategori masih digunakan.
- **Kelola Pengguna**: CRUD pengguna & manajemen role (Super Admin).

## Menjalankan Project

1. Salin `.env.example` menjadi `.env` dan isi `DATABASE_URL` serta `NEXTAUTH_SECRET`.
2. Install dependensi dan generate Prisma Client:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run seed
   ```
3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
4. Akses portal di `http://localhost:3000` dan login admin di `http://localhost:3000/admin/login`.
   - **Akun default hasil seed**: `admin@hima.com` / `admin123` (segera ubah password setelah login).
