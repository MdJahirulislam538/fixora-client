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

const transitions: Record<string, string[]> = {
  requested: ["accepted", "rejected"],
  accepted: ["in-progress"],
  "in-progress": ["completed"],
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardUser(request, ["technician"]);
  if (!access.user) return access.response;

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }
  try {
    const body = await readJsonObject(request);
    if (!isNonEmptyString(body.status)) {
      return NextResponse.json({ message: "Choose a valid next status." }, { status: 400 });
    }

    const db = await getDashboardDb();
    const bookings = db.collection<Document>("bookings");
    const booking = await bookings.findOne({
      _id: toObjectId(id),
      technicianEmail: access.user.email,
    });
    if (!booking) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }
    if (!transitions[String(booking.status)]?.includes(body.status)) {
      return NextResponse.json({ message: "That booking status change is not allowed." }, { status: 409 });
    }

    await bookings.updateOne(
      { _id: toObjectId(id), technicianEmail: access.user.email, status: booking.status },
      { $set: { status: body.status, updatedAt: new Date() } },
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update this request.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
