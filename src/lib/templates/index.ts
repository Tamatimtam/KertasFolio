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
    id: "modern",
    name: "Modern Sidebar",
    description: "A professional two-column layout with color accents, featuring a sidebar for personal info and skills.",
    themeColor: "#2563eb",
    accentColor: "#1e3a8a",
    fontFamily: "Inter",
    photoShape: "circle",
    dividerStyle: "none",
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
      entries: [
        {
          id: crypto.randomUUID(),
          company: "Acme Tech Solutions",
          role: "Senior Frontend Engineer",
          location: "San Francisco, CA (Hybrid)",
          startDate: "Jan 2024",
          endDate: "Present",
          current: true,
          description: [
            "Architected and implemented a high-fidelity visual editor using React and TypeScript, boosting customer signup rates by 35%.",
            "Led a team of 4 engineers to rebuild the core dashboard component library, improving performance by 50% and reducing build sizes.",
            "Established automated CI/CD deployment pipelines on Vercel, decreasing deployment times from 15 minutes to under 3 minutes."
          ]
        },
        {
          id: crypto.randomUUID(),
          company: "Innovate Web Corp",
          role: "Software Developer",
          location: "Remote",
          startDate: "Jun 2021",
          endDate: "Dec 2023",
          current: false,
          description: [
            "Built responsive web applications for client portals utilizing Next.js, Tailwind CSS, and RESTful API integrations.",
            "Optimized loading times across 12 high-traffic pages, achieving 90+ Lighthouse scores through lazy loading and image optimization.",
            "Collaborated closely with design team in Figma to translate visual mockups into pixel-perfect modular components."
          ]
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      type: "education",
      title: "Education",
      visible: true,
      entries: [
        {
          id: crypto.randomUUID(),
          institution: "State University of Science",
          degree: "B.S. in Computer Science",
          location: "Austin, TX",
          startDate: "2017",
          endDate: "2021",
          gpa: "3.8/4.0",
          description: "Specialized in Software Engineering and Human-Computer Interaction."
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      type: "skills",
      title: "Skills",
      visible: true,
      entries: [
        { id: crypto.randomUUID(), name: "React / Next.js", level: 5, category: "Frontend" },
        { id: crypto.randomUUID(), name: "TypeScript", level: 5, category: "Frontend" },
        { id: crypto.randomUUID(), name: "HTML5 / CSS3", level: 5, category: "Frontend" },
        { id: crypto.randomUUID(), name: "Node.js / Express", level: 4, category: "Backend" },
        { id: crypto.randomUUID(), name: "PostgreSQL", level: 4, category: "Backend" },
        { id: crypto.randomUUID(), name: "Git / CI/CD", level: 4, category: "Tools" }
      ]
    },
    {
      id: crypto.randomUUID(),
      type: "projects",
      title: "Featured Projects",
      visible: true,
      entries: [
        {
          id: crypto.randomUUID(),
          title: "KertasFolio - CV Workspace",
          description: "A satisfying, offline-first WYSIWYG editor built with Next.js and IndexedDB for crafting beautiful, ATS-compliant CVs.",
          techStack: ["Next.js", "TypeScript", "IndexedDB", "React PDF"],
          liveUrl: "https://kertasfolio.vercel.app",
          githubUrl: "https://github.com/user/kertasfolio"
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      type: "certifications",
      title: "Certifications",
      visible: true,
      entries: [
        {
          id: crypto.randomUUID(),
          name: "AWS Certified Developer – Associate",
          issuer: "Amazon Web Services",
          date: "Oct 2024",
          credentialId: "AWS-DEV-9921",
          credentialUrl: "https://aws.amazon.com"
        }
      ]
    },
    {
      id: crypto.randomUUID(),
      type: "languages",
      title: "Languages",
      visible: true,
      entries: [
        { id: crypto.randomUUID(), name: "English", proficiency: "Professional Full Professional" },
        { id: crypto.randomUUID(), name: "Indonesian", proficiency: "Native / Bilingual" }
      ]
    }
  ];

  return {
    id,
    name,
    templateId,
    createdAt: now,
    updatedAt: now,
    personalInfo: {
      name: "Tomy Kartas",
      title: "Software Engineer",
      summary: "Detail-oriented software engineer with 4+ years of experience designing and implementing highly performant visual editors and responsive web platforms. Passionate about tactile interfaces, clean typography, and robust API design.",
      contacts: [
        { id: crypto.randomUUID(), label: "Email", value: "tomy.kartas@email.com", icon: "email" },
        { id: crypto.randomUUID(), label: "Phone", value: "+1 (555) 123-4567", icon: "phone" },
        { id: crypto.randomUUID(), label: "LinkedIn", value: "linkedin.com/in/tomykartas", icon: "linkedin" },
        { id: crypto.randomUUID(), label: "GitHub", value: "github.com/tomykartas", icon: "github" },
        { id: crypto.randomUUID(), label: "Portfolio", value: "tomykartas.dev", icon: "globe" }
      ]
    },
    sections: defaultSections,
    settings: {
      themeColor: template.themeColor,
      accentColor: template.accentColor,
      fontFamily: template.fontFamily,
      photoShape: template.photoShape,
      dividerStyle: template.dividerStyle,
    }
  };
};
