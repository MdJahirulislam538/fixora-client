import "server-only";
import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import type { DashboardUser } from "./dashboard-api";

export async function forwardToFixoraServer(
  request: Request,
  path: string,
  user?: DashboardUser,
) {
  const serverUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const requestUrl = new URL(request.url);
  let targetUrl: URL;
  try {
    targetUrl = new URL(
      `${path.replace(/^\/+/, "")}${requestUrl.search}`,
      `${serverUrl.replace(/\/+$/, "")}/`,
    );
  } catch {
    return NextResponse.json(
      { message: "The Fixora server URL is invalid." },
      { status: 500 },
    );
  }

  const headers = new Headers({
    "x-fixora-client-url": process.env.BETTER_AUTH_URL ?? requestUrl.origin,
  });
  if (user) {
    const secret = process.env.BETTER_AUTH_SECRET;
    if (!secret) {
      return NextResponse.json(
        {
          message:
            "BETTER_AUTH_SECRET is missing from the FIXORA Client deployment.",
        },
        { status: 503 },
      );
    }
    const encodedUser = Buffer.from(JSON.stringify(user), "utf8").toString(
      "base64url",
    );
    const timestamp = Date.now().toString();
    headers.set("x-fixora-user", encodedUser);
    headers.set("x-fixora-timestamp", timestamp);
    headers.set(
      "x-fixora-signature",
      createHmac("sha256", secret)
        .update(`${timestamp}.${encodedUser}`)
        .digest("hex"),
    );
  }
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.text(),
      cache: "no-store",
    });
    const responseHeaders = new Headers();
    const responseType = response.headers.get("content-type");
    if (responseType) responseHeaders.set("content-type", responseType);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Unable to reach the Fixora Express server:", error);
    return NextResponse.json(
      { message: "The Fixora server could not be reached." },
      { status: 502 },
    );
  }
}
