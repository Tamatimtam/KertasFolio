import { NextResponse } from "next/server";
import { getApiCVById, saveApiCV } from "@/lib/api-storage";
import { type CV } from "@/types/cv";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cv = getApiCVById(id);

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    const duplicatedCV: CV = {
      ...JSON.parse(JSON.stringify(cv)), // deep clone
      id: crypto.randomUUID(),
      name: `${cv.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const savedCv = saveApiCV(duplicatedCV);
    return NextResponse.json(savedCv, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to duplicate CV" },
      { status: 500 }
    );
  }
}
