"use client";

import { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Undo, Redo, FileDown, Download, Check, Sparkles } from "lucide-react";
import { type CV, type CVSection } from "@/types/cv";
import { getCVById, saveCV } from "@/lib/db";
import { TEMPLATES } from "@/lib/templates";
import SectionList from "@/components/editor/SectionList";
import StylePanel from "@/components/editor/StylePanel";
import CVPreview from "@/components/editor/CVPreview";

// Client-side PDF & DOCX imports will be handled dynamically or in export utility files to prevent SSR issues

export default function Editor({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  // States
  const [cv, setCv] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  
  // Undo/Redo history stacks
  const historyRef = useRef<CV[]>([]);
  const futureRef = useRef<CV[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Load CV on mount
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const data = await getCVById(id);
      if (data) {
        setCv(data);
      } else {
        console.error("CV not found");
        router.push("/");
      }
      setLoading(false);
    }
    loadData();
  }, [id, router]);

  // Debounced Autosave Ref
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to update CV state and schedule autosave
  const updateCV = (updatedCv: CV, skipHistory = false) => {
    if (!cv) return;

    // Push previous state to undo stack
    if (!skipHistory) {
      historyRef.current.push(JSON.parse(JSON.stringify(cv)));
      futureRef.current = []; // Clear redo stack on new action
      setCanUndo(true);
      setCanRedo(false);
    }

    setCv(updatedCv);
    setSaveStatus("saving");

    // Debounce save to database (1s)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveCV(updatedCv);
        setSaveStatus("saved");
      } catch (err) {
        console.error("Autosave failed:", err);
        setSaveStatus("error");
      }
    }, 1000);
  };

  // Undo / Redo Actions
  const handleUndo = () => {
    if (historyRef.current.length === 0 || !cv) return;

    const previousState = historyRef.current.pop()!;
    futureRef.current.push(JSON.parse(JSON.stringify(cv)));
    
    setCv(previousState);
    updateCV(previousState, true);

    setCanUndo(historyRef.current.length > 0);
    setCanRedo(true);
  };

  const handleRedo = () => {
    if (futureRef.current.length === 0 || !cv) return;

    const nextState = futureRef.current.pop()!;
    historyRef.current.push(JSON.parse(JSON.stringify(cv)));

    setCv(nextState);
    updateCV(nextState, true);

    setCanUndo(true);
    setCanRedo(futureRef.current.length > 0);
  };

  // Section managers
  const handleSectionsChange = (newSections: CVSection[]) => {
    if (!cv) return;
    updateCV({
      ...cv,
      sections: newSections,
    });
  };

  const handleAddSection = (type: CVSection["type"]) => {
    if (!cv) return;
    
    const defaultTitles: Record<CVSection["type"], string> = {
      work: "Work Experience",
      education: "Education",
      skills: "Skills",
      projects: "Featured Projects",
      certifications: "Certifications",
      languages: "Languages",
      awards: "Awards & Achievements",
      volunteer: "Volunteer Work",
      publications: "Publications",
      references: "References",
    };

    const newSection: CVSection = {
      id: crypto.randomUUID(),
      type,
      title: defaultTitles[type],
      visible: true,
      entries: [] as any,
    };

    updateCV({
      ...cv,
      sections: [...cv.sections, newSection],
    });
  };

  // Exporters (will delegate to helper scripts in Phase 6)
  const triggerPdfExport = async () => {
    if (!cv) return;
    try {
      // Lazy load to avoid SSR issues
      const { exportPDF } = await import("@/lib/export/pdf");
      await exportPDF(cv);
    } catch (err) {
      console.error("PDF Export failed:", err);
      alert("Failed to export PDF. Please check console logs.");
    }
  };

  const triggerDocxExport = async () => {
    if (!cv) return;
    try {
      const { exportDOCX } = await import("@/lib/export/docx");
      await exportDOCX(cv);
    } catch (err) {
      console.error("DOCX Export failed:", err);
      alert("Failed to export DOCX. Please check console logs.");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <span style={styles.spinner}></span>
        <p style={{ marginTop: 12, color: "var(--muted-text)" }}>Opening workspace...</p>
      </div>
    );
  }

  if (!cv) {
    return (
      <div style={styles.loadingContainer}>
        <p style={{ color: "#ef4444" }}>Workspace could not be opened.</p>
        <Link href="/" style={{ marginTop: 12, textDecoration: "underline" }}>Return to dashboard</Link>
      </div>
    );
  }

  return (
    <div style={styles.editorPage}>
      {/* Top Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <Link href="/" style={styles.backBtn} title="Back to Dashboard">
            <ArrowLeft size={16} />
          </Link>
          <div style={styles.titleWrapper}>
            <input
              type="text"
              value={cv.name}
              onChange={(e) => updateCV({ ...cv, name: e.target.value })}
              style={styles.cvNameInput}
              title="Click to rename version"
            />
            <div style={styles.saveStatusWrapper}>
              {saveStatus === "saving" && <span style={styles.savingText}>Autosaving...</span>}
              {saveStatus === "saved" && (
                <span style={styles.savedText}>
                  <Check size={12} style={{ marginRight: 3 }} /> Saved to browser
                </span>
              )}
              {saveStatus === "error" && <span style={styles.errorText}>Save Error</span>}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={styles.toolbarCenter}>
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            style={canUndo ? styles.toolbarBtn : styles.toolbarBtnDisabled}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={15} />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            style={canRedo ? styles.toolbarBtn : styles.toolbarBtnDisabled}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={15} />
          </button>
          <span style={styles.divider}></span>
          
          {/* Quick layout selector */}
          <select
            value={cv.templateId}
            onChange={(e) => {
              const tmpl = TEMPLATES.find((t) => t.id === e.target.value);
              if (tmpl) {
                updateCV({
                  ...cv,
                  templateId: e.target.value,
                  settings: {
                    ...cv.settings,
                    themeColor: tmpl.themeColor,
                    accentColor: tmpl.accentColor,
                    fontFamily: tmpl.fontFamily,
                    photoShape: tmpl.photoShape,
                    dividerStyle: tmpl.dividerStyle,
                  }
                });
              }
            }}
            style={styles.templateSelect}
          >
            {TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.toolbarRight}>
          {/* Quick Local API instructions helper */}
          <span style={styles.apiIndicator} title="Local API is running on /api/cvs">
            <Sparkles size={14} style={{ marginRight: 4, color: "var(--accent)" }} /> AI Ready
          </span>
          
          <button 
            type="button" 
            style={styles.exportBtn}
            onClick={triggerPdfExport}
          >
            <FileDown size={15} style={{ marginRight: 6 }} /> PDF
          </button>
          <button 
            type="button" 
            style={{ ...styles.exportBtn, backgroundColor: "#0f172a", color: "#ffffff" }}
            onClick={triggerDocxExport}
          >
            <Download size={15} style={{ marginRight: 6 }} /> Word / DOCX
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div style={styles.workspace}>
        {/* Left: Reorder lists */}
        <SectionList
          sections={cv.sections}
          onChange={handleSectionsChange}
          onAddSection={handleAddSection}
        />

        {/* Center: A4 sheet editor preview canvas */}
        <div style={styles.canvasContainer}>
          <div style={styles.zoomWrapper}>
            <CVPreview cv={cv} onChange={updateCV} />
          </div>
        </div>

        {/* Right: Style options panel */}
        <StylePanel
          settings={cv.settings}
          onChange={(newSettings) => {
            updateCV({
              ...cv,
              settings: newSettings,
            });
          }}
        />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  editorPage: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "var(--background)",
    overflow: "hidden",
  },
  toolbar: {
    height: "64px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid var(--border-subtle)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    flexShrink: 0,
    zIndex: 20,
  },
  toolbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flex: 1,
  },
  backBtn: {
    padding: "8px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-subtle)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color var(--transition-fast)",
  },
  titleWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  cvNameInput: {
    border: "none",
    background: "transparent",
    fontSize: "0.95rem",
    fontWeight: 600,
    outline: "none",
    color: "var(--primary)",
    padding: "2px 0",
    width: "250px",
  },
  saveStatusWrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: 2,
  },
  savingText: {
    fontSize: "0.7rem",
    color: "var(--accent)",
  },
  savedText: {
    fontSize: "0.7rem",
    color: "var(--muted-text)",
    display: "flex",
    alignItems: "center",
  },
  errorText: {
    fontSize: "0.7rem",
    color: "#ef4444",
  },
  toolbarCenter: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  toolbarBtn: {
    padding: "8px",
    borderRadius: "var(--radius-sm)",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color var(--transition-fast)",
  },
  toolbarBtnDisabled: {
    padding: "8px",
    borderRadius: "var(--radius-sm)",
    color: "var(--border-subtle)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "not-allowed",
  },
  divider: {
    width: "1px",
    height: "20px",
    backgroundColor: "var(--border-subtle)",
    margin: "0 8px",
  },
  templateSelect: {
    padding: "6px 12px",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.8rem",
    fontWeight: 600,
    outline: "none",
    backgroundColor: "#ffffff",
  },
  toolbarRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "flex-end",
    flex: 1,
  },
  apiIndicator: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--muted-text)",
    border: "1px solid var(--border-subtle)",
    padding: "4px 8px",
    borderRadius: "12px",
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "oklch(99% 0.001 250)",
  },
  exportBtn: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-subtle)",
    color: "var(--primary)",
    padding: "8px 16px",
    borderRadius: "var(--radius-sm)",
    fontWeight: 600,
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    transition: "background-color var(--transition-fast)",
  },
  workspace: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: "oklch(96% 0.003 250)",
    overflowY: "auto",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  zoomWrapper: {
    transformOrigin: "top center",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid var(--border-subtle)",
    borderTop: "3px solid var(--accent)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
