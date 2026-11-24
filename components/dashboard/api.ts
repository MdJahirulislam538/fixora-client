"use client";

import { toast } from "sonner";

export async function dashboardRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(input, {
      credentials: "same-origin",
      ...init,
      headers: {
        ...(init?.body && typeof init.body === "string"
          ? { "Content-Type": "application/json" }
          : {}),
        ...init?.headers,
      },
    });
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "The request could not be completed.");
    throw error;
  }
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      result && typeof result === "object" && "message" in result &&
      typeof result.message === "string"
        ? result.message
        : "The request could not be completed.";
    toast.error(message);
    throw new Error(message);
  }
  return result as T;
}

export async function uploadDashboardImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    toast.error("Choose an image file.");
    throw new Error("Choose an image file.");
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error("Choose an image smaller than 10 MB.");
    throw new Error("Choose an image smaller than 10 MB.");
  }

  const body = new FormData();
  body.append("image", file);

  let response: Response;
  try {
    response = await fetch("/api/dashboard/upload-image", {
      method: "POST",
      credentials: "same-origin",
      body,
    });
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Unable to upload this image.");
    throw error;
  }

  const result = await response.json().catch(() => null) as {
    success?: boolean;
    imageUrl?: string;
    message?: string;
  } | null;

  if (!response.ok || !result?.success || !result.imageUrl) {
    const message = result?.message ?? "Unable to upload this image.";
    toast.error(message);
    throw new Error(message);
  }

  return result.imageUrl;
}
