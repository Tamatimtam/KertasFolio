import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";

const ONBOARDING_KEY = "kertasfolio_onboarding_completed_v1";

let driverInstance: Driver | null = null;

// Custom styling injection for Driver.JS to match KertasFolio's "Modern Stationery" design language
function injectDriverStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("kertasfolio-driver-styles")) return;

  const styleEl = document.createElement("style");
  styleEl.id = "kertasfolio-driver-styles";
  styleEl.innerHTML = `
    .driver-popover {
      background-color: #fcfbf9 !important;
      color: #1f2937 !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 8px !important;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
      padding: 18px 20px !important;
      font-family: var(--font-body, 'Inter', sans-serif) !important;
      max-width: 320px !important;
    }
    .driver-popover-title {
      font-family: var(--font-display, 'Outfit', sans-serif) !important;
      font-size: 1.05rem !important;
      font-weight: 600 !important;
      color: #111111 !important;
      margin-bottom: 8px !important;
    }
    .driver-popover-description {
      font-size: 0.85rem !important;
      line-height: 1.5 !important;
      color: #4b5563 !important;
      margin-bottom: 16px !important;
    }
    .driver-popover-footer {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 8px !important;
      margin-top: 12px !important;
    }
    .driver-popover-progress-text {
      font-size: 0.75rem !important;
      font-weight: 600 !important;
      color: #6b7280 !important;
    }
    .driver-popover-navigation-btns {
      display: flex !important;
      gap: 6px !important;
    }
    .driver-popover-btn {
      font-family: var(--font-body, 'Inter', sans-serif) !important;
      font-size: 0.8rem !important;
      font-weight: 600 !important;
      padding: 6px 12px !important;
      border-radius: 4px !important;
      border: 1px solid #e5e7eb !important;
      background-color: #ffffff !important;
      color: #111111 !important;
      cursor: pointer !important;
      transition: all 0.15s ease !important;
      text-shadow: none !important;
    }
    .driver-popover-btn:hover {
      background-color: #f3f4f6 !important;
    }
    .driver-popover-next-btn, .driver-popover-close-btn {
      background-color: #111111 !important;
      color: #ffffff !important;
      border-color: #111111 !important;
    }
    .driver-popover-next-btn:hover, .driver-popover-close-btn:hover {
      background-color: #2563eb !important;
      border-color: #2563eb !important;
    }
    .driver-popover-arrow-side-left { border-left-color: #fcfbf9 !important; }
    .driver-popover-arrow-side-right { border-right-color: #fcfbf9 !important; }
    .driver-popover-arrow-side-top { border-top-color: #fcfbf9 !important; }
    .driver-popover-arrow-side-bottom { border-bottom-color: #fcfbf9 !important; }
  `;
  document.head.appendChild(styleEl);
}

export function startOnboardingTour(force = false) {
  if (typeof window === "undefined") return;

  injectDriverStyles();

  // If not forced and user has already seen onboarding, don't run automatically
  if (!force && localStorage.getItem(ONBOARDING_KEY) === "true") {
    return;
  }

  driverInstance = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    onDestroyed: () => {
      localStorage.setItem(ONBOARDING_KEY, "true");
    },
    steps: [
      {
        element: '[data-tour="version-name"]',
        popover: {
          title: "Document Version Name",
          description: "Click to give your CV version a custom title (e.g. 'Frontend Engineer' or 'DevOps Specialist').",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="template-select"]',
        popover: {
          title: "Distinct Layout Templates",
          description: "Switch between Classic Serif (formal, centered layout with line dividers) and Minimalist Clean (modern, left-aligned layout with contact pill badges).",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: '[data-tour="section-tabs"]',
        popover: {
          title: "Content vs Layout Modes",
          description: "Switch between editing section text in 'Content' mode and customizing your modular section order in 'Layout' mode.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="active-section-selector"]',
        popover: {
          title: "Active Section Switcher",
          description: "Quickly navigate between Personal Info, Work Experience, Skills, Education, Projects, and custom sections.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="section-list"]',
        popover: {
          title: "Interactive Links & Details",
          description: "Add company URLs, live project links, portfolio URLs, and bullet points to your entries.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="cv-preview"]',
        popover: {
          title: "Dynamic Skill Logos & WYSIWYG Paper",
          description: "Type skill names like React, Python, Docker, or Node.js to see high-res vector logos render automatically on your live A4 sheet!",
          side: "left",
          align: "start",
        },
      },
      {
        element: '[data-tour="style-panel"]',
        popover: {
          title: "Design Customization",
          description: "Customize typography styles, brand primary colors, profile photo shapes, and section dividers.",
          side: "left",
          align: "start",
        },
      },
      {
        element: '[data-tour="export-buttons"]',
        popover: {
          title: "Export PDF & Word",
          description: "Export high-resolution ATS-compliant PDF files or editable Word (.docx) documents with one click.",
          side: "bottom",
          align: "end",
        },
      },
      {
        element: '[data-tour="help-button"]',
        popover: {
          title: "Replay Tour Anytime",
          description: "Click this '?' button anytime to restart this onboarding tour!",
          side: "bottom",
          align: "end",
        },
      },
    ],
  });

  driverInstance.drive();
}
