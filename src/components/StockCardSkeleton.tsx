export default function StockCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl2 border border-line bg-panel p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-ink-300/30" />
          <div className="h-3 w-32 rounded bg-ink-300/20" />
        </div>
        <div className="h-6 w-20 rounded-full bg-ink-300/20" />
      </div>
      <div className="mt-5 h-8 w-32 rounded bg-ink-300/30" />
      <div className="mt-6 grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-ink-300/15" />
        ))}
      </div>
      <div className="mt-5 h-3 w-40 rounded bg-ink-300/20" />
    </div>
  );
}
