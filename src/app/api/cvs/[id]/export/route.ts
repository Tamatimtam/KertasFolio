import { NextResponse } from "next/server";
import { getApiCVById } from "@/lib/api-storage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cv = getApiCVById(id);

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${cv.name.replace(/\s+/g, "_").toLowerCase()}_backup.json"`);
    headers.set("Content-Type", "application/json");

    return new Response(JSON.stringify(cv, null, 2), {
      status: 200,
      headers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export CV" },
      { status: 500 }
    );
  }
}
