"use client";

import { FormEvent, useState } from "react";
import { uploadDashboardImage } from "./api";
import { primaryButtonClass } from "./DashboardComponents";

export interface ServiceFormValue {
  title: string;
  category: string;
  description: string;
  startingPrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  image: string;
}

const categories = [
  ["smartphone-tablet", "Smartphone & Tablet"],
  ["laptop-computer", "Laptop & Computer"],
  ["ac-service", "Air Conditioning"],
  ["refrigerator-repair", "Refrigerator"],
  ["washing-machine", "Washing Machine"],
  ["television-repair", "Television"],
  ["home-appliance", "Home Appliance"],
  ["smart-home-installation", "Smart Home Installation"],
];

export function ServiceForm({
  initialValue,
  technicianName,
  technicianEmail,
  submitLabel,
  onSave,
}: {
  initialValue?: Partial<ServiceFormValue>;
  technicianName: string;
  technicianEmail: string;
  submitLabel: string;
  onSave: (value: ServiceFormValue) => Promise<void>;
}) {
  const [values, setValues] = useState<ServiceFormValue>({
    title: initialValue?.title ?? "",
    category: initialValue?.category ?? "",
    description: initialValue?.description ?? "",
    startingPrice: Number(initialValue?.startingPrice ?? 0),
    estimatedDuration: initialValue?.estimatedDuration ?? "",
    serviceMode: initialValue?.serviceMode ?? "Home Visit",
    serviceArea: initialValue?.serviceArea ?? "",
    image: initialValue?.image ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof ServiceFormValue, value: string | number) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (
      !values.title.trim() ||
      !values.category ||
      values.description.trim().length < 20 ||
      !values.estimatedDuration.trim() ||
      !values.serviceArea.trim() ||
      !Number.isFinite(values.startingPrice) ||
      values.startingPrice <= 0 ||
      (!values.image && !file)
    ) {
      setError("Complete each field, use at least 20 characters for the description, and enter a positive price.");
      return;
    }

    setIsSaving(true);
    try {
      let image = values.image;
      if (file) {
        setIsUploading(true);
        image = await uploadDashboardImage(file);
        setIsUploading(false);
      }
      await onSave({ ...values, image });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this service.");
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-[#D7DCE3] bg-white px-3 py-2.5 text-sm text-[#172B4D] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-[#172B4D]">
          Technician name
          <input value={technicianName} readOnly className={`${inputClass} bg-slate-50 text-[#737B87]`} />
        </label>
        <label className="text-sm font-semibold text-[#172B4D]">
          Technician email
          <input type="email" value={technicianEmail} readOnly className={`${inputClass} bg-slate-50 text-[#737B87]`} />
        </label>
        <label className="text-sm font-semibold text-[#172B4D]">
          Service title
          <input value={values.title} onChange={(event) => update("title", event.target.value)} maxLength={100} required className={inputClass} />
        </label>
        <label className="text-sm font-semibold text-[#172B4D]">
          Category
          <select value={values.category} onChange={(event) => update("category", event.target.value)} required className={inputClass}>
            <option value="">Select a category</option>
            {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-[#172B4D]">
          Base price (৳)
          <input type="number" min="1" step="1" value={values.startingPrice || ""} onChange={(event) => update("startingPrice", Number(event.target.value))} required className={inputClass} />
        </label>
        <label className="text-sm font-semibold text-[#172B4D]">
          Estimated duration
          <input value={values.estimatedDuration} onChange={(event) => update("estimatedDuration", event.target.value)} placeholder="e.g. 1–2 hours" required className={inputClass} />
        </label>
        <label className="text-sm font-semibold text-[#172B4D]">
          Service mode
          <select value={values.serviceMode} onChange={(event) => update("serviceMode", event.target.value)} className={inputClass}>
            <option>Home Visit</option>
            <option>Shop Drop-off</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-[#172B4D]">
          Service area
          <input value={values.serviceArea} onChange={(event) => update("serviceArea", event.target.value)} required className={inputClass} />
        </label>
        <label className="text-sm font-semibold text-[#172B4D] sm:col-span-2">
          Description
          <textarea value={values.description} onChange={(event) => update("description", event.target.value)} minLength={20} rows={4} required className={inputClass} />
        </label>
        <label className="text-sm font-semibold text-[#172B4D] sm:col-span-2">
          Service image
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#2563EB]`}
          />
          {values.image && !file && <span className="mt-1 block text-xs text-[#737B87]">Current image will be kept unless another is selected.</span>}
        </label>
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={isSaving || isUploading} className={primaryButtonClass}>
        {isUploading ? "Uploading image..." : isSaving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
