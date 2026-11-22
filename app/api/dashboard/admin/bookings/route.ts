import { NextResponse } from "next/server";
import { Document } from "mongodb";
import {
  getDashboardDb,
  requireDashboardUser,
  serializeDocument,
} from "../../../../lib/dashboard-api";

export async function GET(request: Request) {
  const access = await requireDashboardUser(request, ["admin"]);
  if (!access.user) return access.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const filter: Document =
    status && ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"].includes(status)
      ? { status }
      : {};
  const db = await getDashboardDb();
  const bookings = await db
    .collection<Document>("bookings")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({ bookings: bookings.map(serializeDocument) });
}
