export default function EventsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="bg-planora-muted/20 h-9 w-64 max-w-full animate-pulse rounded-md" />
      <div className="bg-planora-muted/20 mt-3 h-4 w-96 max-w-full animate-pulse rounded-md" />
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="border-planora-border h-80 animate-pulse rounded-lg border bg-white"
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
