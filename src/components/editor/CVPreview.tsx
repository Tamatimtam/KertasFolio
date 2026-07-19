import React from "react";
import { Plus, Trash2, Mail, Phone, Globe, ExternalLink } from "lucide-react";
import { type CV, type CVSection, type ContactLink } from "@/types/cv";
import EditableText from "./EditableText";

interface CVPreviewProps {
  cv: CV;
  onChange: (cv: CV) => void;
}

export default function CVPreview({ cv, onChange }: CVPreviewProps) {
  const { settings } = cv;
  const photoInputRef = React.useRef<HTMLInputElement>(null);

  const triggerPhotoUpload = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only JPG, PNG, and WebP images are allowed.");
      return;
    }

    const maxSize = 1.5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File is too large. Image size must be under 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        updatePersonalField("photoUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const getContactHref = (icon: string | undefined, value: string, url?: string) => {
    const cleanVal = (url || value).trim();
    if (icon === "email" && !cleanVal.startsWith("mailto:")) return `mailto:${cleanVal}`;
    if (icon === "phone" && !cleanVal.startsWith("tel:") && !cleanVal.startsWith("https://wa.me/")) return `tel:${cleanVal.replace(/[^+\d]/g, "")}`;
    if (cleanVal.startsWith("http://") || cleanVal.startsWith("https://")) {
      return cleanVal;
    }
    return `https://${cleanVal}`;
  };

  // Resolve fonts based on selection
  const getFonts = () => {
    switch (settings.fontFamily) {
      case "Outfit":
        return {
          display: "var(--font-outfit)",
          body: "var(--font-inter)",
          serif: false,
        };
      case "Playfair Display":
        return {
          display: "Georgia, serif",
          body: "Georgia, serif",
          serif: true,
        };
      case "system-ui":
        return {
          display: "system-ui, sans-serif",
          body: "system-ui, sans-serif",
          serif: false,
        };
      case "Inter":
      default:
        return {
          display: "var(--font-inter)",
          body: "var(--font-inter)",
          serif: false,
        };
    }
  };

  const fonts = getFonts();

  // CSS classes/styles applied to preview container
  const cvStyles: React.CSSProperties = {
    fontFamily: fonts.body,
    color: "#1f2937", // Crisp charcoal text
    lineHeight: 1.5,
  };

  // Heading Divider styles
  const getDividerStyle = (): React.CSSProperties => {
    switch (settings.dividerStyle) {
      case "line":
        return { borderBottom: `1px solid ${settings.themeColor || "#e5e7eb"}` };
      case "dots":
        return { borderBottom: `1px dotted ${settings.themeColor || "#e5e7eb"}` };
      case "none":
      default:
        return {};
    }
  };

  // Handlers for Personal Info
  const updatePersonalField = (field: "name" | "title" | "summary" | "photoUrl", val: string | undefined) => {
    onChange({
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        [field]: val,
      },
    });
  };

  const updateContactValue = (id: string, value: string) => {
    onChange({
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        contacts: cv.personalInfo.contacts.map((c) =>
          c.id === id ? { ...c, value } : c
        ),
      },
    });
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    onChange({
      ...cv,
      sections: cv.sections.map((s) =>
        s.id === sectionId ? { ...s, title } : s
      ),
    });
  };

  // Section Entry Helpers
  const addEntry = (sectionId: string) => {
    onChange({
      ...cv,
      sections: cv.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        
        switch (sec.type) {
          case "work":
            return {
              ...sec,
              entries: [
                ...sec.entries,
                {
                  id: crypto.randomUUID(),
                  company: "New Company",
                  role: "New Role",
                  startDate: "Start Date",
                  endDate: "Present",
                  current: true,
                  description: ["Added work bullet point."],
                },
              ],
            };
          case "education":
            return {
              ...sec,
              entries: [
                ...sec.entries,
                {
                  id: crypto.randomUUID(),
                  institution: "New School/University",
                  degree: "New Degree",
                  startDate: "Year",
                  endDate: "Year",
                },
              ],
            };
          case "skills":
            return {
              ...sec,
              entries: [
                ...sec.entries,
                { id: crypto.randomUUID(), name: "New Skill", level: 4 },
              ],
            };
          case "projects":
            return {
              ...sec,
              entries: [
                ...sec.entries,
                {
                  id: crypto.randomUUID(),
                  title: "New Project",
                  description: "Project description goes here.",
                  techStack: ["React"],
                },
              ],
            };
          case "certifications":
            return {
              ...sec,
              entries: [
                ...sec.entries,
                {
                  id: crypto.randomUUID(),
                  name: "New Certification",
                  issuer: "Issuer Name",
                  date: "Date",
                },
              ],
            };
          case "languages":
            return {
              ...sec,
              entries: [
                ...sec.entries,
                { id: crypto.randomUUID(), name: "New Language", proficiency: "Fluent" },
              ],
            };
          case "awards":
            return {
              ...sec,
              entries: [
                ...sec.entries,
                { id: crypto.randomUUID(), title: "New Award", issuer: "Issuer", date: "Date" },
              ],
            };
          case "volunteer":
            return {
              ...sec,
              entries: [
                ...sec.entries,
                {
                  id: crypto.randomUUID(),
                  organization: "Organization",
                  role: "Volunteer",
                  startDate: "Start",
                  endDate: "End",
                },
              ],
            };
          case "publications":
            return {
              ...sec,
              entries: [
                ...sec.entries,
                { id: crypto.randomUUID(), title: "Paper Title", publisher: "Publisher", date: "Date" },
              ],
            };
          case "references":
            return {
              ...sec,
              entries: [
                ...sec.entries,
                { id: crypto.randomUUID(), name: "Reference Name", relationship: "Manager", company: "Company" },
              ],
            };
          default:
            return sec;
        }
      }),
    });
  };

  const removeEntry = (sectionId: string, entryId: string) => {
    onChange({
      ...cv,
      sections: cv.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          entries: (sec.entries as any[]).filter((e) => e.id !== entryId),
        };
      }),
    });
  };

  const updateEntryField = (
    sectionId: string,
    entryId: string,
    field: string,
    value: any
  ) => {
    onChange({
      ...cv,
      sections: cv.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          entries: (sec.entries as any[]).map((e) =>
            e.id === entryId ? { ...e, [field]: value } : e
          ),
        };
      }),
    });
  };

  // Helper to get contact icon
  const renderContactIcon = (icon?: string) => {
    const iconStyles = { marginRight: "4px", color: settings.themeColor, display: "inline" };
    switch (icon) {
      case "email":
        return <Mail size={12} style={iconStyles} />;
      case "phone":
        return <Phone size={12} style={iconStyles} />;
      case "linkedin":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={settings.themeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 12, height: 12, marginRight: 4, display: "inline-block", verticalAlign: "middle" }}
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        );
      case "github":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={settings.themeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 12, height: 12, marginRight: 4, display: "inline-block", verticalAlign: "middle" }}
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        );
      default:
        return <Globe size={12} style={iconStyles} />;
    }
  };

  // Render Section Lists based on type
  const renderSectionContent = (section: CVSection) => {
    const dividerStyle = getDividerStyle();
    
    return (
      <div key={section.id} style={{ ...styles.cvSection, fontFamily: fonts.body }}>
        {/* Section Header */}
        <div style={{ ...styles.cvSectionHeader, ...dividerStyle }}>
          <EditableText
            value={section.title}
            onChange={(val) => updateSectionTitle(section.id, val)}
            tagName="h2"
            style={{
              fontFamily: fonts.display,
              color: settings.themeColor,
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          />
        </div>

        {/* Section Entries */}
        <div style={styles.entriesList}>
          {section.type === "work" && (
            <div>
              {section.entries.map((entry) => (
                <div key={entry.id} className="entry-item" style={styles.entryRow}>
                  <div style={styles.entryHeaderRow}>
                    <div>
                      <EditableText
                        value={entry.role}
                        onChange={(v) => updateEntryField(section.id, entry.id, "role", v)}
                        tagName="h3"
                        style={{ fontWeight: 600, fontSize: "0.95rem" }}
                      />
                      {entry.companyUrl ? (
                        <a 
                          href={getContactHref(undefined, entry.companyUrl)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ 
                            color: settings.themeColor, 
                            textDecoration: "none", 
                            borderBottom: `1px dotted ${settings.themeColor}` 
                          }}
                          onClick={(e) => {
                            if (document.activeElement?.contains(e.currentTarget) || (e.target as HTMLElement).isContentEditable) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <EditableText
                            value={entry.company}
                            onChange={(v) => updateEntryField(section.id, entry.id, "company", v)}
                            tagName="span"
                            style={{ fontSize: "0.9rem", color: settings.themeColor, fontStyle: "italic" }}
                          />
                        </a>
                      ) : (
                        <EditableText
                          value={entry.company}
                          onChange={(v) => updateEntryField(section.id, entry.id, "company", v)}
                          tagName="span"
                          style={{ fontSize: "0.9rem", color: "var(--muted-text)", fontStyle: "italic" }}
                        />
                      )}
                      {entry.location && (
                        <span style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>
                          {" — "}
                          <EditableText
                            value={entry.location}
                            onChange={(v) => updateEntryField(section.id, entry.id, "location", v)}
                            tagName="span"
                          />
                        </span>
                      )}
                    </div>
                    <div style={styles.entryMetaCol}>
                      <span style={styles.entryDates}>
                        <EditableText
                          value={entry.startDate}
                          onChange={(v) => updateEntryField(section.id, entry.id, "startDate", v)}
                          tagName="span"
                        />
                        {" - "}
                        <EditableText
                          value={entry.endDate}
                          onChange={(v) => updateEntryField(section.id, entry.id, "endDate", v)}
                          tagName="span"
                        />
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEntry(section.id, entry.id)}
                        className="delete-entry-btn"
                        style={styles.deleteEntryBtn}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Bullet points description */}
                  <ul style={styles.bulletsList}>
                    {entry.description.map((bullet, idx) => (
                      <li key={idx} style={styles.bulletItem}>
                        <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", width: "100%" }}>
                          <span style={{ color: settings.themeColor, userSelect: "none" }}>•</span>
                          <EditableText
                            value={bullet}
                            onChange={(v) => {
                              const newBullets = [...entry.description];
                              newBullets[idx] = v;
                              updateEntryField(section.id, entry.id, "description", newBullets);
                            }}
                            tagName="span"
                            style={{ flex: 1, fontSize: "0.85rem" }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newBullets = entry.description.filter((_, i) => i !== idx);
                              updateEntryField(section.id, entry.id, "description", newBullets);
                            }}
                            className="delete-bullet-btn"
                            style={styles.deleteBulletBtn}
                          >
                            ×
                          </button>
                        </div>
                      </li>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        updateEntryField(section.id, entry.id, "description", [
                          ...entry.description,
                          "New description point.",
                        ]);
                      }}
                      style={styles.addBulletBtn}
                    >
                      + Add Bullet Point
                    </button>
                  </ul>
                </div>
              ))}
            </div>
          )}

          {section.type === "education" && (
            <div>
              {section.entries.map((entry) => (
                <div key={entry.id} className="entry-item" style={styles.entryRow}>
                  <div style={styles.entryHeaderRow}>
                    <div>
                      <EditableText
                        value={entry.degree}
                        onChange={(v) => updateEntryField(section.id, entry.id, "degree", v)}
                        tagName="h3"
                        style={{ fontWeight: 600, fontSize: "0.95rem" }}
                      />
                      <EditableText
                        value={entry.institution}
                        onChange={(v) => updateEntryField(section.id, entry.id, "institution", v)}
                        tagName="span"
                        style={{ fontSize: "0.9rem", color: "var(--muted-text)" }}
                      />
                      {entry.gpa && (
                        <span style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>
                          {" (GPA: "}
                          <EditableText
                            value={entry.gpa}
                            onChange={(v) => updateEntryField(section.id, entry.id, "gpa", v)}
                            tagName="span"
                          />
                          {")"}
                        </span>
                      )}
                    </div>
                    <div style={styles.entryMetaCol}>
                      <span style={styles.entryDates}>
                        <EditableText
                          value={entry.startDate}
                          onChange={(v) => updateEntryField(section.id, entry.id, "startDate", v)}
                          tagName="span"
                        />
                        {" - "}
                        <EditableText
                          value={entry.endDate}
                          onChange={(v) => updateEntryField(section.id, entry.id, "endDate", v)}
                          tagName="span"
                        />
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEntry(section.id, entry.id)}
                        className="delete-entry-btn"
                        style={styles.deleteEntryBtn}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.type === "skills" && (
            <div style={styles.skillsTagGrid}>
              {section.entries.map((entry) => (
                <span key={entry.id} className="skill-tag" style={styles.skillTag}>
                  <EditableText
                    value={entry.name}
                    onChange={(v) => updateEntryField(section.id, entry.id, "name", v)}
                    tagName="span"
                    style={{ fontSize: "0.85rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => removeEntry(section.id, entry.id)}
                    className="delete-tag-btn"
                    style={styles.deleteTagBtn}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {section.type === "projects" && (
            <div>
              {section.entries.map((entry) => (
                <div key={entry.id} className="entry-item" style={styles.entryRow}>
                  <div style={styles.entryHeaderRow}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <EditableText
                        value={entry.title}
                        onChange={(v) => updateEntryField(section.id, entry.id, "title", v)}
                        tagName="h3"
                        style={{ fontWeight: 600, fontSize: "0.95rem" }}
                      />
                      {entry.liveUrl && (
                        <a href={`https://${entry.liveUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: settings.themeColor }}>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    <div style={styles.entryMetaCol}>
                      <button
                        type="button"
                        onClick={() => removeEntry(section.id, entry.id)}
                        className="delete-entry-btn"
                        style={styles.deleteEntryBtn}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <EditableText
                    value={entry.description}
                    onChange={(v) => updateEntryField(section.id, entry.id, "description", v)}
                    tagName="p"
                    style={{ fontSize: "0.85rem", margin: "4px 0", color: "var(--muted-text)" }}
                  />

                  {/* Tech stack items */}
                  <div style={styles.techStackRow}>
                    {entry.techStack.map((tech, idx) => (
                      <span key={idx} style={styles.techStackPill}>
                        <EditableText
                          value={tech}
                          onChange={(v) => {
                            const newStack = [...entry.techStack];
                            newStack[idx] = v;
                            updateEntryField(section.id, entry.id, "techStack", newStack);
                          }}
                          tagName="span"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newStack = entry.techStack.filter((_, i) => i !== idx);
                            updateEntryField(section.id, entry.id, "techStack", newStack);
                          }}
                          style={styles.deleteBulletBtn}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        updateEntryField(section.id, entry.id, "techStack", [...entry.techStack, "Skill"]);
                      }}
                      style={styles.addBulletBtn}
                    >
                      + Tag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fallback rendering for generic entry lists (Certifications, Languages, Awards, Volunteer, Publications, References) */}
          {["certifications", "languages", "awards", "volunteer", "publications", "references"].includes(section.type) && (
            <div>
              {(section.entries as any[]).map((entry) => (
                <div key={entry.id} className="entry-item" style={styles.entryRow}>
                  <div style={styles.entryHeaderRow}>
                    <div>
                      {section.type === "certifications" && (
                        <>
                          <EditableText
                            value={entry.name}
                            onChange={(v) => updateEntryField(section.id, entry.id, "name", v)}
                            tagName="h3"
                            style={{ fontWeight: 600, fontSize: "0.95rem" }}
                          />
                          <EditableText
                            value={entry.issuer}
                            onChange={(v) => updateEntryField(section.id, entry.id, "issuer", v)}
                            tagName="span"
                            style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}
                          />
                        </>
                      )}
                      {section.type === "languages" && (
                        <>
                          <EditableText
                            value={entry.name}
                            onChange={(v) => updateEntryField(section.id, entry.id, "name", v)}
                            tagName="h3"
                            style={{ fontWeight: 600, fontSize: "0.95rem", display: "inline-block" }}
                          />
                          {" — "}
                          <EditableText
                            value={entry.proficiency}
                            onChange={(v) => updateEntryField(section.id, entry.id, "proficiency", v)}
                            tagName="span"
                            style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}
                          />
                        </>
                      )}
                      {section.type === "awards" && (
                        <>
                          <EditableText
                            value={entry.title}
                            onChange={(v) => updateEntryField(section.id, entry.id, "title", v)}
                            tagName="h3"
                            style={{ fontWeight: 600, fontSize: "0.95rem" }}
                          />
                          <EditableText
                            value={entry.issuer}
                            onChange={(v) => updateEntryField(section.id, entry.id, "issuer", v)}
                            tagName="span"
                            style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}
                          />
                        </>
                      )}
                      {section.type === "volunteer" && (
                        <>
                          <EditableText
                            value={entry.role}
                            onChange={(v) => updateEntryField(section.id, entry.id, "role", v)}
                            tagName="h3"
                            style={{ fontWeight: 600, fontSize: "0.95rem" }}
                          />
                          <EditableText
                            value={entry.organization}
                            onChange={(v) => updateEntryField(section.id, entry.id, "organization", v)}
                            tagName="span"
                            style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}
                          />
                        </>
                      )}
                      {section.type === "publications" && (
                        <>
                          <EditableText
                            value={entry.title}
                            onChange={(v) => updateEntryField(section.id, entry.id, "title", v)}
                            tagName="h3"
                            style={{ fontWeight: 600, fontSize: "0.95rem" }}
                          />
                          <EditableText
                            value={entry.publisher}
                            onChange={(v) => updateEntryField(section.id, entry.id, "publisher", v)}
                            tagName="span"
                            style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}
                          />
                        </>
                      )}
                      {section.type === "references" && (
                        <>
                          <EditableText
                            value={entry.name}
                            onChange={(v) => updateEntryField(section.id, entry.id, "name", v)}
                            tagName="h3"
                            style={{ fontWeight: 600, fontSize: "0.95rem" }}
                          />
                          <span style={{ fontSize: "0.85rem", color: "var(--muted-text)" }}>
                            <EditableText
                              value={entry.relationship}
                              onChange={(v) => updateEntryField(section.id, entry.id, "relationship", v)}
                              tagName="span"
                            />
                            {" at "}
                            <EditableText
                              value={entry.company}
                              onChange={(v) => updateEntryField(section.id, entry.id, "company", v)}
                              tagName="span"
                            />
                          </span>
                        </>
                      )}
                    </div>
                    <div style={styles.entryMetaCol}>
                      {entry.date && (
                        <span style={styles.entryDates}>
                          <EditableText
                            value={entry.date}
                            onChange={(v) => updateEntryField(section.id, entry.id, "date", v)}
                            tagName="span"
                          />
                        </span>
                      )}
                      {entry.startDate && (
                        <span style={styles.entryDates}>
                          <EditableText
                            value={entry.startDate}
                            onChange={(v) => updateEntryField(section.id, entry.id, "startDate", v)}
                            tagName="span"
                          />
                          {" - "}
                          <EditableText
                            value={entry.endDate}
                            onChange={(v) => updateEntryField(section.id, entry.id, "endDate", v)}
                            tagName="span"
                          />
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeEntry(section.id, entry.id)}
                        className="delete-entry-btn"
                        style={styles.deleteEntryBtn}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Entry Button */}
        <button
          type="button"
          onClick={() => addEntry(section.id)}
          className="add-entry-btn"
          style={{ ...styles.addEntryBtn, color: settings.themeColor }}
        >
          <Plus size={12} style={{ marginRight: 4 }} /> Add to {section.title}
        </button>
      </div>
    );
  };

  // Modern two-column layout
  const renderModernLayout = () => {
    const visibleSections = cv.sections.filter((s) => s.visible);
    
    // Split sections into main and sidebar
    // Sidebar: skills, languages, references, certifications
    // Main: work, education, projects, awards, volunteer, publications
    const sidebarSections = visibleSections.filter((s) => 
      ["skills", "languages", "references", "certifications"].includes(s.type)
    );
    const mainSections = visibleSections.filter((s) => 
      !["skills", "languages", "references", "certifications"].includes(s.type)
    );

    return (
      <div style={styles.modernLayoutGrid}>
        {/* Main Column */}
        <div style={styles.modernMainCol}>
          {mainSections.map(renderSectionContent)}
        </div>

        {/* Sidebar Column */}
        <div style={{ ...styles.modernSidebarCol, borderLeft: `1px solid var(--border-subtle)` }}>
          {sidebarSections.map(renderSectionContent)}
        </div>
      </div>
    );
  };

  // Photo shape border-radius
  const getPhotoRadius = () => {
    if (settings.photoShape === "circle") return "50%";
    if (settings.photoShape === "rounded") return "8px";
    return "0px";
  };

  return (
    <div className="a4-sheet" style={{ ...styles.sheet, ...cvStyles }}>
      {/* CV Header / Personal Info */}
      <div style={styles.cvHeader}>
        <div style={styles.headerInfoGroup}>
          <EditableText
            value={cv.personalInfo.name}
            onChange={(val) => updatePersonalField("name", val)}
            tagName="h1"
            style={{
              fontFamily: fonts.display,
              fontSize: "2.2rem",
              fontWeight: 700,
              lineHeight: 1.1,
              color: settings.themeColor,
              letterSpacing: "-0.02em",
            }}
          />
          <EditableText
            value={cv.personalInfo.title}
            onChange={(val) => updatePersonalField("title", val)}
            tagName="p"
            style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "var(--muted-text)",
              marginTop: 4,
            }}
          />

           {/* Contact Links */}
          <div style={styles.contactsRow}>
            {cv.personalInfo.contacts
              .filter((contact) => contact.value.trim() !== "")
              .map((contact) => {
                const href = getContactHref(contact.icon, contact.value, contact.url);
                return (
                  <span key={contact.id} style={styles.contactItem}>
                    {renderContactIcon(contact.icon)}
                    <a 
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        // Prevent navigation if editing
                        if (document.activeElement?.contains(e.currentTarget) || (e.target as HTMLElement).isContentEditable) {
                          e.preventDefault();
                        }
                      }}
                      style={styles.contactLink}
                    >
                      <EditableText
                        value={contact.value}
                        onChange={(val) => updateContactValue(contact.id, val)}
                        tagName="span"
                      />
                    </a>
                  </span>
                );
              })}
          </div>
        </div>

        {/* Optional Profile Photo */}
        {settings.showPhoto && (
          <div style={styles.photoContainer}>
            <input
              type="file"
              ref={photoInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
            />
            {cv.personalInfo.photoUrl ? (
              <div 
                style={{ 
                  position: "relative",
                  width: "80px",
                  height: "80px",
                  cursor: "pointer",
                }}
                onClick={triggerPhotoUpload}
                title="Click to change photo"
              >
                <img 
                  src={cv.personalInfo.photoUrl} 
                  alt="Profile" 
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: getPhotoRadius(),
                    border: `1px solid var(--border-subtle)`
                  }}
                />
              </div>
            ) : (
              <div 
                onClick={triggerPhotoUpload}
                style={{ 
                  ...styles.photoPlaceholder, 
                  borderRadius: getPhotoRadius(),
                  border: `2px dashed ${settings.themeColor || "#ccc"}`,
                  cursor: "pointer",
                }}
                title="Click to upload photo"
              >
                + Photo
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional Executive Summary */}
      {cv.personalInfo.summary !== undefined && (
        <div style={styles.summaryContainer}>
          <EditableText
            value={cv.personalInfo.summary}
            onChange={(val) => updatePersonalField("summary", val)}
            tagName="p"
            placeholder="Write a brief professional summary..."
            style={{
              fontSize: "0.88rem",
              color: "var(--neutral-ink)",
              lineHeight: 1.6,
            }}
          />
        </div>
      )}

      {/* Render layout based on template */}
      {cv.templateId === "modern" ? (
        renderModernLayout()
      ) : (
        <div style={styles.singleColumnLayout}>
          {cv.sections.filter((s) => s.visible).map(renderSectionContent)}
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  sheet: {
    backgroundColor: "#ffffff",
    width: "210mm",
    minHeight: "297mm",
    padding: "20mm 15mm",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid var(--border-subtle)",
    margin: "0 auto",
    boxSizing: "border-box",
    position: "relative",
  },
  cvHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    gap: "20px",
  },
  headerInfoGroup: {
    flex: 1,
  },
  contactsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "12px",
  },
  contactItem: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: "0.78rem",
    color: "var(--muted-text)",
  },
  contactLink: {
    color: "inherit",
    textDecoration: "none",
    borderBottom: "1px dotted oklch(80% 0.01 250)",
    display: "inline-flex",
    alignItems: "center",
    transition: "border-color var(--transition-fast)",
  },
  photoContainer: {
    flexShrink: 0,
  },
  photoPlaceholder: {
    width: "80px",
    height: "80px",
    backgroundColor: "oklch(99% 0.001 250)",
    color: "var(--muted-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  summaryContainer: {
    paddingBottom: "16px",
    marginBottom: "16px",
    borderBottom: "1px solid var(--border-subtle)",
  },
  cvSection: {
    marginBottom: "24px",
    pageBreakInside: "avoid",
  },
  cvSectionHeader: {
    paddingBottom: "4px",
    marginBottom: "12px",
  },
  entriesList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  entryRow: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "8px",
    position: "relative",
  },
  entryHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryMetaCol: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  entryDates: {
    fontSize: "0.8rem",
    color: "var(--muted-text)",
    whiteSpace: "nowrap",
  },
  bulletsList: {
    listStyleType: "none",
    marginTop: "6px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  bulletItem: {
    position: "relative",
  },
  deleteEntryBtn: {
    opacity: 0,
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-subtle)",
    borderRadius: "4px",
    padding: "3px",
    color: "#ef4444",
    transition: "opacity var(--transition-fast)",
  },
  deleteBulletBtn: {
    opacity: 0,
    background: "transparent",
    color: "#ef4444",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    lineHeight: 1,
    padding: "0 4px",
    transition: "opacity var(--transition-fast)",
  },
  addBulletBtn: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--muted-text)",
    alignSelf: "flex-start",
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    transition: "color var(--transition-fast)",
  },
  skillsTagGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  skillTag: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "oklch(97% 0.002 250)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "4px",
    padding: "4px 8px",
    gap: "6px",
  },
  deleteTagBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "var(--muted-text)",
    fontSize: "0.8rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  },
  techStackRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "6px",
  },
  techStackPill: {
    fontSize: "0.7rem",
    backgroundColor: "oklch(95% 0.004 250)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "12px",
    padding: "1px 8px",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  addEntryBtn: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: "0.8rem",
    fontWeight: 600,
    marginTop: "8px",
    transition: "opacity var(--transition-fast)",
  },
  singleColumnLayout: {
    display: "flex",
    flexDirection: "column",
  },
  modernLayoutGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 200px",
    gap: "24px",
  },
  modernMainCol: {
    display: "flex",
    flexDirection: "column",
  },
  modernSidebarCol: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "16px",
  },
};
