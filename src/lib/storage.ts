import { type CV } from "@/types/cv";
import * as indexedDB from "./db";

const isProd = process.env.NODE_ENV === "production";

export async function clientGetAllCVs(): Promise<CV[]> {
  if (isProd) {
    return indexedDB.getAllCVs();
  }
  const res = await fetch("/api/cvs");
  if (!res.ok) throw new Error("Failed to fetch CVs");
  return res.json();
}

export async function clientGetCVById(id: string): Promise<CV | undefined> {
  if (isProd) {
    return indexedDB.getCVById(id);
  }
  const res = await fetch(`/api/cvs/${id}`);
  if (!res.ok) return undefined;
  return res.json();
}

export async function clientCreateCV(cv: CV): Promise<CV> {
  if (isProd) {
    await indexedDB.saveCV(cv);
    return cv;
  }
  const res = await fetch("/api/cvs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cv),
  });
  if (!res.ok) throw new Error("Failed to create CV");
  return res.json();
}

export async function clientUpdateCV(cv: CV): Promise<void> {
  if (isProd) {
    await indexedDB.saveCV(cv);
    return;
  }
  const res = await fetch(`/api/cvs/${cv.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cv),
  });
  if (!res.ok) throw new Error("Failed to update CV");
}

export async function clientDeleteCV(id: string): Promise<void> {
  if (isProd) {
    await indexedDB.deleteCV(id);
    return;
  }
  const res = await fetch(`/api/cvs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete CV");
}

export async function clientDuplicateCV(cv: CV): Promise<CV> {
  if (isProd) {
    return indexedDB.duplicateCV(cv);
  }
  const res = await fetch(`/api/cvs/${cv.id}/duplicate`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to duplicate CV");
  return res.json();
}
