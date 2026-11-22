import { NextResponse } from "next/server";
import { Document } from "mongodb";
import {
  getDashboardDb,
  requireDashboardUser,
  serializeDocument,
} from "../../../lib/dashboard-api";

export async function GET(request: Request) {
  const access = await requireDashboardUser(request, ["customer"]);
  if (!access.user) return access.response;

  const db = await getDashboardDb();
  const bookings = await db
    .collection<Document>("bookings")
    .find({ customerEmail: access.user.email })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({ bookings: bookings.map(serializeDocument) });
}
