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
    <div className="editorial-rule-top space-y-12 pt-6">
      <section className="grid grid-cols-1 gap-8 border-b border-[#D8D1C3] pb-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="font-serif text-[clamp(1.85rem,3.4vw,2.75rem)] font-bold leading-tight text-[#14263D]">
            Tentang HIMA Ilmu Hukum
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475467]">
            Himpunan Mahasiswa Ilmu Hukum (HIMA Ilmu Hukum) adalah organisasi
            kemahasiswaan di tingkat program studi yang mewadahi kegiatan
            akademik, kajian hukum, advokasi mahasiswa, dan pengabdian
            masyarakat.
          </p>
        </div>

        <aside className="rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-6 lg:col-span-5">
          <h2 className="font-serif text-lg font-bold text-[#14263D]">
            Informasi Sekretariat
          </h2>
          <dl className="mt-3 space-y-2.5 text-sm text-[#475467]">
            <div>
              <dt className="font-semibold text-[#14263D]">Alamat</dt>
              <dd>[Isi alamat sekretariat fakultas / kampus]</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#14263D]">Email Redaksi</dt>
              <dd>[Isi email resmi HIMA Ilmu Hukum]</dd>
            </div>
          </dl>
          <Link
            href="/berita"
            className="mt-5 inline-flex min-h-11 items-center rounded-md bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#14263D]"
          >
            Baca Publikasi Redaksi
          </Link>
        </aside>
      </section>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-7">
          <h2 className="font-serif text-2xl font-bold text-[#14263D]">Visi</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475467]">
            Menjadi himpunan mahasiswa hukum yang aktif mengembangkan budaya
            riset, penalaran hukum yang kritis, serta pengabdian yang nyata bagi
            mahasiswa dan masyarakat.
          </p>
        </div>

        <div className="rounded-lg border border-[#D8D1C3] bg-[#FFFDF9] p-7">
          <h2 className="font-serif text-2xl font-bold text-[#14263D]">Misi</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#475467]">
            <li>Menyelenggarakan forum kajian dan diskusi hukum secara berkala.</li>
            <li>Mendorong publikasi tulisan opini dan literasi hukum mahasiswa.</li>
            <li>Menjalin kerja sama akademik lintas organisasi dan praktisi hukum.</li>
            <li>Mengawal aspirasi mahasiswa serta kegiatan penyuluhan masyarakat.</li>
          </ul>
        </div>
      </section>

      <section className="border-t border-[#D8D1C3] pt-8">
        <h2 className="font-serif text-2xl font-bold text-[#14263D]">
          Struktur Bidang Kepengurusan
        </h2>
        <p className="mt-1.5 text-sm text-[#475467]">
          Pembagian tugas pokok pengurus HIMA Ilmu Hukum (nama pengurus periode
          berjalan dapat diperbarui sesuai SK kepengurusan aktif).
        </p>

        <ol className="mt-6 divide-y divide-[#D8D1C3] border-y border-[#D8D1C3] bg-[#FFFDF9]">
          {bidang.map((item) => (
            <li
              key={item.jabatan}
              className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-12 md:items-baseline md:gap-6"
            >
              <h3 className="font-serif text-lg font-bold text-[#14263D] md:col-span-5">
                {item.jabatan}
              </h3>
              <p className="text-sm leading-relaxed text-[#475467] md:col-span-7">
                {item.tugas}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
