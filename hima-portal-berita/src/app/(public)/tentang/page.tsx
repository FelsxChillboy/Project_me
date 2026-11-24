export default function TentangPage() {
  const struktur = [
    { nama: "Nama Ketua", jabatan: "Ketua HIMA" },
    { nama: "Nama Wakil", jabatan: "Wakil Ketua" },
  ];
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Tentang HIMA</h1>
      <h2 className="mt-4 font-serif text-xl font-bold">Visi & Misi</h2>
      <p className="mt-2">Visi organisasi. Misi organisasi.</p>
      <h2 className="mt-4 font-serif text-xl font-bold">Struktur Organisasi</h2>
      <ul className="mt-2 list-disc pl-5">
        {struktur.map((s, i) => (
          <li key={i}>{s.nama} — {s.jabatan}</li>
        ))}
      </ul>
      <h2 className="mt-4 font-serif text-xl font-bold">Sejarah</h2>
      <p className="mt-2">Sejarah singkat organisasi.</p>
    </div>
  );
}
