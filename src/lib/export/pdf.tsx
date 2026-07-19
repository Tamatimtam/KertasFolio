import { saveAs } from "file-saver";
import { type CV } from "@/types/cv";

export async function exportPDF(cv: CV) {
  // Dynamically load the react-pdf renderer on client side to avoid build/SSR issues
  const { pdf, Document, Page, View, Text, StyleSheet, Font } = await import("@react-pdf/renderer");

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
      lineHeight: 1.4,
    },
    header: {
      marginBottom: 16,
    },
    name: {
      fontSize: 22,
      fontWeight: "bold",
      fontFamily: boldFont,
      color: primaryColor,
    },
    title: {
      fontSize: 12,
      color: "#4b5563",
      marginTop: 2,
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
            {cv.personalInfo.contacts.map((contact) => (
              <Text key={contact.id} style={styles.contactText}>
                {contact.label}: {contact.value}
              </Text>
            ))}
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
                    <View key={entry.id} style={styles.entryRow}>
                      <View style={styles.entryHeader}>
                        <View>
                          <Text style={styles.entryTitle}>{entry.role}</Text>
                          <Text style={styles.entrySub}>
                            {entry.company}
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
                    <View key={entry.id} style={styles.entryRow}>
                      <View style={styles.entryHeader}>
                        <View>
                          <Text style={styles.entryTitle}>{entry.degree}</Text>
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
                  {section.entries.map((entry) => (
                    <Text key={entry.id} style={styles.skillBadge}>
                      {entry.name}
                    </Text>
                  ))}
                </View>
              )}

              {section.type === "projects" && (
                <View style={styles.projectsGrid}>
                  {section.entries.map((entry) => (
                    <View key={entry.id} style={styles.projectRow}>
                      <Text style={styles.projectTitle}>{entry.title}</Text>
                      <Text style={styles.projectDesc}>{entry.description}</Text>
                      <View style={styles.projectTags}>
                        {entry.techStack.map((tech, idx) => (
                          <Text key={idx} style={styles.projectTag}>
                            {tech}
                          </Text>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Render references/certs in matching simplified styles */}
              {["certifications", "languages", "awards", "volunteer", "publications", "references"].includes(section.type) && (
                <View>
                  {(section.entries as any[]).map((entry) => (
                    <View key={entry.id} style={{ marginBottom: 4 }}>
                      <Text style={{ fontWeight: "bold", fontFamily: boldFont }}>
                        {entry.name || entry.title || entry.role}
                      </Text>
                      <Text style={{ fontSize: 8, color: "#4b5563" }}>
                        {entry.issuer || entry.organization || entry.publisher || entry.proficiency || entry.company}
                        {entry.date ? ` (${entry.date})` : ""}
                        {entry.startDate ? ` (${entry.startDate} - ${entry.endDate})` : ""}
                      </Text>
                    </View>
                  ))}
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
