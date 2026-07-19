import { saveAs } from "file-saver";
import { type CV } from "@/types/cv";

export async function exportDOCX(cv: CV) {
  // Dynamically load docx on client-side to prevent SSR issues
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, AlignmentType } = await import("docx");

  const primaryColor = cv.settings.themeColor || "#111111";
  const isSerif = cv.settings.fontFamily === "Playfair Display";
  const defaultFont = isSerif ? "Times New Roman" : "Arial";

  const children: any[] = [];

  // 1. Personal Header Info
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: cv.personalInfo.name,
          bold: true,
          size: 32, // 16pt
          color: primaryColor,
          font: defaultFont,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: cv.personalInfo.title,
          size: 24, // 12pt
          color: "#475569",
          font: defaultFont,
        }),
      ],
    })
  );

  // Contacts line
  const contactsText = cv.personalInfo.contacts
    .map((c) => `${c.label}: ${c.value}`)
    .join("  |  ");

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      border: {
        bottom: {
          color: "#cbd5e1",
          space: 8,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: contactsText,
          size: 18, // 9pt
          color: "#64748b",
          font: defaultFont,
        }),
      ],
    })
  );

  // 2. Executive Summary
  if (cv.personalInfo.summary) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: cv.personalInfo.summary,
            size: 19, // 9.5pt
            font: defaultFont,
          }),
        ],
      })
    );
  }

  // 3. Sections Content
  cv.sections
    .filter((s) => s.visible)
    .forEach((section) => {
      // Section Heading
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          border: {
            bottom: {
              color: primaryColor,
              space: 4,
              style: BorderStyle.SINGLE,
              size: 12,
            },
          },
          children: [
            new TextRun({
              text: section.title.toUpperCase(),
              bold: true,
              size: 24, // 12pt
              color: primaryColor,
              font: defaultFont,
            }),
          ],
        })
      );

      // Entries list
      if (section.type === "work") {
        section.entries.forEach((entry) => {
          // Company and Role Header
          children.push(
            new Paragraph({
              spacing: { before: 120 },
              children: [
                new TextRun({
                  text: `${entry.role} `,
                  bold: true,
                  size: 20, // 10pt
                  font: defaultFont,
                }),
                new TextRun({
                  text: `at ${entry.company}`,
                  italics: true,
                  size: 20,
                  font: defaultFont,
                }),
                new TextRun({
                  text: `\t${entry.startDate} - ${entry.endDate}`,
                  bold: true,
                  size: 18,
                  font: defaultFont,
                }),
              ],
            })
          );

          if (entry.location) {
            children.push(
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: entry.location,
                    size: 18,
                    color: "#64748b",
                    font: defaultFont,
                  }),
                ],
              })
            );
          }

          // Bullet points
          entry.description.forEach((bullet) => {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: bullet,
                    size: 19,
                    font: defaultFont,
                  }),
                ],
              })
            );
          });
        });
      } else if (section.type === "education") {
        section.entries.forEach((entry) => {
          children.push(
            new Paragraph({
              spacing: { before: 120, after: 60 },
              children: [
                new TextRun({
                  text: `${entry.degree} `,
                  bold: true,
                  size: 20,
                  font: defaultFont,
                }),
                new TextRun({
                  text: `at ${entry.institution}`,
                  size: 20,
                  font: defaultFont,
                }),
                new TextRun({
                  text: `\t${entry.startDate} - ${entry.endDate}`,
                  bold: true,
                  size: 18,
                  font: defaultFont,
                }),
              ],
            })
          );
        });
      } else if (section.type === "skills") {
        const skillsText = section.entries.map((sk) => sk.name).join(", ");
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 120 },
            children: [
              new TextRun({
                text: skillsText,
                size: 20,
                font: defaultFont,
              }),
            ],
          })
        );
      } else if (section.type === "projects") {
        section.entries.forEach((entry) => {
          children.push(
            new Paragraph({
              spacing: { before: 120 },
              children: [
                new TextRun({
                  text: entry.title,
                  bold: true,
                  size: 20,
                  font: defaultFont,
                }),
              ],
            })
          );
          children.push(
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: entry.description,
                  size: 19,
                  font: defaultFont,
                }),
              ],
            })
          );
        });
      } else {
        // Generic rendering
        (section.entries as any[]).forEach((entry) => {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 40 },
              children: [
                new TextRun({
                  text: `${entry.name || entry.title || entry.role} `,
                  bold: true,
                  size: 20,
                  font: defaultFont,
                }),
                new TextRun({
                  text: `— ${entry.issuer || entry.organization || entry.proficiency || entry.company}`,
                  size: 20,
                  font: defaultFont,
                }),
              ],
            })
          );
        });
      }
    });

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  // Generate and save file
  const blob = await Packer.toBlob(doc);
  const fileName = `${cv.name.replace(/\s+/g, "_").toLowerCase()}_cv.docx`;
  saveAs(blob, fileName);
}
