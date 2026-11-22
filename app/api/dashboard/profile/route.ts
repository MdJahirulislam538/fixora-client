import { NextResponse } from "next/server";
import { Document } from "mongodb";
import { getDashboardDb, requireDashboardUser } from "../../../lib/dashboard-api";

export async function GET(request: Request) {
  const access = await requireDashboardUser(request);
  if (!access.user) return access.response;

  const db = await getDashboardDb();
  const profile = await db.collection<Document>("user").findOne(
    { email: access.user.email },
    { projection: { phone: 1, area: 1, bio: 1 } },
  );
  return NextResponse.json({
    profile: {
      phone: profile?.phone ?? "",
      area: profile?.area ?? "",
      bio: profile?.bio ?? "",
    },
  });
}
