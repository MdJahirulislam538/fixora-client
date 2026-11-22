import { NextResponse } from "next/server";
import { Document } from "mongodb";
import {
  getDashboardDb,
  isNonEmptyString,
  isValidObjectId,
  readJsonObject,
  requireDashboardUser,
  toObjectId,
} from "../../../../lib/dashboard-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardUser(request, ["technician", "admin"]);
  if (!access.user) return access.response;
  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Service not found." }, { status: 404 });
  }

  try {
    const body = await readJsonObject(request);
    const db = await getDashboardDb();
    const services = db.collection<Document>("services");
    const ownerFilter: Document =
      access.user.role === "admin"
        ? { _id: toObjectId(id) }
        : { _id: toObjectId(id), technicianEmail: access.user.email };
    const service = await services.findOne(ownerFilter);
    if (!service) {
      return NextResponse.json({ message: "Service not found." }, { status: 404 });
    }

    if (access.user.role === "admin") {
      if (body.approvalStatus !== "approved" && body.approvalStatus !== "rejected") {
        return NextResponse.json({ message: "Choose approve or reject." }, { status: 400 });
      }
      await services.updateOne(ownerFilter, {
        $set: { approvalStatus: body.approvalStatus, updatedAt: new Date() },
      });
      return NextResponse.json({ success: true });
    }

    if (typeof body.isAvailable === "boolean" && Object.keys(body).length === 1) {
      await services.updateOne(ownerFilter, {
        $set: { isAvailable: body.isAvailable, updatedAt: new Date() },
      });
      return NextResponse.json({ success: true });
    }

    const fields = [
      "title",
      "category",
      "description",
      "estimatedDuration",
      "serviceMode",
      "serviceArea",
      "image",
    ];
    if (fields.some((field) => !isNonEmptyString(body[field]))) {
      return NextResponse.json({ message: "Complete all service fields." }, { status: 400 });
    }
    const startingPrice = Number(body.startingPrice);
    if (!Number.isFinite(startingPrice) || startingPrice <= 0) {
      return NextResponse.json({ message: "Enter a positive base price." }, { status: 400 });
    }
    const update: Document = {
      ...Object.fromEntries(fields.map((field) => [field, String(body[field]).trim()])),
      startingPrice,
      approvalStatus: "pending",
      updatedAt: new Date(),
    };
    await services.updateOne(ownerFilter, { $set: update });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update this service.";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardUser(request, ["technician"]);
  if (!access.user) return access.response;
  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Service not found." }, { status: 404 });
  }
  const db = await getDashboardDb();
  const result = await db.collection<Document>("services").deleteOne({
    _id: toObjectId(id),
    technicianEmail: access.user.email,
  });
  if (!result.deletedCount) {
    return NextResponse.json({ message: "Service not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
