export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <p className="text-sm font-medium text-[#475467]">
        Memuat halaman redaksi...
      </p>
      <div className="h-8 w-56 animate-pulse rounded bg-[#EFECE4]" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg border border-[#D8D1C3] bg-[#FFFDF9]"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-lg border border-[#D8D1C3] bg-[#FFFDF9]" />
    </div>
  );
}
