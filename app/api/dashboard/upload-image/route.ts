import { NextResponse } from "next/server";
import { requireDashboardUser } from "../../../lib/dashboard-api";

export async function POST(request: Request) {
  const access = await requireDashboardUser(request, ["technician"]);

  if (!access.user) {
    return access.response;
  }

  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "Image upload is not configured on the server." },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Please select an image." },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Choose a valid image file." },
        { status: 400 },
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Choose an image smaller than 10 MB." },
        { status: 400 },
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: uploadData,
      },
    );

    const result = await response.json().catch(() => null) as {
      success?: boolean;
      data?: { url?: string };
      error?: { message?: string };
    } | null;

    if (!response.ok || !result?.success || !result.data?.url) {
      return NextResponse.json(
        {
          message: result?.error?.message ?? "Unable to upload this image.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.data.url,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to upload this image.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
