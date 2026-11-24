"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#F5F7FA] px-4 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600">
          !
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#172B4D]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#737B87]">
          This page ran into a problem. You can try again or return to FIXORA.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-[#172B4D] hover:bg-[#F5F7FA]"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
