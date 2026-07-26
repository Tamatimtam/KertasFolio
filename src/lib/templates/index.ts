import { type CV, type CVSection } from "@/types/cv";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  themeColor: string;
  accentColor: string;
  fontFamily: string;
  photoShape: "circle" | "square" | "rounded";
  dividerStyle: "line" | "dots" | "none";
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "classic",
    name: "Classic Serif",
    description: "Traditional single-column layout with elegant serif headings, ideal for conservative industries.",
    themeColor: "#111111",
    accentColor: "#475569",
    fontFamily: "Outfit", // We use Outfit for DISPLAY and clean formatting
    photoShape: "square",
    dividerStyle: "line",
  },
  {
    id: "minimal",
    name: "Minimalist Clean",
    description: "Ultra-clean, spacious layout focusing purely on typography and whitespace for modern professionals.",
    themeColor: "#0f172a",
    accentColor: "#64748b",
    fontFamily: "Inter",
    photoShape: "rounded",
    dividerStyle: "dots",
  },
];

export const createDefaultCV = (name: string, templateId: string): CV => {
  const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
  
  const id = crypto.randomUUID();
  const now = Date.now();
  
  const defaultSections: CVSection[] = [
    {
      id: crypto.randomUUID(),
      type: "work",
      title: "Work Experience",
      visible: true,
      entries: [],
    },
    {
      id: crypto.randomUUID(),
      type: "skills",
      title: "Skills",
      visible: true,
      entries: [],
    },
  ];

  return {
    id,
    name,
    templateId: template.id,
    createdAt: now,
    updatedAt: now,
    personalInfo: {
      name: "",
      title: "",
      summary: "",
      contacts: [],
    },
    sections: defaultSections,
    settings: {
      themeColor: template.themeColor,
      accentColor: template.accentColor,
      fontFamily: template.fontFamily,
      photoShape: template.photoShape,
      dividerStyle: template.dividerStyle,
      showPhoto: true,
    }
  };
};
