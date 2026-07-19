import { saveAs } from "file-saver";
import { type CV } from "@/types/cv";

const getTechIconUrl = (tech: string): string => {
  return `/api/icons/${encodeURIComponent(tech.trim())}?ext=.png`;
};

const getContactIconUrl = (icon: string | undefined): string | null => {
  if (!icon) return null;
  const map: Record<string, string> = {
    email: "outlook.com",
    phone: "whatsapp.com",
    linkedin: "linkedin.com",
    github: "github.com",
    location: "openstreetmap.org"
  };
  const domain = map[icon.toLowerCase().trim()] || "w3.org";
  return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=32&ext=.png`;
};

export async function exportPDF(cv: CV) {
  // Dynamically load the react-pdf renderer on client side to avoid build/SSR issues
  const { pdf, Document, Page, View, Text, Link, Image, StyleSheet } = await import("@react-pdf/renderer");

  const getContactHref = (icon: string | undefined, value: string, url?: string) => {
    const cleanVal = (url || value).trim();
    if (cleanVal.startsWith("mailto:") || cleanVal.startsWith("tel:")) {
      return cleanVal;
    }
    if (icon === "email" && !cleanVal.startsWith("mailto:")) return `mailto:${cleanVal}`;
    if (icon === "phone" && !cleanVal.startsWith("tel:") && !cleanVal.startsWith("https://wa.me/")) return `tel:${cleanVal.replace(/[^+\d]/g, "")}`;
    if (cleanVal.startsWith("http://") || cleanVal.startsWith("https://")) {
      return cleanVal;
    }
    return `https://${cleanVal}`;
  };

  // Define styles dynamically based on CV settings
  const isSerif = cv.settings.fontFamily === "Playfair Display";
  const primaryColor = cv.settings.themeColor || "#111111";
  
  const defaultFont = isSerif ? "Times-Roman" : "Helvetica";
  const boldFont = isSerif ? "Times-Bold" : "Helvetica-Bold";
  const italicFont = isSerif ? "Times-Italic" : "Helvetica-Oblique";

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 10,
      color: "#1f2937",
      fontFamily: defaultFont,
      lineHeight: 1.3,
    },
    header: {
      marginBottom: 16,
    },
    name: {
      fontSize: 22,
      fontWeight: "bold",
      fontFamily: boldFont,
      color: primaryColor,
      lineHeight: 1.1,
      marginBottom: 4,
    },
    title: {
      fontSize: 12,
      color: "#4b5563",
      marginTop: 2,
      lineHeight: 1.2,
    },
    contactsRow: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
      gap: 10,
    },
    contactText: {
      fontSize: 8,
      color: "#6b7280",
    },
    contactLink: {
      textDecoration: "none",
    },
    inlineLink: {
      textDecoration: "underline",
      color: primaryColor,
    },
    clickableLink: {
      color: "#1d4ed8",
      textDecoration: "underline",
    },
    summarySection: {
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
    },
    summaryText: {
      fontSize: 9,
      color: "#374151",
      lineHeight: 1.5,
    },
    section: {
      marginBottom: 16,
    },
    sectionHeader: {
      fontSize: 12,
      fontWeight: "bold",
      fontFamily: boldFont,
      color: primaryColor,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      paddingBottom: 2,
      borderBottomWidth: cv.settings.dividerStyle !== "none" ? 1 : 0,
      borderBottomColor: primaryColor,
      borderBottomStyle: cv.settings.dividerStyle === "dots" ? "dashed" : "solid",
      marginBottom: 8,
    },
    entryRow: {
      marginBottom: 8,
    },
    entryHeader: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    entryTitle: {
      fontWeight: "bold",
      fontFamily: boldFont,
      fontSize: 10,
    },
    entrySub: {
      fontSize: 9,
      color: "#4b5563",
      fontFamily: italicFont,
    },
    entryDates: {
      fontSize: 9,
      color: "#6b7280",
    },
    bulletsList: {
      marginTop: 4,
      paddingLeft: 10,
    },
    bulletPoint: {
      fontSize: 9,
      color: "#374151",
      marginBottom: 2,
    },
    skillsContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    skillBadge: {
      backgroundColor: "#f3f4f6",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      fontSize: 8,
      color: "#374151",
    },
    projectsGrid: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    projectRow: {
      marginBottom: 6,
    },
    projectTitle: {
      fontWeight: "bold",
      fontFamily: boldFont,
      fontSize: 10,
    },
    projectDesc: {
      fontSize: 9,
      color: "#4b5563",
      marginTop: 2,
    },
    projectTags: {
      display: "flex",
      flexDirection: "row",
      gap: 4,
      marginTop: 4,
    },
    projectTag: {
      fontSize: 7,
      backgroundColor: "#f3f4f6",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      color: "#6b7280",
    },
  });

  // Building the react-pdf Document component dynamically
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{cv.personalInfo.name}</Text>
          <Text style={styles.title}>{cv.personalInfo.title}</Text>
          
          <View style={styles.contactsRow}>
            {cv.personalInfo.contacts
              .filter((c) => c.value.trim() !== "")
              .map((contact) => {
                const iconUrl = getContactIconUrl(contact.icon);
                return (
                  <Link key={contact.id} src={getContactHref(contact.icon, contact.value, contact.url)} style={styles.contactLink}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                      {iconUrl && <Image src={iconUrl} style={{ width: 10, height: 10, borderRadius: 1 }} />}
                      <Text style={{ ...styles.contactText, ...styles.clickableLink, marginLeft: 2 }}>
                        {contact.value}
                      </Text>
                    </View>
                  </Link>
                );
              })}
          </View>
        </View>

        {/* Executive Summary */}
        {cv.personalInfo.summary && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryText}>{cv.personalInfo.summary}</Text>
          </View>
        )}

        {/* Sections */}
        {cv.sections
          .filter((s) => s.visible)
          .map((section) => (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionHeader}>{section.title}</Text>
              
              {/* Render Section content based on type */}
              {section.type === "work" && (
                <View>
                  {section.entries.map((entry) => (
                    <View key={entry.id} style={styles.entryRow} wrap={false}>
                      <View style={styles.entryHeader}>
                        <View>
                          <Text style={styles.entryTitle}>{entry.role}</Text>
                          <Text style={styles.entrySub}>
                            {entry.companyUrl ? (
                              <Link src={getContactHref(undefined, entry.companyUrl)}>
                                <Text style={styles.clickableLink}>{entry.company}</Text>
                              </Link>
                            ) : (
                              entry.company
                            )}
                            {entry.location ? ` — ${entry.location}` : ""}
                          </Text>
                        </View>
                        <Text style={styles.entryDates}>
                          {entry.startDate} - {entry.endDate}
                        </Text>
                      </View>
                      
                      <View style={styles.bulletsList}>
                        {entry.description.map((bullet, idx) => (
                          <Text key={idx} style={styles.bulletPoint}>
                            • {bullet}
                          </Text>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {section.type === "education" && (
                <View>
                  {section.entries.map((entry) => (
                    <View key={entry.id} style={styles.entryRow} wrap={false}>
                      <View style={styles.entryHeader}>
                        <View>
                          <Text style={styles.entryTitle}>
                            {entry.url ? (
                              <Link src={getContactHref(undefined, entry.url)}>
                                <Text style={styles.clickableLink}>{entry.degree}</Text>
                              </Link>
                            ) : (
                              entry.degree
                            )}
                          </Text>
                          <Text style={styles.entrySub}>
                            {entry.institution}
                            {entry.gpa ? ` (GPA: ${entry.gpa})` : ""}
                          </Text>
                        </View>
                        <Text style={styles.entryDates}>
                          {entry.startDate} - {entry.endDate}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {section.type === "skills" && (
                <View style={styles.skillsContainer}>
                  {section.entries.map((entry) => {
                    const iconUrl = getTechIconUrl(entry.name);
                    const badgeContent = (
                      <View style={{ ...styles.skillBadge, flexDirection: "row", alignItems: "center", gap: 4 }}>
                        {iconUrl && <Image src={iconUrl} style={{ width: 12, height: 12, borderRadius: 2 }} />}
                        <Text style={entry.url ? { ...styles.clickableLink, fontSize: 8 } : { marginLeft: 2 }}>{entry.name}</Text>
                      </View>
                    );
                    return entry.url ? (
                      <Link key={entry.id} src={getContactHref(undefined, entry.url)} style={{ textDecoration: "none" }}>
                        {badgeContent}
                      </Link>
                    ) : (
                      <View key={entry.id}>
                        {badgeContent}
                      </View>
                    );
                  })}
                </View>
              )}

              {section.type === "projects" && (
                <View style={styles.projectsGrid}>
                  {section.entries.map((entry) => (
                    <View key={entry.id} style={styles.projectRow} wrap={false}>
                      <Text style={styles.projectTitle}>
                        {entry.liveUrl ? (
                          <Link src={getContactHref(undefined, entry.liveUrl)}>
                            <Text style={styles.clickableLink}>{entry.title}</Text>
                          </Link>
                        ) : (
                          entry.title
                        )}
                      </Text>
                      <Text style={styles.projectDesc}>{entry.description}</Text>
                      <View style={styles.projectTags}>
                        {entry.techStack.map((tech, idx) => {
                          const iconUrl = getTechIconUrl(tech);
                          return (
                            <View key={idx} style={{ ...styles.projectTag, flexDirection: "row", alignItems: "center", gap: 3 }}>
                              {iconUrl && <Image src={iconUrl} style={{ width: 10, height: 10, borderRadius: 1 }} />}
                              <Text style={{ marginLeft: 2 }}>{tech}</Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Render references/certs in matching simplified styles */}
              {["certifications", "languages", "awards", "volunteer", "publications", "references"].includes(section.type) && (
                <View>
                  {(section.entries as any[]).map((entry) => {
                    const targetUrl = entry.url || entry.credentialUrl;
                    return (
                      <View key={entry.id} style={{ marginBottom: 6 }} wrap={false}>
                        <Text style={{ fontWeight: "bold", fontFamily: boldFont }}>
                          {targetUrl ? (
                            <Link src={getContactHref(undefined, targetUrl)}>
                              <Text style={styles.clickableLink}>{(entry.name || entry.title || entry.role)}</Text>
                            </Link>
                          ) : (
                            entry.name || entry.title || entry.role
                          )}
                        </Text>
                        <Text style={{ fontSize: 8, color: "#4b5563" }}>
                          {entry.issuer || entry.organization || entry.publisher || entry.proficiency || entry.company}
                          {entry.date ? ` (${entry.date})` : ""}
                          {entry.startDate ? ` (${entry.startDate} - ${entry.endDate})` : ""}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
      </Page>
    </Document>
  );

  // Generate the PDF blob and trigger browser download
  const blob = await pdf(<MyDocument />).toBlob();
  const fileName = `${cv.name.replace(/\s+/g, "_").toLowerCase()}_cv.pdf`;
  saveAs(blob, fileName);
}
