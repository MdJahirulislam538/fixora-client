export function LoadingSkeleton({
  label = "Loading",
  cards = 3,
}: {
  label?: string;
  cards?: number;
}) {
  return (
    <main
      aria-busy="true"
      aria-label={label}
      className="min-h-[60vh] bg-[#F5F7FA] px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <p className="sr-only">{label}...</p>
        <div className="mb-8 animate-pulse space-y-3">
          <div className="h-3 w-36 rounded bg-blue-100" />
          <div className="h-9 w-72 max-w-full rounded bg-slate-200" />
          <div className="h-4 w-[28rem] max-w-full rounded bg-slate-100" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }, (_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-xl border border-[#E5E7EB] bg-white"
            >
              <div className="h-44 bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-5 h-10 rounded-lg bg-blue-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
