import fs from "fs";
import path from "path";
import { type CV } from "@/types/cv";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "cvs.json");

// Ensure the data directory and cvs.json exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export function readCvsFromFile(): CV[] {
  try {
    ensureDataFile();
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content || "[]");
  } catch (error) {
    console.error("Error reading CVs from API storage:", error);
    return [];
  }
}

export function writeCvsToFile(cvs: CV[]): void {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(cvs, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing CVs to API storage:", error);
    throw error;
  }
}

export function getApiCVs(): CV[] {
  return readCvsFromFile().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getApiCVById(id: string): CV | undefined {
  return readCvsFromFile().find((cv) => cv.id === id);
}

export function saveApiCV(cv: CV): CV {
  const cvs = readCvsFromFile();
  const index = cvs.findIndex((c) => c.id === cv.id);
  
  const savedCV: CV = {
    ...cv,
    updatedAt: Date.now(),
    createdAt: cv.createdAt || Date.now(),
  };

  if (index >= 0) {
    cvs[index] = savedCV;
  } else {
    cvs.push(savedCV);
  }

  writeCvsToFile(cvs);
  return savedCV;
}

export function deleteApiCV(id: string): boolean {
  const cvs = readCvsFromFile();
  const initialLength = cvs.length;
  const filteredCvs = cvs.filter((cv) => cv.id !== id);
  
  if (filteredCvs.length < initialLength) {
    writeCvsToFile(filteredCvs);
    return true;
  }
  return false;
}
