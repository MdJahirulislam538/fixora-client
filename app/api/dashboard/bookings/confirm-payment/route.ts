import { NextResponse } from "next/server";
import { Document } from "mongodb";
import {
  getDashboardDb,
  isNonEmptyString,
  requireDashboardUser,
  toObjectId,
  isValidObjectId,
} from "../../../../lib/dashboard-api";

export async function POST(request: Request) {
  const access = await requireDashboardUser(request, ["customer"]);
  if (!access.user) return access.response;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ message: "Online payment is not configured." }, { status: 503 });
  }

  const body = await request.json() as Record<string, unknown>;
  if (!isNonEmptyString(body.sessionId)) {
    return NextResponse.json({ message: "Checkout session is required." }, { status: 400 });
  }
  const stripeResponse = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(body.sessionId)}`,
    { headers: { Authorization: `Bearer ${secretKey}` } },
  );
  const checkout = await stripeResponse.json() as {
    id?: string;
    payment_status?: string;
    metadata?: { bookingId?: string; customerId?: string };
    amount_total?: number;
    payment_intent?: string | { id: string };
    currency?: string;
    error?: { message?: string };
  };
  if (!stripeResponse.ok) {
    return NextResponse.json({ message: checkout.error?.message ?? "Unable to verify payment." }, { status: 502 });
  }
  const bookingId = checkout.metadata?.bookingId;
  if (
    checkout.payment_status !== "paid" ||
    checkout.metadata?.customerId !== access.user.id ||
    !bookingId ||
    !isValidObjectId(bookingId)
  ) {
    return NextResponse.json({ message: "This checkout session is not a completed payment for your account." }, { status: 409 });
  }

  const db = await getDashboardDb();
  const paymentIntentId = typeof checkout.payment_intent === "string"
    ? checkout.payment_intent
    : checkout.payment_intent?.id ?? checkout.id;
  const bookings = db.collection<Document>("bookings");
  const booking = await bookings.findOne({
    _id: toObjectId(bookingId),
    customerEmail: access.user.email,
    status: "completed",
  });
  if (!booking) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }

  const payments = db.collection<Document>("payments");
  await payments.updateOne(
    { transactionId: paymentIntentId },
    {
      $setOnInsert: {
        bookingId,
        customerId: access.user.id,
        customerName: booking.customerName,
        customerEmail: access.user.email,
        technicianName: booking.technicianName,
        technicianEmail: booking.technicianEmail,
        serviceTitle: booking.serviceTitle,
        amount: Number(checkout.amount_total ?? 0) / 100,
        currency: checkout.currency ?? "bdt",
        transactionId: paymentIntentId,
        paidAt: new Date(),
      },
    },
    { upsert: true },
  );
  await bookings.updateOne(
    { _id: toObjectId(bookingId), customerEmail: access.user.email },
    { $set: { paymentStatus: "paid", updatedAt: new Date() } },
  );
  return NextResponse.json({ success: true });
}
