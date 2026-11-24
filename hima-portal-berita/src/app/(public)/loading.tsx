export default function PublicLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-8">
      <p className="text-sm font-medium text-[#475467]">
        Memuat halaman portal berita...
      </p>
      <div className="h-56 animate-pulse rounded-lg border border-[#D8D1C3] bg-[#EFECE4]" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-lg border border-[#D8D1C3] bg-[#FFFDF9]"
          >
            <div className="aspect-[16/10] bg-[#EFECE4]" />
            <div className="space-y-3 p-5">
              <div className="h-3.5 w-20 rounded bg-[#EFECE4]" />
              <div className="h-5 w-4/5 rounded bg-[#EFECE4]" />
              <div className="h-4 w-full rounded bg-[#EFECE4]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
