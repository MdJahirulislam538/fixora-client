import { NextResponse } from "next/server";
import { Document } from "mongodb";
import {
  getDashboardDb,
  isNonEmptyString,
  readJsonObject,
  requireDashboardUser,
  serializeDocument,
} from "../../../lib/dashboard-api";

const serviceFields = [
  "title",
  "category",
  "description",
  "estimatedDuration",
  "serviceMode",
  "serviceArea",
  "image",
];

export async function GET(request: Request) {
  const access = await requireDashboardUser(request, ["technician", "admin"]);
  if (!access.user) return access.response;

  const db = await getDashboardDb();
  const filter: Document = access.user.role === "admin" ? {} : { technicianEmail: access.user.email };
  const { searchParams } = new URL(request.url);
  const approvalStatus = searchParams.get("approvalStatus");
  if (approvalStatus && ["pending", "approved", "rejected"].includes(approvalStatus)) {
    filter.approvalStatus = approvalStatus;
  }
  const services = await db
    .collection<Document>("services")
    .find(filter)
    .sort({ approvalStatus: 1, createdAt: -1 })
    .toArray();
  return NextResponse.json({ services: services.map(serializeDocument) });
}

export async function POST(request: Request) {
  const access = await requireDashboardUser(request, ["technician"]);
  if (!access.user) return access.response;

  try {
    const body = await readJsonObject(request);
    if (serviceFields.some((field) => !isNonEmptyString(body[field]))) {
      return NextResponse.json({ message: "Complete all service fields." }, { status: 400 });
    }
    
    const startingPrice = Number(body.startingPrice);
    if (!Number.isFinite(startingPrice) || startingPrice <= 0) {
      return NextResponse.json({ message: "Enter a positive base price." }, { status: 400 });
    }

    const db = await getDashboardDb();
    const technician = await db.collection<Document>("user").findOne({
      email: access.user.email,
    });

    const service: Document = {
      title: String(body.title).trim(),
      category: String(body.category).trim(),
      description: String(body.description).trim(),
      startingPrice,
      estimatedDuration: String(body.estimatedDuration).trim(),
      serviceMode: String(body.serviceMode).trim(),
      serviceArea: String(body.serviceArea).trim(),
      image: String(body.image).trim(),
      approvalStatus: "pending",
      isAvailable: true,
      technicianEmail: access.user.email,
      technician: {
        id: access.user.id,
        name: access.user.name,
        email: access.user.email,
        photo: technician?.image ?? "",
        area: technician?.area ?? "",
        bio: technician?.bio ?? "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection<Document>("services").insertOne(service);
    return NextResponse.json(
      { service: serializeDocument({ ...service, _id: result.insertedId }) },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save this service.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
