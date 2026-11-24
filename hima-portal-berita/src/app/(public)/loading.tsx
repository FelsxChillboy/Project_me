export default function PublicLoading() {
  return (
    <div role="status" aria-live="polite" className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        <p className="text-sm font-medium text-[#475569]">
          Memuat halaman portal berita...
        </p>
        <div className="h-80 animate-pulse rounded-md border border-[#DCE2EA] bg-white" />
        <div className="h-44 animate-pulse rounded-md border border-[#DCE2EA] bg-white" />
      </div>
      <div className="space-y-6 lg:col-span-4">
        <div className="h-64 animate-pulse rounded-md border border-[#DCE2EA] bg-white" />
        <div className="h-44 animate-pulse rounded-md border border-[#DCE2EA] bg-white" />
      </div>
    </div>
  );
}
