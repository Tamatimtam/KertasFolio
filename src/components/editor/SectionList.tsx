import React, { useState } from "react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Plus, Trash2, LayoutGrid, FileText, Upload, PlusCircle, ArrowRight } from "lucide-react";
import { type CV, type CVSection, type ContactLink } from "@/types/cv";

interface SectionListProps {
  cv: CV;
  onChange: (cv: CV) => void;
  onAddSection: (type: CVSection["type"]) => void;
}

const SECTION_TYPES: { type: CVSection["type"]; label: string }[] = [
  { type: "work", label: "Work Experience" },
  { type: "education", label: "Education" },
  { type: "skills", label: "Skills" },
  { type: "projects", label: "Projects" },
  { type: "certifications", label: "Certifications" },
  { type: "languages", label: "Languages" },
  { type: "awards", label: "Awards & Achievements" },
  { type: "volunteer", label: "Volunteer Work" },
  { type: "publications", label: "Publications" },
  { type: "references", label: "References" },
];

export default function SectionList({ cv, onChange, onAddSection }: SectionListProps) {
  const { sections, personalInfo, settings } = cv;
  const [activeTab, setActiveTab] = useState<"content" | "layout">("content");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("personal");

  // Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const reorderedSections = arrayMove(sections, oldIndex, newIndex);
      onChange({ ...cv, sections: reorderedSections });
    }
  };

  const toggleVisibility = (id: string) => {
    const updatedSections = sections.map((s) => 
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    onChange({ ...cv, sections: updatedSections });
  };

  const renameSection = (id: string, newTitle: string) => {
    const updatedSections = sections.map((s) => 
      s.id === id ? { ...s, title: newTitle } : s
    );
    onChange({ ...cv, sections: updatedSections });
  };

  const deleteSection = (id: string) => {
    if (confirm("Are you sure you want to remove this section? All its contents will be lost.")) {
      const updatedSections = sections.filter((s) => s.id !== id);
      onChange({ ...cv, sections: updatedSections });
      if (selectedSectionId === id) {
        setSelectedSectionId("personal");
      }
    }
  };

  const availableSectionTypes = SECTION_TYPES.filter(
    (t) => !sections.some((s) => s.type === t.type)
  );

  // General state update helper
  const updatePersonalInfo = (field: keyof typeof personalInfo, value: any) => {
    onChange({
      ...cv,
      personalInfo: {
        ...personalInfo,
        [field]: value,
      },
    });
  };

  // Safe file upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: image/jpeg, image/png, image/webp
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only JPG, PNG, and WebP images are allowed.");
      return;
    }

    // Validate size: limit to 1.5MB to keep IndexedDB and base64 performance high
    const maxSize = 1.5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File is too large. Image size must be under 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        // base64 data url is naturally sanitized by FileReader reading as Data URL type
        updatePersonalInfo("photoUrl", reader.result);
      }
    };
    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleToggleShowPhoto = (checked: boolean) => {
    onChange({
      ...cv,
      settings: {
        ...settings,
        showPhoto: checked,
      },
    });
  };

  // Contacts manager in sidebar
  const [newContactType, setNewContactType] = useState<string>("email");
  const [newContactValue, setNewContactValue] = useState<string>("");

  const addContactLink = () => {
    if (!newContactValue.trim()) return;
    
    const labelMap: Record<string, string> = {
      email: "Email",
      phone: "Phone",
      linkedin: "LinkedIn",
      github: "GitHub",
      globe: "Website",
    };

    const newLink: ContactLink = {
      id: crypto.randomUUID(),
      label: labelMap[newContactType] || "Website",
      value: newContactValue.trim(),
      url: newContactValue.trim(),
      icon: newContactType,
    };

    onChange({
      ...cv,
      personalInfo: {
        ...personalInfo,
        contacts: [...personalInfo.contacts, newLink],
      },
    });
    setNewContactValue("");
  };

  const removeContactLink = (id: string) => {
    onChange({
      ...cv,
      personalInfo: {
        ...personalInfo,
        contacts: personalInfo.contacts.filter((c) => c.id !== id),
      },
    });
  };

  // Content rendering for sections
  const updateSectionEntries = (sectionId: string, updatedEntries: any[]) => {
    onChange({
      ...cv,
      sections: sections.map((s) => 
        s.id === sectionId ? { ...s, entries: updatedEntries } : s
      ),
    });
  };

  const renderContentEditor = () => {
    if (selectedSectionId === "personal") {
      return (
        <div style={styles.formContainer}>
          <div style={styles.formGroup}>
            <label style={styles.fieldLabel}>Full Name</label>
            <input
              type="text"
              value={personalInfo.name}
              onChange={(e) => updatePersonalInfo("name", e.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.fieldLabel}>Professional Title</label>
            <input
              type="text"
              value={personalInfo.title}
              onChange={(e) => updatePersonalInfo("title", e.target.value)}
              style={styles.formInput}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.fieldLabel}>Executive Summary</label>
            <textarea
              value={personalInfo.summary || ""}
              onChange={(e) => updatePersonalInfo("summary", e.target.value)}
              style={{ ...styles.formInput, height: "80px", resize: "none" }}
              placeholder="Brief summary profile..."
            />
          </div>

          {/* Profile Photo Uploader */}
          <div style={styles.formGroup}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <input
                id="showPhotoCheckbox"
                type="checkbox"
                checked={settings.showPhoto}
                onChange={(e) => handleToggleShowPhoto(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label htmlFor="showPhotoCheckbox" style={{ fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                Include Profile Photo
              </label>
            </div>
            
            {settings.showPhoto && (
              <div style={styles.photoUploadWrapper}>
                {personalInfo.photoUrl ? (
                  <div style={styles.photoPreviewWrapper}>
                    <img 
                      src={personalInfo.photoUrl} 
                      alt="Profile preview" 
                      style={styles.photoPreview} 
                    />
                    <button
                      type="button"
                      onClick={() => updatePersonalInfo("photoUrl", undefined)}
                      style={styles.removePhotoBtn}
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <label style={styles.uploadLabel}>
                    <Upload size={16} />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Contact Links Form */}
          <div style={{ ...styles.formGroup, marginTop: "16px" }}>
            <label style={styles.fieldLabel}>Contact & Social Links</label>
            <div style={styles.contactsList}>
              {personalInfo.contacts.map((contact) => (
                <div key={contact.id} style={{ ...styles.contactRowItem, flexDirection: "column", gap: "4px", alignItems: "stretch" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={styles.contactBadge}>{contact.label}</span>
                    <input
                      type="text"
                      placeholder="Display text"
                      value={contact.value}
                      onChange={(e) => {
                        const updatedContacts = personalInfo.contacts.map((c) => 
                          c.id === contact.id ? { ...c, value: e.target.value } : c
                        );
                        updatePersonalInfo("contacts", updatedContacts);
                      }}
                      style={{ ...styles.contactInputMini, fontWeight: "bold" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeContactLink(contact.id)}
                      style={styles.deleteContactBtn}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="URL (optional)"
                    value={contact.url || ""}
                    onChange={(e) => {
                      const updatedContacts = personalInfo.contacts.map((c) => 
                        c.id === contact.id ? { ...c, url: e.target.value } : c
                      );
                      updatePersonalInfo("contacts", updatedContacts);
                    }}
                    style={{ ...styles.contactInputMini, fontSize: "0.75rem", color: "var(--muted-text)", paddingLeft: "6px" }}
                  />
                </div>
              ))}
            </div>

            {/* Add new contact input */}
            <div style={styles.addContactBlock}>
              <select
                value={newContactType}
                onChange={(e) => setNewContactType(e.target.value)}
                style={styles.contactSelect}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="globe">Website</option>
              </select>
              <input
                type="text"
                placeholder="Value..."
                value={newContactValue}
                onChange={(e) => setNewContactValue(e.target.value)}
                style={styles.contactInput}
              />
              <button
                type="button"
                onClick={addContactLink}
                style={styles.addContactButton}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentSection = sections.find((s) => s.id === selectedSectionId);
    if (!currentSection) return null;

    return (
      <div style={styles.formContainer}>
        <div style={styles.entriesList}>
          {currentSection.entries.map((entry: any, index: number) => (
            <div key={entry.id} style={styles.entryFormCard}>
              <div style={styles.entryHeader}>
                <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>Entry #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const filtered = currentSection.entries.filter((e: any) => e.id !== entry.id);
                    updateSectionEntries(currentSection.id, filtered);
                  }}
                  style={{ color: "#ef4444", cursor: "pointer" }}
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Work section fields */}
              {currentSection.type === "work" && (
                <>
                  <input
                    type="text"
                    placeholder="Role title"
                    value={entry.role}
                    onChange={(e) => {
                      const updated = currentSection.entries.map((ent: any) => 
                        ent.id === entry.id ? { ...ent, role: e.target.value } : ent
                      );
                      updateSectionEntries(currentSection.id, updated);
                    }}
                    style={styles.formInputMini}
                  />
                  <input
                    type="text"
                    placeholder="Company name"
                    value={entry.company}
                    onChange={(e) => {
                      const updated = currentSection.entries.map((ent: any) => 
                        ent.id === entry.id ? { ...ent, company: e.target.value } : ent
                      );
                      updateSectionEntries(currentSection.id, updated);
                    }}
                    style={styles.formInputMini}
                  />
                  <input
                    type="text"
                    placeholder="Company Website/URL (optional)"
                    value={entry.companyUrl || ""}
                    onChange={(e) => {
                      const updated = currentSection.entries.map((ent: any) => 
                        ent.id === entry.id ? { ...ent, companyUrl: e.target.value } : ent
                      );
                      updateSectionEntries(currentSection.id, updated);
                    }}
                    style={styles.formInputMini}
                  />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="text"
                      placeholder="Start date"
                      value={entry.startDate}
                      onChange={(e) => {
                        const updated = currentSection.entries.map((ent: any) => 
                          ent.id === entry.id ? { ...ent, startDate: e.target.value } : ent
                        );
                        updateSectionEntries(currentSection.id, updated);
                      }}
                      style={{ ...styles.formInputMini, flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="End date"
                      value={entry.endDate}
                      onChange={(e) => {
                        const updated = currentSection.entries.map((ent: any) => 
                          ent.id === entry.id ? { ...ent, endDate: e.target.value } : ent
                        );
                        updateSectionEntries(currentSection.id, updated);
                      }}
                      style={{ ...styles.formInputMini, flex: 1 }}
                    />
                  </div>
                </>
              )}

              {/* Education section fields */}
              {currentSection.type === "education" && (
                <>
                  <input
                    type="text"
                    placeholder="Degree title"
                    value={entry.degree}
                    onChange={(e) => {
                      const updated = currentSection.entries.map((ent: any) => 
                        ent.id === entry.id ? { ...ent, degree: e.target.value } : ent
                      );
                      updateSectionEntries(currentSection.id, updated);
                    }}
                    style={styles.formInputMini}
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={entry.institution}
                    onChange={(e) => {
                      const updated = currentSection.entries.map((ent: any) => 
                        ent.id === entry.id ? { ...ent, institution: e.target.value } : ent
                      );
                      updateSectionEntries(currentSection.id, updated);
                    }}
                    style={styles.formInputMini}
                  />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="text"
                      placeholder="Start date"
                      value={entry.startDate}
                      onChange={(e) => {
                        const updated = currentSection.entries.map((ent: any) => 
                          ent.id === entry.id ? { ...ent, startDate: e.target.value } : ent
                        );
                        updateSectionEntries(currentSection.id, updated);
                      }}
                      style={{ ...styles.formInputMini, flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="End date"
                      value={entry.endDate}
                      onChange={(e) => {
                        const updated = currentSection.entries.map((ent: any) => 
                          ent.id === entry.id ? { ...ent, endDate: e.target.value } : ent
                        );
                        updateSectionEntries(currentSection.id, updated);
                      }}
                      style={{ ...styles.formInputMini, flex: 1 }}
                    />
                  </div>
                </>
              )}

              {/* Skills section fields */}
              {currentSection.type === "skills" && (
                <>
                  <input
                    type="text"
                    placeholder="Skill name"
                    value={entry.name}
                    onChange={(e) => {
                      const updated = currentSection.entries.map((ent: any) => 
                        ent.id === entry.id ? { ...ent, name: e.target.value } : ent
                      );
                      updateSectionEntries(currentSection.id, updated);
                    }}
                    style={styles.formInputMini}
                  />
                </>
              )}

              {/* Projects section fields */}
              {currentSection.type === "projects" && (
                <>
                  <input
                    type="text"
                    placeholder="Project title"
                    value={entry.title}
                    onChange={(e) => {
                      const updated = currentSection.entries.map((ent: any) => 
                        ent.id === entry.id ? { ...ent, title: e.target.value } : ent
                      );
                      updateSectionEntries(currentSection.id, updated);
                    }}
                    style={styles.formInputMini}
                  />
                  <input
                    type="text"
                    placeholder="Project description"
                    value={entry.description}
                    onChange={(e) => {
                      const updated = currentSection.entries.map((ent: any) => 
                        ent.id === entry.id ? { ...ent, description: e.target.value } : ent
                      );
                      updateSectionEntries(currentSection.id, updated);
                    }}
                    style={styles.formInputMini}
                  />
                  <input
                    type="text"
                    placeholder="Project Live URL"
                    value={entry.liveUrl || ""}
                    onChange={(e) => {
                      const updated = currentSection.entries.map((ent: any) => 
                        ent.id === entry.id ? { ...ent, liveUrl: e.target.value } : ent
                      );
                      updateSectionEntries(currentSection.id, updated);
                    }}
                    style={styles.formInputMini}
                  />
                </>
              )}

              {/* Generic fields */}
              {!["work", "education", "skills", "projects"].includes(currentSection.type) && (
                <>
                  <input
                    type="text"
                    placeholder="Name / Title"
                    value={entry.name || entry.title || entry.role || ""}
                    onChange={(e) => {
                      const updated = currentSection.entries.map((ent: any) => 
                        ent.id === entry.id ? { 
                          ...ent, 
                          name: ent.name !== undefined ? e.target.value : undefined,
                          title: ent.title !== undefined ? e.target.value : undefined,
                          role: ent.role !== undefined ? e.target.value : undefined,
                        } : ent
                      );
                      updateSectionEntries(currentSection.id, updated);
                    }}
                    style={styles.formInputMini}
                  />
                  <input
                    type="text"
                    placeholder="Details"
                    value={entry.issuer || entry.organization || entry.proficiency || entry.company || ""}
                    onChange={(e) => {
                      const updated = currentSection.entries.map((ent: any) => 
                        ent.id === entry.id ? { 
                          ...ent, 
                          issuer: ent.issuer !== undefined ? e.target.value : undefined,
                          organization: ent.organization !== undefined ? e.target.value : undefined,
                          proficiency: ent.proficiency !== undefined ? e.target.value : undefined,
                          company: ent.company !== undefined ? e.target.value : undefined,
                        } : ent
                      );
                      updateSectionEntries(currentSection.id, updated);
                    }}
                    style={styles.formInputMini}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            const defaultEntry: any = { id: crypto.randomUUID() };
            if (currentSection.type === "work") {
              defaultEntry.company = "New Company";
              defaultEntry.role = "Role Title";
              defaultEntry.startDate = "Start";
              defaultEntry.endDate = "End";
              defaultEntry.description = ["Task description."];
            } else if (currentSection.type === "education") {
              defaultEntry.institution = "Institution";
              defaultEntry.degree = "Degree";
              defaultEntry.startDate = "Year";
              defaultEntry.endDate = "Year";
            } else if (currentSection.type === "skills") {
              defaultEntry.name = "Skill Name";
            } else if (currentSection.type === "projects") {
              defaultEntry.title = "Project Title";
              defaultEntry.description = "Brief description.";
              defaultEntry.techStack = [];
            } else {
              defaultEntry.name = "New Entry";
              defaultEntry.issuer = "Details";
            }
            updateSectionEntries(currentSection.id, [...currentSection.entries, defaultEntry]);
          }}
          style={styles.sidebarAddBtn}
        >
          <Plus size={14} style={{ marginRight: 4 }} /> Add New Entry
        </button>
      </div>
    );
  };

  return (
    <div style={styles.sidebar}>
      {/* Tab Switcher */}
      <div style={styles.tabContainer}>
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          style={{
            ...styles.tabButton,
            borderBottom: activeTab === "content" ? "2px solid var(--accent)" : "none",
            color: activeTab === "content" ? "var(--accent)" : "var(--muted-text)",
            fontWeight: activeTab === "content" ? 600 : 500,
          }}
        >
          <FileText size={14} style={{ marginRight: 6 }} /> Content
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("layout")}
          style={{
            ...styles.tabButton,
            borderBottom: activeTab === "layout" ? "2px solid var(--accent)" : "none",
            color: activeTab === "layout" ? "var(--accent)" : "var(--muted-text)",
            fontWeight: activeTab === "layout" ? 600 : 500,
          }}
        >
          <LayoutGrid size={14} style={{ marginRight: 6 }} /> Layout
        </button>
      </div>

      {activeTab === "layout" ? (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={styles.header}>
            <h3 style={styles.title}>Document Layout</h3>
            <p style={styles.subtitle}>Drag to reorder CV sections</p>
          </div>

          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={sections.map((s) => s.id)} 
              strategy={verticalListSortingStrategy}
            >
              <div style={styles.list}>
                {sections.map((section) => (
                  <SortableItem
                    key={section.id}
                    section={section}
                    onToggleVisibility={() => toggleVisibility(section.id)}
                    onRename={(title) => renameSection(section.id, title)}
                    onDelete={() => deleteSection(section.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {availableSectionTypes.length > 0 && (
            <div style={styles.addSectionContainer}>
              <label style={styles.addLabel}>Add Section</label>
              <div style={styles.addGrid}>
                {availableSectionTypes.map((t) => (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => onAddSection(t.type)}
                    style={styles.addBtn}
                  >
                    <Plus size={12} style={{ marginRight: 4 }} /> {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={styles.sectionSelectorContainer}>
            <label style={styles.addLabel}>Active Section</label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              style={styles.sectionSelect}
            >
              <option value="personal">Personal Info & Contacts</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {renderContentEditor()}
          </div>
        </div>
      )}
    </div>
  );
}

interface SortableItemProps {
  section: CVSection;
  onToggleVisibility: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}

function SortableItem({ section, onToggleVisibility, onRename, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...styles.item,
    ...(section.visible ? {} : styles.itemHidden),
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button 
        type="button" 
        style={styles.grip} 
        {...attributes} 
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <input
        type="text"
        value={section.title}
        onChange={(e) => onRename(e.target.value)}
        style={styles.itemInput}
      />

      <div style={styles.itemActions}>
        <button
          type="button"
          onClick={onToggleVisibility}
          style={styles.actionBtn}
          title={section.visible ? "Hide Section" : "Show Section"}
        >
          {section.visible ? <Eye size={15} /> : <EyeOff size={15} style={{ color: "#ef4444" }} />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          style={{ ...styles.actionBtn, color: "#ef4444" }}
          title="Remove Section"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: "300px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid var(--border-subtle)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  },
  tabContainer: {
    display: "flex",
    borderBottom: "1px solid var(--border-subtle)",
    backgroundColor: "oklch(99% 0.001 250)",
  },
  tabButton: {
    flex: 1,
    padding: "12px 0",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  header: {
    padding: "20px 16px 12px 16px",
    borderBottom: "1px solid var(--border-subtle)",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "1.05rem",
    fontWeight: 600,
  },
  subtitle: {
    fontSize: "0.7rem",
    color: "var(--muted-text)",
    marginTop: 2,
  },
  list: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
    overflowY: "auto",
  },
  item: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-sm)",
    padding: "6px 8px",
    gap: "6px",
  },
  itemHidden: {
    backgroundColor: "oklch(99% 0.001 250)",
    borderColor: "var(--border-subtle)",
    opacity: 0.6,
  },
  grip: {
    cursor: "grab",
    color: "var(--muted-text)",
    display: "flex",
    alignItems: "center",
    padding: "4px",
  },
  itemInput: {
    border: "none",
    background: "transparent",
    fontSize: "0.8rem",
    fontWeight: 600,
    outline: "none",
    flex: 1,
    width: "0px",
  },
  itemActions: {
    display: "flex",
    gap: "2px",
  },
  actionBtn: {
    padding: "4px",
    borderRadius: "4px",
    color: "var(--muted-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addSectionContainer: {
    padding: "16px",
    borderTop: "1px solid var(--border-subtle)",
    backgroundColor: "oklch(99% 0.001 250)",
  },
  addLabel: {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "var(--primary)",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  addGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    maxHeight: "150px",
    overflowY: "auto",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-sm)",
    padding: "6px 8px",
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  sectionSelectorContainer: {
    padding: "16px",
    borderBottom: "1px solid var(--border-subtle)",
    backgroundColor: "oklch(99% 0.001 250)",
  },
  sectionSelect: {
    width: "100%",
    padding: "8px",
    fontSize: "0.85rem",
    fontWeight: 600,
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-subtle)",
    outline: "none",
    backgroundColor: "#ffffff",
  },
  formContainer: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  fieldLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--muted-text)",
  },
  formInput: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.85rem",
    outline: "none",
    transition: "border-color var(--transition-fast)",
  },
  formInputMini: {
    width: "100%",
    padding: "6px 8px",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.8rem",
    outline: "none",
    marginBottom: "6px",
  },
  photoUploadWrapper: {
    border: "1px dashed var(--border-subtle)",
    borderRadius: "var(--radius-md)",
    padding: "12px",
    textAlign: "center",
    backgroundColor: "oklch(99% 0.001 250)",
  },
  photoPreviewWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  photoPreview: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid var(--border-subtle)",
  },
  removePhotoBtn: {
    fontSize: "0.7rem",
    color: "#ef4444",
    textDecoration: "underline",
    fontWeight: 500,
  },
  uploadLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "var(--radius-sm)",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-subtle)",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  contactsList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "10px",
  },
  contactRowItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "oklch(99% 0.001 250)",
    padding: "4px 8px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-subtle)",
  },
  contactBadge: {
    fontSize: "0.65rem",
    fontWeight: 600,
    textTransform: "uppercase",
    backgroundColor: "var(--primary)",
    color: "#ffffff",
    padding: "2px 6px",
    borderRadius: "3px",
  },
  contactInputMini: {
    border: "none",
    background: "transparent",
    fontSize: "0.8rem",
    outline: "none",
    flex: 1,
    width: "0px",
  },
  deleteContactBtn: {
    color: "#ef4444",
    padding: "2px",
    cursor: "pointer",
  },
  addContactBlock: {
    display: "flex",
    gap: "4px",
    marginTop: "8px",
  },
  contactSelect: {
    padding: "6px",
    fontSize: "0.75rem",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-subtle)",
    backgroundColor: "#ffffff",
  },
  contactInput: {
    flex: 1,
    padding: "6px 8px",
    fontSize: "0.75rem",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-subtle)",
    outline: "none",
    width: "0px",
  },
  addContactButton: {
    backgroundColor: "var(--accent)",
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: "var(--radius-sm)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  entriesList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  entryFormCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-md)",
    padding: "10px",
  },
  entryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    paddingBottom: "4px",
    borderBottom: "1px solid oklch(96% 0.003 250)",
  },
  sidebarAddBtn: {
    width: "100%",
    padding: "8px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-subtle)",
    backgroundColor: "oklch(99% 0.001 250)",
    fontSize: "0.8rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "6px",
    cursor: "pointer",
  },
};
