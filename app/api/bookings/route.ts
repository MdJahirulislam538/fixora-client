import { NextResponse } from "next/server";
import { Document } from "mongodb";
import {
  getDashboardDb,
  isNonEmptyString,
  isValidObjectId,
  readJsonObject,
  requireDashboardUser,
  serializeDocument,
  toObjectId,
} from "../../lib/dashboard-api";

export async function POST(request: Request) {
  const access = await requireDashboardUser(request, ["customer"]);
  if (!access.user) return access.response;

  try {
    const body = await readJsonObject(request);
    const customerPhone = body.customerPhone ?? body.phone;
    if (
      !isNonEmptyString(body.serviceId) ||
      !isNonEmptyString(customerPhone) ||
      !isNonEmptyString(body.address) ||
      !isNonEmptyString(body.preferredDate) ||
      !isNonEmptyString(body.problemDescription)
    ) {
      return NextResponse.json({ message: "Complete all booking fields." }, { status: 400 });
    }

    const serviceId = body.serviceId.trim();
    const preferredDateValue = body.preferredDate.trim();
    const problemDescription = body.problemDescription.trim();
    if (!isValidObjectId(serviceId)) {
      return NextResponse.json({ message: "Choose a valid service." }, { status: 400 });
    }
    if (problemDescription.length < 20) {
      return NextResponse.json(
        { message: "Describe the problem in at least 20 characters." },
        { status: 400 },
      );
    }

    const preferredDate = new Date(`${preferredDateValue}T00:00:00.000Z`);
    const today = new Date().toISOString().slice(0, 10);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(preferredDateValue) ||
      Number.isNaN(preferredDate.getTime()) ||
      preferredDate.toISOString().slice(0, 10) !== preferredDateValue ||
      preferredDateValue < today
    ) {
      return NextResponse.json({ message: "Choose today or a future date." }, { status: 400 });
    }

    const db = await getDashboardDb();
    const service = await db.collection<Document>("services").findOne({
      _id: toObjectId(serviceId),
      approvalStatus: "approved",
      isAvailable: true,
    });
    if (!service) {
      return NextResponse.json({ message: "This service is no longer available." }, { status: 404 });
    }

    const duplicate = await db.collection<Document>("bookings").findOne({
      $or: [
        { customerId: access.user.id },
        { customerEmail: access.user.email },
      ],
      serviceId,
      status: { $in: ["requested", "accepted", "in-progress"] },
    });
    if (duplicate) {
      return NextResponse.json(
        { message: "You already have an active request for this service" },
        { status: 409 },
      );
    }

    const basePrice = Number(service.basePrice ?? service.startingPrice);
    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      return NextResponse.json({ message: "The service has an invalid price." }, { status: 400 });
    }
    const technician = (service.technician ?? {}) as Record<string, unknown>;
    const booking: Document = {
      serviceId: service._id?.toString(),
      serviceTitle: service.title,
      serviceImage: service.image ?? "",
      category: service.category ?? "",
      basePrice,
      technicianName: service.technicianName ?? technician.name ?? "",
      technicianEmail: service.technicianEmail ?? technician.email ?? "",
      customerId: access.user.id,
      customerName: access.user.name,
      customerEmail: access.user.email,
      customerPhone: customerPhone.trim(),
      address: body.address.trim(),
      preferredDate,
      problemDescription,
      finalAmount: basePrice,
      status: "requested",
      paymentStatus: "unpaid",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection<Document>("bookings").insertOne(booking);
    return NextResponse.json(
      { booking: serializeDocument({ ...booking, _id: result.insertedId }) },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit your repair request.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
