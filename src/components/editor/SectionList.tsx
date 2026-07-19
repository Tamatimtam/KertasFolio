import React from "react";
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
import { Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import { type CVSection } from "@/types/cv";

interface SectionListProps {
  sections: CVSection[];
  onChange: (sections: CVSection[]) => void;
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

export default function SectionList({ sections, onChange, onAddSection }: SectionListProps) {
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
      onChange(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const toggleVisibility = (id: string) => {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const renameSection = (id: string, newTitle: string) => {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const deleteSection = (id: string) => {
    if (confirm("Are you sure you want to remove this section? All its contents will be lost.")) {
      onChange(sections.filter((s) => s.id !== id));
    }
  };

  // Find section types that aren't currently added
  const availableSectionTypes = SECTION_TYPES.filter(
    (t) => !sections.some((s) => s.type === t.type)
  );

  return (
    <div style={styles.sidebar}>
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
    width: "280px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid var(--border-subtle)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflowY: "auto",
  },
  header: {
    padding: "24px 20px 16px 20px",
    borderBottom: "1px solid var(--border-subtle)",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "1.1rem",
    fontWeight: 600,
  },
  subtitle: {
    fontSize: "0.75rem",
    color: "var(--muted-text)",
    marginTop: 2,
  },
  list: {
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  item: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-sm)",
    padding: "8px",
    gap: "6px",
    transition: "box-shadow var(--transition-fast), border-color var(--transition-fast)",
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
    fontSize: "0.85rem",
    fontWeight: 600,
    outline: "none",
    flex: 1,
    width: "0px", // permits flex shrink/grow
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
    transition: "background-color var(--transition-fast)",
  },
  addSectionContainer: {
    padding: "20px",
    borderTop: "1px solid var(--border-subtle)",
    backgroundColor: "oklch(99% 0.001 250)",
  },
  addLabel: {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--primary)",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  addGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-sm)",
    padding: "6px 10px",
    fontSize: "0.75rem",
    fontWeight: 500,
    transition: "all var(--transition-fast)",
    textAlign: "left",
  },
};
