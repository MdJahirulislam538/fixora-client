import { ReactNode } from "react";

export function DashboardPageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2563EB]">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#172B4D] sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-2 text-sm text-[#737B87]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatsCards({
  stats,
}: {
  stats: { label: string; value: number | string; hint?: string }[];
}) {
  return (
    <section aria-label="Overview statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat, index) => (
        <article
          key={stat.label}
          className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#737B87]">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-[#172B4D]">
                {stat.value}
              </p>
              {stat.hint && <p className="mt-2 text-xs text-[#737B87]">{stat.hint}</p>}
            </div>
            <span className={`h-10 w-10 rounded-xl ${["bg-blue-50", "bg-emerald-50", "bg-amber-50"][index % 3]}`} />
          </div>
        </article>
      ))}
    </section>
  );
}

export function ActivityChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...data.map((item) => item.value));
  return (
    <section className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h3 className="font-bold text-[#172B4D]">{title}</h3>
        <p className="mt-1 text-xs text-[#737B87]">{subtitle}</p>
      </div>
      <div className="mt-5 h-52 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#737B87]">
            No activity to chart yet.
          </div>
        ) : (
          <svg
            role="img"
            aria-label={`${title} bar chart`}
            viewBox="0 0 700 190"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            <line x1="20" y1="150" x2="690" y2="150" stroke="#E5E7EB" />
            <line x1="20" y1="100" x2="690" y2="100" stroke="#F1F5F9" />
            <line x1="20" y1="50" x2="690" y2="50" stroke="#F1F5F9" />
            {data.map((item, index) => {
              const x = 45 + index * (620 / Math.max(data.length, 1));
              const barHeight = (item.value / max) * 112;
              return (
                <g key={`${item.label}-${index}`}>
                  <rect
                    x={x}
                    y={150 - barHeight}
                    width="42"
                    height={Math.max(3, barHeight)}
                    rx="6"
                    fill="#2563EB"
                    opacity={0.75 + index * 0.03}
                  />
                  <text x={x + 21} y="174" textAnchor="middle" fill="#737B87" fontSize="11">
                    {item.label}
                  </text>
                  <text x={x + 21} y={Math.max(25, 142 - barHeight)} textAnchor="middle" fill="#172B4D" fontSize="11">
                    {item.value}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </section>
  );
}

const badgeStyles: Record<string, string> = {
  requested: "bg-blue-50 text-blue-700",
  accepted: "bg-indigo-50 text-indigo-700",
  "in-progress": "bg-amber-50 text-amber-800",
  completed: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
  pending: "bg-amber-50 text-amber-800",
  approved: "bg-emerald-50 text-emerald-700",
  paid: "bg-emerald-50 text-emerald-700",
  unpaid: "bg-amber-50 text-amber-800",
};

export function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const label =
    normalized === "in-progress"
      ? "In Progress"
      : normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        badgeStyles[normalized] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {label}
    </span>
  );
}

export function DashboardError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </p>
  );
}

export function DashboardLoading({
  label = "Loading dashboard",
}: {
  label?: string;
}) {
  return (
    <div aria-busy="true" aria-label={label} className="space-y-5">
      <p className="sr-only">{label}...</p>
      <div className="animate-pulse space-y-3">
        <div className="h-7 w-56 rounded bg-slate-200" />
        <div className="h-4 w-80 max-w-full rounded bg-slate-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-[#E5E7EB] bg-white p-5"
          >
            <div className="h-4 w-1/2 rounded bg-slate-100" />
            <div className="mt-5 h-7 w-1/3 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="h-56 animate-pulse rounded-xl border border-[#E5E7EB] bg-white" />
    </div>
  );
}

export function DashboardEmpty({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-[#737B87]">
      <div>{children}</div>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function DashboardTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-[#E5E7EB] text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export const tableHeaderClass =
  "bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#737B87]";
export const tableCellClass = "px-4 py-3.5 align-middle text-sm text-[#454B54]";
export const primaryButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60";
export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#172B4D] hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-60";
