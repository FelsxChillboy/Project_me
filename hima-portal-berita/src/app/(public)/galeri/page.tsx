export default function GaleriPage() {
  const fotos = ["/uploads/placeholder.jpg"];
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Galeri</h1>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {fotos.map((f, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={f} alt="galeri" className="h-40 w-full rounded object-cover" />
        ))}
      </div>
    </div>
  );
}
