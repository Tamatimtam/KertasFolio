import Dexie, { type Table } from "dexie";
import { type CV } from "@/types/cv";

export class KertasFolioDatabase extends Dexie {
  cvs!: Table<CV>;

  constructor() {
    super("KertasFolioDatabase");
    this.version(1).stores({
      cvs: "id, name, templateId, createdAt, updatedAt", // indices for querying
    });
  }
}

export const db = new KertasFolioDatabase();

// Helper helper functions for CRUD operations
export async function getAllCVs(): Promise<CV[]> {
  try {
    return await db.cvs.orderBy("updatedAt").reverse().toArray();
  } catch (error) {
    console.error("Failed to fetch CVs from IndexedDB:", error);
    return [];
  }
}

export async function getCVById(id: string): Promise<CV | undefined> {
  try {
    return await db.cvs.get(id);
  } catch (error) {
    console.error(`Failed to fetch CV with id ${id}:`, error);
    return undefined;
  }
}

export async function saveCV(cv: CV): Promise<string> {
  try {
    cv.updatedAt = Date.now();
    await db.cvs.put(cv);
    return cv.id;
  } catch (error) {
    console.error("Failed to save CV to IndexedDB:", error);
    throw error;
  }
}

export async function deleteCV(id: string): Promise<void> {
  try {
    await db.cvs.delete(id);
  } catch (error) {
    console.error(`Failed to delete CV with id ${id}:`, error);
    throw error;
  }
}

export async function duplicateCV(cv: CV, newName?: string): Promise<CV> {
  try {
    const duplicatedCV: CV = {
      ...JSON.parse(JSON.stringify(cv)), // deep clone
      id: crypto.randomUUID(),
      name: newName || `${cv.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.cvs.add(duplicatedCV);
    return duplicatedCV;
  } catch (error) {
    console.error("Failed to duplicate CV:", error);
    throw error;
  }
}
