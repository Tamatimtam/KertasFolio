export interface ContactLink {
  id: string;
  label: string;
  value: string;
  icon?: string; // e.g. "email", "phone", "linkedin", "github", "globe"
}

export interface PersonalInfo {
  name: string;
  title: string;
  photoUrl?: string;
  summary?: string;
  contacts: ContactLink[];
}

export interface WorkEntry {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string; // e.g. "Present" or Date
  current: boolean;
  description: string[]; // bullet points
}

export interface WorkExperienceSection {
  type: "work";
  id: string;
  title: string;
  visible: boolean;
  entries: WorkEntry[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface EducationSection {
  type: "education";
  id: string;
  title: string;
  visible: boolean;
  entries: EducationEntry[];
}

export interface SkillEntry {
  id: string;
  name: string;
  level?: number; // 0 to 5 or percentage, or string level
  category?: string; // e.g., "Languages", "Frontend", "Backend"
}

export interface SkillsSection {
  type: "skills";
  id: string;
  title: string;
  visible: boolean;
  entries: SkillEntry[];
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProjectsSection {
  type: "projects";
  id: string;
  title: string;
  visible: boolean;
  entries: ProjectEntry[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CertificationsSection {
  type: "certifications";
  id: string;
  title: string;
  visible: boolean;
  entries: CertificationEntry[];
}

export interface LanguageEntry {
  id: string;
  name: string;
  proficiency: string; // e.g., "Native", "Fluent", "Conversational"
}

export interface LanguagesSection {
  type: "languages";
  id: string;
  title: string;
  visible: boolean;
  entries: LanguageEntry[];
}

export interface AwardEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface AwardsSection {
  type: "awards";
  id: string;
  title: string;
  visible: boolean;
  entries: AwardEntry[];
}

export interface VolunteerEntry {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface VolunteerSection {
  type: "volunteer";
  id: string;
  title: string;
  visible: boolean;
  entries: VolunteerEntry[];
}

export interface PublicationEntry {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface PublicationsSection {
  type: "publications";
  id: string;
  title: string;
  visible: boolean;
  entries: PublicationEntry[];
}

export interface ReferenceEntry {
  id: string;
  name: string;
  relationship: string; // e.g. "Former Manager"
  company: string;
  email?: string;
  phone?: string;
}

export interface ReferencesSection {
  type: "references";
  id: string;
  title: string;
  visible: boolean;
  entries: ReferenceEntry[];
}

export type CVSection =
  | WorkExperienceSection
  | EducationSection
  | SkillsSection
  | ProjectsSection
  | CertificationsSection
  | LanguagesSection
  | AwardsSection
  | VolunteerSection
  | PublicationsSection
  | ReferencesSection;

export interface CVSettings {
  themeColor: string; // Hex color for primary highlights
  accentColor: string; // Hex color for links/subtle elements
  fontFamily: string; // e.g. "Inter", "Outfit", "Playfair Display", "Roboto"
  photoShape: "circle" | "square" | "rounded";
  dividerStyle: "line" | "dots" | "none";
}

export interface CV {
  id: string;
  name: string; // name of the CV version, e.g. "Frontend Engineer CV"
  templateId: string; // "classic" | "modern" | "minimal"
  createdAt: number;
  updatedAt: number;
  personalInfo: PersonalInfo;
  sections: CVSection[];
  settings: CVSettings;
}
