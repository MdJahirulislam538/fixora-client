import { NextResponse } from "next/server";
import { Document } from "mongodb";
import {
  getDashboardDb,
  isValidObjectId,
  requireDashboardUser,
  toObjectId,
} from "../../../../../lib/dashboard-api";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardUser(request, ["customer"]);
  if (!access.user) return access.response;
  const { id } = await context.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ message: "Online payment is not configured. Please contact support." }, { status: 503 });
  }

  const db = await getDashboardDb();
  const booking = await db.collection<Document>("bookings").findOne({
    _id: toObjectId(id),
    customerEmail: access.user.email,
    status: "completed",
    paymentStatus: "unpaid",
  });
  if (!booking) {
    return NextResponse.json({ message: "Only completed, unpaid bookings can be paid." }, { status: 409 });
  }
  const amount = Number(booking.finalAmount ?? booking.basePrice);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ message: "This booking has an invalid payment amount." }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const form = new URLSearchParams({
    mode: "payment",
    customer_email: access.user.email,
    success_url: `${origin}/dashboard/customer/bookings?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard/customer/bookings?checkout=cancelled`,
    "line_items[0][price_data][currency]": "bdt",
    "line_items[0][price_data][unit_amount]": String(Math.round(amount * 100)),
    "line_items[0][price_data][product_data][name]": String(booking.serviceTitle ?? "Repair service"),
    "line_items[0][quantity]": "1",
    "metadata[bookingId]": id,
    "metadata[customerId]": access.user.id,
  });
  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Idempotency-Key": `fixora-booking-${id}`,
    },
    body: form,
  });
  const result = await stripeResponse.json() as {
    url?: string;
    error?: { message?: string };
  };
  if (!stripeResponse.ok || !result.url) {
    return NextResponse.json(
      { message: result.error?.message ?? "Unable to start secure checkout." },
      { status: 502 },
    );
  }
  return NextResponse.json({ url: result.url });
}
