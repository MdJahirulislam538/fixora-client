import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "./auth";
import { getDb } from "./mongodb";

export type DashboardRole = "customer" | "technician" | "admin";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: DashboardRole;
  image?: string | null;
}

export async function getDashboardUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  const user = session?.user;
  if (!user) return null;

  const role =
    user.role === "technician" || user.role === "admin" ? user.role : "customer";
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    image: user.image,
  } satisfies DashboardUser;
}

export async function requireDashboardUser(
  request: Request,
  roles?: DashboardRole[],
) {
  const user = await getDashboardUser(request);
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ message: "Sign in to continue." }, { status: 401 }),
    };
  }
  if (roles && !roles.includes(user.role)) {
    return {
      user: null,
      response: NextResponse.json({ message: "You do not have permission." }, { status: 403 }),
    };
  }
  return { user, response: null };
}

export async function readJsonObject(request: Request) {
  const body: unknown = await request.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Request body must be an object.");
  }
  return body as Record<string, unknown>;
}

export function isValidObjectId(value: string) {
  return ObjectId.isValid(value) && new ObjectId(value).toString() === value;
}

export function toObjectId(value: string) {
  return new ObjectId(value);
}

export function serializeDocument<T extends { _id?: ObjectId }>(document: T) {
  const id = document._id?.toString();
  return { ...document, _id: id, id };
}

export function errorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ message }, { status: 400 });
}

export async function getDashboardDb() {
  return getDb();
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
