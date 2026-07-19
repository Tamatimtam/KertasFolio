"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Copy, Trash2, FileText, ArrowRight, Eye } from "lucide-react";
import { type CV } from "@/types/cv";
import { getAllCVs, deleteCV, duplicateCV, saveCV } from "@/lib/db";
import { TEMPLATES, createDefaultCV } from "@/lib/templates";

export default function Dashboard() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCvName, setNewCvName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");

  // Load CVs on mount
  useEffect(() => {
    async function loadData() {
      const data = await getAllCVs();
      setCvs(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleCreateCV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCvName.trim()) return;

    try {
      const defaultCV = createDefaultCV(newCvName.trim(), selectedTemplate);
      await saveCV(defaultCV);
      router.push(`/editor/${defaultCV.id}`);
    } catch (err) {
      console.error("Failed to create CV:", err);
    }
  };

  const handleDeleteCV = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this CV version? This action cannot be undone.")) {
      try {
        await deleteCV(id);
        setCvs(cvs.filter((cv) => cv.id !== id));
      } catch (err) {
        console.error("Failed to delete CV:", err);
      }
    }
  };

  const handleDuplicateCV = async (cv: CV, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const newCV = await duplicateCV(cv, `${cv.name} (Copy)`);
      setCvs([newCV, ...cvs]);
    } catch (err) {
      console.error("Failed to duplicate CV:", err);
    }
  };

  // Helper to format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.logoGroup}>
            <div style={styles.logoMark}>KF</div>
            <div>
              <h1 style={styles.logoText}>KertasFolio</h1>
              <p style={styles.logoTagline}>Satisfying Tactile CV Workspace</p>
            </div>
          </div>
          <button 
            style={styles.primaryBtn}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} style={{ marginRight: 6 }} /> Create New CV
          </button>
        </div>
      </header>

      <main style={styles.container}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <span style={styles.spinner}></span>
            <p style={{ marginTop: 12, color: "var(--muted-text)" }}>Opening your workspace...</p>
          </div>
        ) : cvs.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIconContainer}>
              <FileText size={48} style={{ color: "var(--accent)" }} />
            </div>
            <h2 style={styles.emptyTitle}>Create your first KertasFolio</h2>
            <p style={styles.emptyDescription}>
              Craft a professional, clean, and custom-styled resume that will pass ATS check and look exceptional on paper.
            </p>
            
            <div style={styles.templateSelectionGrid}>
              {TEMPLATES.map((tmpl) => (
                <div 
                  key={tmpl.id} 
                  style={styles.templateOnboardCard}
                  onClick={() => {
                    setSelectedTemplate(tmpl.id);
                    setNewCvName("My Professional Resume");
                    setIsModalOpen(true);
                  }}
                >
                  <div style={{ ...styles.templatePreviewMini, borderTop: `4px solid ${tmpl.themeColor}`, overflow: "hidden" }}>
                    {tmpl.id === "classic" && (
                      <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
                        <div style={{ ...styles.skeletonLine, width: "50%", height: "8px", marginBottom: "4px" }}></div>
                        <div style={{ ...styles.skeletonLineShort, width: "30%", height: "5px", marginBottom: "12px" }}></div>
                        <div style={{ ...styles.skeletonLine, width: "90%", height: "4px", marginBottom: "4px" }}></div>
                        <div style={{ ...styles.skeletonLine, width: "85%", height: "4px", marginBottom: "4px" }}></div>
                        <div style={{ ...styles.skeletonLine, width: "70%", height: "4px" }}></div>
                      </div>
                    )}
                    {tmpl.id === "modern" && (
                      <div style={{ display: "flex", width: "100%", height: "100%", gap: "8px" }}>
                        {/* Left Sidebar */}
                        <div style={{ width: "35%", display: "flex", flexDirection: "column", gap: "6px", borderRight: "1px solid var(--border-subtle)", paddingRight: "6px", height: "100%" }}>
                          <div style={{ ...styles.skeletonLineShort, width: "80%", height: "6px", marginBottom: "2px" }}></div>
                          <div style={{ ...styles.skeletonLine, width: "90%", height: "3px" }}></div>
                          <div style={{ ...styles.skeletonLine, width: "70%", height: "3px" }}></div>
                          <div style={{ ...styles.skeletonLineShort, width: "80%", height: "6px", marginTop: "4px", marginBottom: "2px" }}></div>
                          <div style={{ ...styles.skeletonLine, width: "50%", height: "3px" }}></div>
                        </div>
                        {/* Right Main */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", height: "100%" }}>
                          <div style={{ ...styles.skeletonLine, width: "70%", height: "8px" }}></div>
                          <div style={{ ...styles.skeletonLineShort, width: "40%", height: "5px", marginBottom: "6px" }}></div>
                          <div style={{ ...styles.skeletonLine, width: "100%", height: "3px" }}></div>
                          <div style={{ ...styles.skeletonLine, width: "95%", height: "3px" }}></div>
                        </div>
                      </div>
                    )}
                    {tmpl.id === "minimal" && (
                      <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center" }}>
                        <div style={{ ...styles.skeletonLine, width: "40%", height: "10px", marginBottom: "4px" }}></div>
                        <div style={{ ...styles.skeletonLineShort, width: "20%", height: "5px", marginBottom: "16px" }}></div>
                        <div style={{ ...styles.skeletonLine, width: "100%", height: "3px", marginBottom: "4px" }}></div>
                        <div style={{ ...styles.skeletonLine, width: "90%", height: "3px", marginBottom: "8px" }}></div>
                        <div style={{ ...styles.skeletonLine, width: "100%", height: "3px" }}></div>
                      </div>
                    )}
                  </div>
                  <h3 style={styles.tmplName}>{tmpl.name}</h3>
                  <p style={styles.tmplDesc}>{tmpl.description}</p>
                </div>
              ))}
            </div>

            <button 
              style={{ ...styles.primaryBtn, marginTop: 16 }}
              onClick={() => setIsModalOpen(true)}
            >
              Start from scratch <ArrowRight size={16} style={{ marginLeft: 6 }} />
            </button>
          </div>
        ) : (
          <div>
            <div style={styles.dashboardSectionHeader}>
              <h2 style={styles.sectionTitle}>Your Document Versions</h2>
              <span style={styles.badge}>{cvs.length} CV{cvs.length > 1 ? "s" : ""}</span>
            </div>
            
            <div style={styles.cvGrid}>
              {cvs.map((cv) => {
                const tmpl = TEMPLATES.find((t) => t.id === cv.templateId);
                return (
                  <Link href={`/editor/${cv.id}`} key={cv.id} style={styles.cvCard}>
                    <div style={{ ...styles.cvCardHeader, borderTop: `4px solid ${cv.settings.themeColor || "#111"}` }}>
                      <span style={styles.cvCardTemplateLabel}>{tmpl?.name || "Custom Layout"}</span>
                      <div style={styles.cardActions}>
                        <button
                          style={styles.iconBtn}
                          title="Duplicate Version"
                          onClick={(e) => handleDuplicateCV(cv, e)}
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          style={{ ...styles.iconBtn, color: "#ef4444" }}
                          title="Delete Version"
                          onClick={(e) => handleDeleteCV(cv.id, e)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div style={styles.cvCardBody}>
                      <h3 style={styles.cvCardTitle}>{cv.name}</h3>
                      <p style={styles.cvCardSubtitle}>
                        {cv.personalInfo?.name || "Untitled Profile"}
                      </p>
                      <p style={styles.cvCardDate}>
                        Last modified: {formatDate(cv.updatedAt)}
                      </p>
                    </div>
                    
                    <div style={styles.cvCardFooter}>
                      <span style={styles.footerLink}>
                        Open in Workspace <ArrowRight size={14} style={{ marginLeft: 4 }} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modal dialog for creating a new CV */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Configure New CV</h3>
            <form onSubmit={handleCreateCV}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="cvName">Version Name</label>
                <input
                  id="cvName"
                  type="text"
                  placeholder="e.g., Software Engineer - Tech Version"
                  value={newCvName}
                  onChange={(e) => setNewCvName(e.target.value)}
                  style={styles.input}
                  required
                  autoFocus
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Starting Layout Template</label>
                <div style={styles.modalTemplateGrid}>
                  {TEMPLATES.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      style={{
                        ...styles.modalTemplateCard,
                        border: selectedTemplate === tmpl.id 
                          ? "2px solid var(--accent)" 
                          : "1px solid var(--border-subtle)",
                        backgroundColor: selectedTemplate === tmpl.id 
                          ? "var(--accent-light)" 
                          : "#ffffff",
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{tmpl.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted-text)", marginTop: 4 }}>
                        {tmpl.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.modalBtnGroup}>
                <button 
                  type="button" 
                  style={styles.secondaryBtn} 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Initialize Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inlined professional Vanilla CSS styles to ensure clean CSS-in-JS style injection and avoid compilation issues
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "var(--background)",
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid var(--border-subtle)",
    padding: "16px 0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerContainer: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoMark: {
    width: "40px",
    height: "40px",
    backgroundColor: "var(--primary)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: "1.2rem",
    borderRadius: "var(--radius-md)",
  },
  logoText: {
    fontFamily: "var(--font-display)",
    fontSize: "1.3rem",
    fontWeight: 700,
    lineHeight: 1.1,
    color: "var(--primary)",
  },
  logoTagline: {
    fontSize: "0.75rem",
    color: "var(--muted-text)",
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "48px 24px",
    flex: 1,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px 0",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid var(--border-subtle)",
    borderTop: "3px solid var(--accent)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  emptyState: {
    backgroundColor: "#ffffff",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-subtle)",
    padding: "60px 40px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "800px",
    margin: "0 auto",
  },
  emptyIconContainer: {
    width: "80px",
    height: "80px",
    backgroundColor: "oklch(95% 0.02 250)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
  },
  emptyTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "1.8rem",
    fontWeight: 600,
    color: "var(--primary)",
    marginBottom: "12px",
  },
  emptyDescription: {
    color: "var(--muted-text)",
    maxWidth: "500px",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    marginBottom: "40px",
  },
  templateSelectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
    width: "100%",
    marginBottom: "32px",
  },
  templateOnboardCard: {
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-md)",
    padding: "20px 16px",
    textAlign: "left",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    transition: "transform var(--transition-fast), border-color var(--transition-fast)",
  },
  templatePreviewMini: {
    height: "120px",
    backgroundColor: "oklch(99% 0.001 250)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-sm)",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
  },
  skeletonLine: {
    height: "8px",
    backgroundColor: "var(--border-subtle)",
    borderRadius: "4px",
    width: "70%",
  },
  skeletonLineShort: {
    height: "6px",
    backgroundColor: "var(--border-subtle)",
    borderRadius: "3px",
    width: "40%",
  },
  skeletonGrid: {
    display: "flex",
    gap: "10px",
    flex: 1,
    marginTop: "8px",
  },
  skeletonCol: {
    flex: 1,
    backgroundColor: "oklch(96% 0.003 250)",
    borderRadius: "4px",
  },
  tmplName: {
    fontSize: "0.95rem",
    fontWeight: 600,
    marginBottom: "6px",
  },
  tmplDesc: {
    fontSize: "0.75rem",
    color: "var(--muted-text)",
    lineHeight: 1.4,
  },
  primaryBtn: {
    backgroundColor: "var(--primary)",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "var(--radius-sm)",
    fontWeight: 600,
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color var(--transition-fast)",
  },
  secondaryBtn: {
    backgroundColor: "#ffffff",
    color: "var(--primary)",
    border: "1px solid var(--border-subtle)",
    padding: "10px 20px",
    borderRadius: "var(--radius-sm)",
    fontWeight: 600,
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color var(--transition-fast)",
  },
  dashboardSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "1.4rem",
    fontWeight: 600,
  },
  badge: {
    backgroundColor: "oklch(93% 0.005 250)",
    color: "var(--muted-text)",
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: "12px",
  },
  cvGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  cvCard: {
    backgroundColor: "#ffffff",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-subtle)",
    display: "flex",
    flexDirection: "column",
    height: "220px",
    boxShadow: "var(--shadow-sm)",
    transition: "transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast)",
    cursor: "pointer",
  },
  cvCardHeader: {
    padding: "12px 16px",
    borderBottom: "1px solid var(--border-subtle)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cvCardTemplateLabel: {
    fontSize: "0.7rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--muted-text)",
  },
  cardActions: {
    display: "flex",
    gap: "4px",
  },
  iconBtn: {
    padding: "6px",
    borderRadius: "4px",
    color: "var(--muted-text)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color var(--transition-fast), color var(--transition-fast)",
  },
  cvCardBody: {
    padding: "20px 16px",
    flex: 1,
  },
  cvCardTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "1.15rem",
    fontWeight: 600,
    color: "var(--primary)",
    marginBottom: "4px",
  },
  cvCardSubtitle: {
    fontSize: "0.85rem",
    color: "var(--muted-text)",
    marginBottom: "12px",
  },
  cvCardDate: {
    fontSize: "0.75rem",
    color: "var(--muted-text)",
  },
  cvCardFooter: {
    padding: "12px 16px",
    borderTop: "1px solid var(--border-subtle)",
    backgroundColor: "oklch(99% 0.001 250)",
    borderBottomLeftRadius: "var(--radius-md)",
    borderBottomRightRadius: "var(--radius-md)",
  },
  footerLink: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-pop)",
    width: "100%",
    maxWidth: "500px",
    padding: "32px",
    animation: "fadeIn 0.2s ease-out",
  },
  modalTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "1.3rem",
    fontWeight: 600,
    marginBottom: "24px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 600,
    marginBottom: "6px",
    color: "var(--primary)",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color var(--transition-fast)",
  },
  modalTemplateGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
    marginTop: "8px",
  },
  modalTemplateCard: {
    borderRadius: "var(--radius-md)",
    padding: "12px 16px",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  modalBtnGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "32px",
  },
};
