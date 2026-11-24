import Link from "next/link";

const bidang = [
  {
    jabatan: "Ketua dan Wakil Ketua Himpunan",
    tugas:
      "Memimpin arah kebijakan organisasi, koordinasi eksternal, dan pengawasan program kerja tahunan.",
  },
  {
    jabatan: "Sekretaris dan Bendahara Umum",
    tugas:
      "Mengelola administrasi kesekretariatan, arsip surat, serta pencatatan keuangan himpunan.",
  },
  {
    jabatan: "Divisi Kajian dan Keilmuan Hukum",
    tugas:
      "Menyelenggarakan diskusi hukum, seminar akademik, peradilan semu, serta publikasi opini hukum mahasiswa.",
  },
  {
    jabatan: "Divisi Advokasi dan Pengabdian Masyarakat",
    tugas:
      "Menyalurkan aspirasi mahasiswa dan menjalankan kegiatan penyuluhan hukum untuk masyarakat sekitar kampus.",
  },
  {
    jabatan: "Divisi Media, Komunikasi, dan Informasi",
    tugas:
      "Mengelola portal berita, dokumentasi foto kegiatan, serta publikasi pengumuman resmi HIMA Ilmu Hukum.",
  },
];

export default function TentangPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-md border border-[#DCE2EA] bg-white p-6 md:p-9">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="portal-section-heading font-serif text-2xl font-bold text-[#111827] md:text-3xl">
              <span className="text-[#0B4F9C]">Tentang</span> HIMA Ilmu Hukum
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
              Himpunan Mahasiswa Ilmu Hukum (HIMA Ilmu Hukum) adalah organisasi
              kemahasiswaan di tingkat program studi yang mewadahi kegiatan
              akademik, kajian hukum, advokasi mahasiswa, dan pengabdian
              masyarakat.
            </p>
          </div>

          <aside className="rounded-md bg-[#0F213E] p-6 text-white lg:col-span-5">
            <h2 className="font-serif text-lg font-bold text-white">
              Informasi Sekretariat
            </h2>
            <div className="mt-2 h-0.5 w-10 bg-[#D4A72C]" aria-hidden="true" />
            <dl className="mt-4 space-y-3 text-sm text-[#CBD5E1]">
              <div>
                <dt className="font-semibold text-[#F5D061]">Alamat</dt>
                <dd>[Isi alamat sekretariat fakultas / kampus]</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#F5D061]">Email Redaksi</dt>
                <dd>[Isi email resmi HIMA Ilmu Hukum]</dd>
              </div>
            </dl>
            <Link
              href="/berita"
              className="mt-5 inline-flex min-h-11 items-center rounded bg-[#D4A72C] px-4 py-2 text-xs font-bold text-[#0F213E] hover:bg-[#c29622]"
            >
              Baca Publikasi Redaksi
            </Link>
          </aside>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-md border border-[#DCE2EA] bg-white p-6">
          <h2 className="portal-section-heading font-serif text-xl font-bold text-[#111827]">
            <span className="text-[#0B4F9C]">Visi</span> Organisasi
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#475569]">
            Menjadi himpunan mahasiswa hukum yang aktif mengembangkan budaya
            riset, penalaran hukum yang kritis, serta pengabdian yang nyata bagi
            mahasiswa dan masyarakat.
          </p>
        </div>

        <div className="rounded-md border border-[#DCE2EA] bg-white p-6">
          <h2 className="portal-section-heading font-serif text-xl font-bold text-[#111827]">
            <span className="text-[#0B4F9C]">Misi</span> Organisasi
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#475569]">
            <li>Menyelenggarakan forum kajian dan diskusi hukum secara berkala.</li>
            <li>Mendorong publikasi tulisan opini dan literasi hukum mahasiswa.</li>
            <li>Menjalin kerja sama akademik lintas organisasi dan praktisi hukum.</li>
            <li>Mengawal aspirasi mahasiswa serta kegiatan penyuluhan masyarakat.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-md border border-[#DCE2EA] bg-white p-6 md:p-8">
        <h2 className="portal-section-heading font-serif text-xl font-bold text-[#111827]">
          <span className="text-[#0B4F9C]">Struktur</span> Bidang Kepengurusan
        </h2>
        <p className="mt-2 text-sm text-[#475569]">
          Pembagian tugas pokok pengurus HIMA Ilmu Hukum (nama pengurus periode
          berjalan dapat diperbarui sesuai SK kepengurusan aktif).
        </p>

        <ol className="mt-5 divide-y divide-[#E2E8F0] border-t border-[#E2E8F0]">
          {bidang.map((item) => (
            <li
              key={item.jabatan}
              className="grid grid-cols-1 gap-1.5 py-4 md:grid-cols-12 md:items-baseline md:gap-6"
            >
              <h3 className="font-serif text-lg font-bold text-[#0F213E] md:col-span-5">
                {item.jabatan}
              </h3>
              <p className="text-sm leading-relaxed text-[#475569] md:col-span-7">
                {item.tugas}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
