import { NextResponse } from "next/server";
import { getApiCVs, saveApiCV } from "@/lib/api-storage";
import { type CV } from "@/types/cv";

export async function GET() {
  try {
    const cvs = getApiCVs();
    return NextResponse.json(cvs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve CVs from local storage" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Quick validation
    if (!body.name || !body.templateId) {
      return NextResponse.json(
        { error: "Invalid CV data. 'name' and 'templateId' are required." },
        { status: 400 }
      );
    }

    const newCv: CV = {
      ...body,
      id: body.id || crypto.randomUUID(),
    };

    const savedCv = saveApiCV(newCv);
    return NextResponse.json(savedCv, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create/save CV" },
      { status: 500 }
    );
  }
}
