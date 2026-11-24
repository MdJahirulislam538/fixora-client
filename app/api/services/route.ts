import { NextResponse } from "next/server";
import { Document } from "mongodb";
import { getDashboardDb, serializeDocument } from "../../lib/dashboard-api";

export async function GET(request: Request) {
  const db = await getDashboardDb();
  const includeUnavailable =
    new URL(request.url).searchParams.get("includeUnavailable") === "true";
  const services = await db
    .collection<Document>("services")
    .find(
      includeUnavailable
        ? { approvalStatus: "approved" }
        : { approvalStatus: "approved", isAvailable: true },
    )
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({ services: services.map(serializeDocument) });
}
