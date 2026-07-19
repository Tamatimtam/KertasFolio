import { NextResponse } from "next/server";
import { getApiCVById, saveApiCV, deleteApiCV } from "@/lib/api-storage";

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

    return NextResponse.json(cv);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve CV" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingCv = getApiCVById(id);
    if (!existingCv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    const updatedCv = {
      ...body,
      id, // ensure ID matches
    };

    const savedCv = saveApiCV(updatedCv);
    return NextResponse.json(savedCv);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update CV" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteApiCV(id);

    if (!deleted) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "CV deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete CV" },
      { status: 500 }
    );
  }
}
