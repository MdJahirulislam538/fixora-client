import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#F5F7FA] px-4 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-50">
          <svg
            aria-hidden="true"
            viewBox="0 0 96 96"
            fill="none"
            className="h-16 w-16"
          >
            <path
              d="M57 18a22 22 0 0 0 27 27L55 74l-14-14 29-29A22 22 0 0 0 57 18Z"
              stroke="#2563EB"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            <path
              d="m18 72 8-8 19 19-8 8a9 9 0 0 1-13 0l-6-6a9 9 0 0 1 0-13Z"
              fill="#93C5FD"
              stroke="#2563EB"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="70" cy="27" r="4" fill="#2563EB" />
          </svg>
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">
          404 · Wrong turn
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#172B4D]">
          This page needs a repair
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#737B87]">
          We couldn&apos;t find the page you were looking for. Head back home and
          we&apos;ll help you find the right service.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
