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

  const legacyTechnician = (service.technician ?? {}) as Document;
  const technicianEmail = service.technicianEmail ?? legacyTechnician.email;
  const technicianProfile =
    typeof technicianEmail === "string"
      ? await db.collection<Document>("user").findOne(
          { email: technicianEmail },
          { projection: { name: 1, image: 1, area: 1, bio: 1 } },
        )
      : null;
  const technician = {
    id: legacyTechnician.id ?? technicianProfile?._id?.toString() ?? "",
    name: service.technicianName ?? legacyTechnician.name ?? technicianProfile?.name ?? "Technician",
    photo: legacyTechnician.photo ?? technicianProfile?.image ?? "",
    area: legacyTechnician.area ?? technicianProfile?.area ?? "",
    bio: legacyTechnician.bio ?? technicianProfile?.bio ?? "",
  };
  return NextResponse.json({
    service: serializeDocument({ ...service, technician }),
  });
}
