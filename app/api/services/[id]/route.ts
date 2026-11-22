import { NextResponse } from "next/server";
import { Document } from "mongodb";
import {
  getDashboardDb,
  isValidObjectId,
  serializeDocument,
  toObjectId,
} from "../../../lib/dashboard-api";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Service not found." }, { status: 404 });
  }
  const db = await getDashboardDb();
  const service = await db
    .collection<Document>("services")
    .findOne({ _id: toObjectId(id), approvalStatus: "approved", isAvailable: true });
  if (!service) {
    return NextResponse.json({ message: "Service not found." }, { status: 404 });
  }
  return NextResponse.json({ service: serializeDocument(service) });
}
