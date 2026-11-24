"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../app/lib/auth-client";
import { getServiceId, ServiceRecord } from "./ServiceData";

interface RepairRequestFormProps {
  service: ServiceRecord;
}

function getLocalDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export function RepairRequestForm({ service }: RepairRequestFormProps) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user;
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setToday(getLocalDate()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setToast("");

    if (!phone.trim() || !address.trim() || !preferredDate || !problemDescription.trim()) {
      setFormError("Complete all fields before submitting.");
      return;
    }
    if (preferredDate < getLocalDate()) {
      setFormError("Choose today or a future date.");
      return;
    }
    if (problemDescription.trim().length < 20) {
      setFormError("Describe the problem in at least 20 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: getServiceId(service),
          customerPhone: phone.trim(),
          address: address.trim(),
          preferredDate,
          problemDescription: problemDescription.trim(),
        }),
      });

      const result = await response.json().catch(() => null);
      if (response.status === 409) {
        throw new Error("You already have an active request for this service");
      }
      if (response.status === 401) {
        const returnTo = `${window.location.pathname}${window.location.search}`;
        router.push(`/sign-in?redirectTo=${encodeURIComponent(returnTo)}`);
        return;
      }
      if (!response.ok) {
        throw new Error(result?.message || result?.error || "Unable to submit your repair request.");
      }

      setHasSubmitted(true);
      setToast("Repair request submitted successfully.");
    } catch (error) {
      setToast(
        error instanceof Error ? error.message : "Unable to submit your repair request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionPending) {
    return <p className="mt-8 text-sm text-[#737B87]">Checking your account...</p>;
  }
  if (!user) {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    return (
      <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm text-[#172B4D]">Sign in as a customer to request this repair.</p>
        <Link
          href={`/sign-in?redirectTo=${encodeURIComponent(returnTo)}`}
          className="mt-3 inline-flex rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
        >
          Sign In to Request
        </Link>
      </div>
    );
  }
  if (user.role !== "customer") {
    return (
      <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Repair requests are available to customer accounts only.
      </p>
    );
  }

  if (hasSubmitted) {
    return (
      <>
        <div
          role="status"
          className="fixed right-4 top-4 z-50 max-w-sm rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-800">Your repair request is in your bookings.</p>
          <Link
            href="/dashboard/customer/bookings"
            className="mt-3 inline-flex text-sm font-semibold text-[#2563EB] hover:underline"
          >
            Go to My Bookings
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="mt-8 border-t border-[#E5E7EB] pt-8">
      <h2 className="text-xl font-bold text-[#172B4D]">Request Repair</h2>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="request-name" className="mb-1.5 block text-sm font-semibold text-[#172B4D]">Name</label>
          <input id="request-name" value={user.name} readOnly className="w-full rounded-lg border border-[#E5E7EB] bg-slate-50 px-3 py-2.5 text-sm text-[#737B87]" />
        </div>
        <div>
          <label htmlFor="request-email" className="mb-1.5 block text-sm font-semibold text-[#172B4D]">Email</label>
          <input id="request-email" type="email" value={user.email} readOnly className="w-full rounded-lg border border-[#E5E7EB] bg-slate-50 px-3 py-2.5 text-sm text-[#737B87]" />
        </div>
        <div>
          <label htmlFor="request-phone" className="mb-1.5 block text-sm font-semibold text-[#172B4D]">Phone</label>
          <input id="request-phone" type="tel" autoComplete="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#172B4D]" />
        </div>
        <div>
          <label htmlFor="preferred-date" className="mb-1.5 block text-sm font-semibold text-[#172B4D]">Preferred Date</label>
          <input id="preferred-date" type="date" min={today} required value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#172B4D]" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="request-address" className="mb-1.5 block text-sm font-semibold text-[#172B4D]">Address</label>
          <input id="request-address" autoComplete="street-address" required value={address} onChange={(event) => setAddress(event.target.value)} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#172B4D]" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="problem-description" className="mb-1.5 block text-sm font-semibold text-[#172B4D]">
            Problem Description <span className="font-normal text-[#737B87]">(at least 20 characters)</span>
          </label>
          <textarea id="problem-description" required minLength={20} rows={4} value={problemDescription} onChange={(event) => setProblemDescription(event.target.value)} className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#172B4D]" />
        </div>
        {formError && <p role="alert" className="sm:col-span-2 text-sm text-red-700">{formError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="sm:col-span-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting request..." : "Submit Repair Request"}
        </button>
      </form>
      {toast && (
        <div role="alert" className="fixed right-4 top-4 z-50 max-w-sm rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
