import { NextResponse } from "next/server";
import { Document } from "mongodb";
import {
  getDashboardDb,
  isValidObjectId,
  requireDashboardUser,
  toObjectId,
} from "../../../../lib/dashboard-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardUser(request, ["customer"]);
  if (!access.user) return access.response;

  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }
  const db = await getDashboardDb();
  const result = await db.collection<Document>("bookings").updateOne(
    {
      _id: toObjectId(id),
      customerEmail: access.user.email,
      status: "requested",
    },
    { $set: { status: "cancelled", updatedAt: new Date() } },
  );
  if (!result.matchedCount) {
    return NextResponse.json({ message: "Only requested bookings can be cancelled." }, { status: 409 });
  }
  return NextResponse.json({ success: true });
}
