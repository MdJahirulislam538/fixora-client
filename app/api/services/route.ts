import { NextResponse } from "next/server";
import { Document } from "mongodb";
import { getDashboardDb, serializeDocument } from "../../lib/dashboard-api";

export async function GET() {
  const db = await getDashboardDb();
  const services = await db
    .collection<Document>("services")
    .find({ approvalStatus: "approved", isAvailable: true })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({ services: services.map(serializeDocument) });
}
