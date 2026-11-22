import { NextResponse } from "next/server";
import { Document, ObjectId } from "mongodb";
import { getDashboardDb, requireDashboardUser } from "../../../../lib/dashboard-api";

const allowedRoles = ["customer", "technician", "admin"];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardUser(request, ["admin"]);
  if (!access.user) return access.response;
  const { id } = await context.params;
  if (id === access.user.id) {
    return NextResponse.json({ message: "You cannot change your own role." }, { status: 409 });
  }

  try {
    const body = await request.json() as Record<string, unknown>;
    if (typeof body.role !== "string" || !allowedRoles.includes(body.role)) {
      return NextResponse.json({ message: "Choose a valid user role." }, { status: 400 });
    }

    const db = await getDashboardDb();
    const identityFilter: Document = ObjectId.isValid(id)
      ? { $or: [{ id }, { _id: new ObjectId(id) }, { _id: id }] }
      : { id };
    const users = db.collection<Document & { _id?: ObjectId | string }>("user");
    const target = await users.findOne(identityFilter);
    if (!target) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    if (target.email === access.user.email) {
      return NextResponse.json({ message: "You cannot change your own role." }, { status: 409 });
    }
    const result = await users.updateOne(
      identityFilter,
      { $set: { role: body.role, updatedAt: new Date() } },
    );
    if (!result.matchedCount) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update this user.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
