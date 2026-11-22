"use client";

import { useEffect, useState } from "react";
import { authClient } from "../../../../app/lib/auth-client";
import {
  DashboardEmpty,
  DashboardError,
  DashboardPageHeading,
  DashboardTable,
  tableCellClass,
  tableHeaderClass,
} from "../../../../components/dashboard/DashboardComponents";
import { dashboardRequest } from "../../../../components/dashboard/api";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  createdAt: string | null;
}

const roles = ["customer", "technician", "admin"];

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  const loadUsers = async () => {
    const result = await dashboardRequest<{ users: AdminUser[] }>("/api/dashboard/users");
    setUsers(result.users);
    setSelectedRoles(Object.fromEntries(result.users.map((user) => [user.id, user.role || "customer"])));
  };

  useEffect(() => {
    let active = true;
    dashboardRequest<{ users: AdminUser[] }>("/api/dashboard/users")
      .then((result) => {
        if (!active) return;
        setUsers(result.users);
        setSelectedRoles(Object.fromEntries(result.users.map((user) => [user.id, user.role || "customer"])));
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load users.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateRole = async (user: AdminUser) => {
    const role = selectedRoles[user.id];
    if (!role || role === user.role) return;
    setSavingId(user.id);
    setError("");
    try {
      await dashboardRequest(`/api/dashboard/users/${encodeURIComponent(user.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      setNotice(`Updated ${user.name || user.email}'s role.`);
      await loadUsers();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update this role.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div>
      <DashboardPageHeading eyebrow="Admin" title="Manage Users" description="Review user accounts and assign customer, technician, or admin roles." />
      {notice && <p role="status" className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
      {error && <div className="mb-4"><DashboardError>{error}</DashboardError></div>}
      {loading ? (
        <p className="py-10 text-center text-sm text-[#737B87]">Loading users...</p>
      ) : users.length === 0 ? (
        <DashboardEmpty>No user accounts were found.</DashboardEmpty>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {users.map((user) => (
              <article key={user.id} className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                <UserInfo user={user} />
                <div className="mt-4"><RoleEditor user={user} currentUserId={session?.user.id ?? ""} value={selectedRoles[user.id] ?? user.role} saving={savingId === user.id} onChange={(role) => setSelectedRoles((current) => ({ ...current, [user.id]: role }))} onSave={() => void updateRole(user)} /></div>
              </article>
            ))}
          </div>
          <DashboardTable>
            <thead>
              <tr><th className={tableHeaderClass}>User</th><th className={tableHeaderClass}>Email</th><th className={tableHeaderClass}>Role</th><th className={tableHeaderClass}>Joined</th><th className={tableHeaderClass}>Action</th></tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className={tableCellClass}><UserInfo user={user} /></td>
                  <td className={tableCellClass}>{user.email}</td>
                  <td className={`${tableCellClass} capitalize`}>{user.role}</td>
                  <td className={tableCellClass}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                  <td className={tableCellClass}><RoleEditor user={user} currentUserId={session?.user.id ?? ""} value={selectedRoles[user.id] ?? user.role} saving={savingId === user.id} onChange={(role) => setSelectedRoles((current) => ({ ...current, [user.id]: role }))} onSave={() => void updateRole(user)} /></td>
                </tr>
              ))}
            </tbody>
          </DashboardTable>
        </>
      )}
    </div>
  );
}

function UserInfo({ user }: { user: AdminUser }) {
  return (
    <div className="flex items-center gap-3">
      {user.image ? <img src={user.image} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-slate-100" />}
      <div className="min-w-0"><p className="truncate font-semibold text-[#172B4D]">{user.name || "Unnamed user"}</p><p className="truncate text-xs text-[#737B87]">{user.email}</p></div>
    </div>
  );
}

function RoleEditor({
  user,
  currentUserId,
  value,
  saving,
  onChange,
  onSave,
}: {
  user: AdminUser;
  currentUserId: string;
  value: string;
  saving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}) {
  if (user.id === currentUserId) return <span className="text-xs text-[#737B87]">Your account</span>;
  return (
    <div className="flex items-center gap-2">
      <select aria-label={`Role for ${user.name || user.email}`} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-[#D7DCE3] bg-white px-2.5 py-2 text-xs capitalize">
        {roles.map((role) => <option key={role} value={role}>{role}</option>)}
      </select>
      <button type="button" disabled={saving || value === user.role} onClick={onSave} className="rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
    </div>
  );
}
