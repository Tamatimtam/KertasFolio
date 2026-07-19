# 📄 KertasFolio

> A tactile, print-paper styled WYSIWYG inline CV maker designed for professional resume creation, dynamic version control, and AI automation.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.dotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-orange?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://kertasfolio.vercel.app)

---

## 🔗 Live Deployment
🚀 Use the editor online: **[kertasfolio.vercel.app](https://kertasfolio.vercel.app)**

---

## ✨ Features

- **Tactile WYSIWYG Inline Editor**: Direct canvas text manipulation mapping to an A4 sheet layout, with cursor-jump-free updates.
- **Dual-Sidebar Editing**: 
  - **Layout tab**: Drag-and-drop sections dynamically using `@dnd-kit`.
  - **Content tab**: Form-based field inputs for easy updates, even when text boxes are cleared.
- **Dynamic Profile Photo Uploader**: Upload JPEGs, PNGs, or WebPs directly inside the browser. Files are restricted to `<1.5MB` and converted to Base64 data strings for serverless storage.
- **ATS-Friendly Document Exporters**:
  - **PDF Export**: Perfectly formatted print layout via `@react-pdf/renderer`.
  - **Word/DOCX Export**: Structured `.docx` documents using the `docx` library with correct document headers and tab-aligned dates.
- **Local Developer & AI REST API**: File-based local JSON endpoints (`data/cvs.json`) allow programmatic resume management and synchronization for local AI automation scripts.

---

## 🛠️ Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/YOUR_USERNAME/kertasfolio.git
cd kertasfolio
npm install
```

### 2. Run Local Development Server
Launch the development server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🤖 Local REST API Reference
When running locally, KertasFolio exposes a REST API for programmatic editing:

| Endpoint | Method | Description |
|---|---|---|
| `/api/cvs` | `GET` | Get all local CVs |
| `/api/cvs` | `POST` | Create or update a CV |
| `/api/cvs/[id]` | `GET` | Get a specific CV by ID |
| `/api/cvs/[id]` | `PUT` | Update a specific CV |
| `/api/cvs/[id]` | `DELETE` | Delete a specific CV |
| `/api/cvs/[id]/duplicate` | `POST` | Duplicate a specific CV |
| `/api/cvs/[id]/export` | `GET` | Download raw JSON backup of the CV |
| `/api/templates` | `GET` | List available starting templates |

---

## 📦 Project Structure
```
kertasfolio/
├── data/               # Local JSON database for REST API (ignored in git)
├── src/
│   ├── app/            # Next.js pages and API route handlers
│   ├── components/     # UI widgets and WYSIWYG canvas components
│   ├── lib/            # Exporters (PDF/DOCX), IndexedDB config, and templates
│   └── types/          # TypeScript interface definitions
├── DESIGN.md           # Visual design systems and colors
├── PRODUCT.md          # Product definitions and visual style anti-patterns
└── CICD_GUIDE.md       # Junior dev guide to Git and Vercel integrations
```

---

## 🏷️ GitHub Repository Topics
Add these tags to your public repository to make it easily discoverable:
`nextjs`, `typescript`, `wysiwyg-editor`, `resume-builder`, `cv-maker`, `dexie-js`, `indexeddb`, `pdf-generation`, `docx-generation`, `rest-api`, `ai-automation`, `tailwindcss-alternative`.
