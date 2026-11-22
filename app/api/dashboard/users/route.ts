import { NextResponse } from "next/server";
import { Document } from "mongodb";
import { getDashboardDb, requireDashboardUser } from "../../../lib/dashboard-api";

export async function GET(request: Request) {
  const access = await requireDashboardUser(request, ["admin"]);
  if (!access.user) return access.response;

  const db = await getDashboardDb();
  const users = await db
    .collection<Document>("user")
    .find({}, { projection: { name: 1, email: 1, image: 1, role: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({
    users: users.map((user) => ({
      id: String(user.id ?? user._id),
      name: user.name ?? "",
      email: user.email ?? "",
      image: user.image ?? "",
      role: user.role ?? "customer",
      createdAt: user.createdAt ?? null,
    })),
  });
}
