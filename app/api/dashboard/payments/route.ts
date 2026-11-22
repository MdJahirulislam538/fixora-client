import { NextResponse } from "next/server";
import { Document } from "mongodb";
import {
  getDashboardDb,
  requireDashboardUser,
  serializeDocument,
} from "../../../lib/dashboard-api";

export async function GET(request: Request) {
  const access = await requireDashboardUser(request, ["customer", "admin"]);
  if (!access.user) return access.response;

  const db = await getDashboardDb();
  const filter = access.user.role === "admin"
    ? {}
    : { customerEmail: access.user.email };
  const payments = await db
    .collection<Document>("payments")
    .find(filter)
    .sort({ paidAt: -1 })
    .toArray();
  return NextResponse.json({ payments: payments.map(serializeDocument) });
}
