"use client";

import { FormEvent, useEffect, useState } from "react";
import { authClient } from "../../../app/lib/auth-client";
import { DashboardError, DashboardPageHeading, primaryButtonClass } from "../../../components/dashboard/DashboardComponents";
import { dashboardRequest, uploadDashboardImage } from "../../../components/dashboard/api";

interface ProfileFields {
  phone: string;
  area: string;
  bio: string;
}

export default function UpdateProfilePage() {
  const { data: session } = authClient.useSession();
  const [name, setName] = useState<string | null>(null);
  const [fields, setFields] = useState<ProfileFields>({ phone: "", area: "", bio: "" });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    dashboardRequest<{ profile: ProfileFields }>("/api/dashboard/profile")
      .then((result) => {
        if (active) setFields(result.profile);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load your profile.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateField = (field: keyof ProfileFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const user = session?.user;
    const updatedName = name ?? user?.name ?? "";
    if (!user || !updatedName.trim() || !fields.phone.trim() || !fields.area.trim() || fields.bio.trim().length < 10) {
      setError("Enter your name, phone, area, and a bio of at least 10 characters.");
      return;
    }

    setIsSaving(true);
    try {
      let image = user.image ?? "";
      if (file) image = await uploadDashboardImage(file);
      const { error: updateError } = await authClient.updateUser({
        name: updatedName.trim(),
        image,
        phone: fields.phone.trim(),
        area: fields.area.trim(),
        bio: fields.bio.trim(),
      });
      if (updateError) {
        throw new Error(updateError.message || "Unable to save your profile.");
      }
      setNotice("Your profile has been updated.");
      setFile(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-[#D7DCE3] bg-white px-3 py-2.5 text-sm text-[#172B4D] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100";

  return (
    <div>
      <DashboardPageHeading
        eyebrow="Account"
        title="Update Profile"
        description="Keep your contact details and profile photo up to date."
      />
      {error && <div className="mb-4"><DashboardError>{error}</DashboardError></div>}
      {notice && <p role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
      {isLoading || !session?.user ? (
        <p className="py-10 text-center text-sm text-[#737B87]">Loading profile...</p>
      ) : (
        <section className="max-w-3xl rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-4">
            {session.user.image ? (
              <img src={session.user.image} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF] text-lg font-bold text-[#2563EB]">
                {session.user.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-[#172B4D]">{name ?? session.user.name}</p>
              <p className="text-sm capitalize text-[#737B87]">{session.user.role ?? "customer"}</p>
            </div>
          </div>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[#172B4D]">
              Name
              <input value={name ?? session.user.name} onChange={(event) => setName(event.target.value)} required className={inputClass} />
            </label>
            <label className="text-sm font-semibold text-[#172B4D]">
              Phone
              <input type="tel" value={fields.phone} onChange={(event) => updateField("phone", event.target.value)} required className={inputClass} />
            </label>
            <label className="text-sm font-semibold text-[#172B4D]">
              Area
              <input value={fields.area} onChange={(event) => updateField("area", event.target.value)} required className={inputClass} />
            </label>
            <label className="text-sm font-semibold text-[#172B4D]">
              Email (read-only)
              <input type="email" value={session.user.email} readOnly className={`${inputClass} bg-slate-50 text-[#737B87]`} />
            </label>
            <label className="text-sm font-semibold text-[#172B4D] sm:col-span-2">
              Bio
              <textarea value={fields.bio} onChange={(event) => updateField("bio", event.target.value)} rows={4} minLength={10} required className={inputClass} />
            </label>
            <label className="text-sm font-semibold text-[#172B4D] sm:col-span-2">
              Profile photo
              <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#2563EB]`} />
            </label>
            <p className="text-xs text-[#737B87] sm:col-span-2">
              Email and role cannot be changed here.
            </p>
            <div className="sm:col-span-2">
              <button type="submit" disabled={isSaving} className={primaryButtonClass}>
                {isSaving ? "Saving profile..." : "Save Profile"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
