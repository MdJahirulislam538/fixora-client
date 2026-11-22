"use client";

export async function dashboardRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    credentials: "same-origin",
    ...init,
    headers: {
      ...(init?.body && typeof init.body === "string"
        ? { "Content-Type": "application/json" }
        : {}),
      ...init?.headers,
    },
  });
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      result && typeof result === "object" && "message" in result &&
      typeof result.message === "string"
        ? result.message
        : "The request could not be completed.";
    throw new Error(message);
  }
  return result as T;
}

export async function uploadDashboardImage(file: File) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("Image upload is not configured. Set NEXT_PUBLIC_IMGBB_API_KEY.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose an image file.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Choose an image smaller than 10 MB.");
  }
  const body = new FormData();
  body.set("image", file);
  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    { method: "POST", body },
  );
  const result = await response.json().catch(() => null) as {
    success?: boolean;
    data?: { url?: string };
    error?: { message?: string };
  } | null;
  if (!response.ok || !result?.success || !result.data?.url) {
    throw new Error(result?.error?.message ?? "Unable to upload this image.");
  }
  return result.data.url;
}
