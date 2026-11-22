import { NextResponse } from "next/server";
import { Collection, Document } from "mongodb";
import { getDashboardDb, requireDashboardUser } from "../../../lib/dashboard-api";

async function getActivityDays(
  collection: Collection<Document>,
  filter: Document,
) {
  const now = new Date();
  const firstDay = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - 6,
  ));
  const counts = await collection.aggregate<{ _id: string; value: number }>([
    { $match: { ...filter, createdAt: { $gte: firstDay } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        value: { $sum: 1 },
      },
    },
  ]).toArray();
  const countsByDay = new Map(counts.map((count) => [count._id, count.value]));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - (6 - index),
    ));
    const key = date.toISOString().slice(0, 10);
    return {
      label: date.toLocaleDateString("en", { weekday: "short", timeZone: "UTC" }),
      value: countsByDay.get(key) ?? 0,
    };
  });
}

export async function GET(request: Request) {
  const access = await requireDashboardUser(request);
  if (!access.user) return access.response;

  const { user } = access;
  const db = await getDashboardDb();
  const bookings = db.collection<Document>("bookings");
  const services = db.collection<Document>("services");
  const users = db.collection<Document>("user");

  if (user.role === "customer") {
    const filter = { customerEmail: user.email };
    const [total, active, completed, activity] = await Promise.all([
      bookings.countDocuments(filter),
      bookings.countDocuments({ ...filter, status: { $in: ["requested", "accepted", "in-progress"] } }),
      bookings.countDocuments({ ...filter, status: "completed" }),
      getActivityDays(bookings, filter),
    ]);
    return NextResponse.json({
      stats: [
        { label: "Total Requests", value: total },
        { label: "Active Jobs", value: active },
        { label: "Completed Jobs", value: completed },
      ],
      activity,
    });
  }

  if (user.role === "technician") {
    const serviceFilter = { technicianEmail: user.email };
    const requestFilter = {
      technicianEmail: user.email,
      status: "requested",
    };
    const [totalServices, approvedServices, pendingRequests, activity] =
      await Promise.all([
        services.countDocuments(serviceFilter),
        services.countDocuments({ ...serviceFilter, approvalStatus: "approved" }),
        bookings.countDocuments(requestFilter),
        getActivityDays(services, serviceFilter),
      ]);
    return NextResponse.json({
      stats: [
        { label: "Total Services", value: totalServices },
        { label: "Approved Services", value: approvedServices },
        { label: "Pending Requests", value: pendingRequests },
      ],
      activity,
    });
  }

  const [totalUsers, totalTechnicians, pendingServices, activity] =
    await Promise.all([
      users.countDocuments({}),
      users.countDocuments({ role: "technician" }),
      services.countDocuments({ approvalStatus: "pending" }),
      getActivityDays(bookings, {}),
    ]);
  return NextResponse.json({
    stats: [
      { label: "Total Users", value: totalUsers },
      { label: "Total Technicians", value: totalTechnicians },
      { label: "Pending Services", value: pendingServices },
    ],
    activity,
  });
}
