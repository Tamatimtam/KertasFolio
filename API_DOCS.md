# KertasFolio Local API Documentation

> **Scope**: This API runs on your **local machine only** when you execute `npm run dev`.
> It is intended for AI automation scripts, personal CLI tools, or local integrations.
> The live Vercel deployment at `kertasfolio.vercel.app` does **not** expose these endpoints.

**Base URL (local):** `http://localhost:3000/api`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Data Types](#data-types)
4. [CV Endpoints](#cv-endpoints)
   - [List all CVs](#get-apicvs)
   - [Create a CV](#post-apicvs)
   - [Get a CV](#get-apicvsid)
   - [Update a CV](#put-apicvsid)
   - [Delete a CV](#delete-apicvsid)
   - [Duplicate a CV](#post-apicvsidduplicate)
   - [Export raw JSON](#get-apicvsidexport)
5. [Template Endpoints](#template-endpoints)
   - [List templates](#get-apitemplates)
6. [Common Patterns for AI Use](#common-patterns-for-ai-use)
7. [Error Reference](#error-reference)

---

## Overview

KertasFolio stores CV data in two places:

| Storage | Where | Purpose |
|---|---|---|
| **IndexedDB** | Browser client-side | Live editor data (changes you make in the UI) |
| **`data/cvs.json`** | Local filesystem | API-accessible data (read/written by these endpoints) |

> [!IMPORTANT]
> These are **two separate stores**. The UI saves to IndexedDB; the API reads from and writes to `data/cvs.json`. To sync a CV from the UI to the API, use the "Export" button in the editor to get the raw JSON, then `PUT` it to the API endpoint.

---

## Authentication

No authentication is required. The API is local-only and not exposed to the public internet.

---

## Data Types

### `CV` (Top-level object)

```json
{
  "id": "uuid-string",
  "name": "Frontend Engineer CV",
  "templateId": "classic",
  "createdAt": 1721390000000,
  "updatedAt": 1721390000000,
  "personalInfo": { /* PersonalInfo */ },
  "sections": [ /* CVSection[] */ ],
  "settings": { /* CVSettings */ }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` (UUID) | Yes | Unique identifier. Auto-generated if omitted on POST. |
| `name` | `string` | **Yes** | Human-readable version name (e.g. `"Backend Engineer CV"`). |
| `templateId` | `string` | **Yes** | One of `"classic"`, `"modern"`, or `"minimal"`. |
| `createdAt` | `number` | No | Unix timestamp in milliseconds. Auto-set on creation. |
| `updatedAt` | `number` | No | Unix timestamp in milliseconds. Auto-updated on every save. |
| `personalInfo` | `PersonalInfo` | Yes | Name, title, photo, contacts. |
| `sections` | `CVSection[]` | Yes | Ordered array of CV content sections. |
| `settings` | `CVSettings` | Yes | Visual styling settings. |

---

### `PersonalInfo`

```json
{
  "name": "Tama Santoso",
  "title": "Full-Stack Developer",
  "photoUrl": "data:image/jpeg;base64,...",
  "summary": "Experienced developer with...",
  "contacts": [ /* ContactLink[] */ ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Full name. |
| `title` | `string` | Yes | Professional title/headline. |
| `photoUrl` | `string` | No | Base64-encoded image string (`data:image/jpeg;base64,...`). |
| `summary` | `string` | No | Executive summary paragraph. |
| `contacts` | `ContactLink[]` | Yes | List of contact/social entries. |

---

### `ContactLink`

```json
{
  "id": "uuid",
  "label": "Email",
  "value": "hello@example.com",
  "url": "mailto:hello@example.com",
  "icon": "email"
}
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | UUID. |
| `label` | `string` | Display label (e.g. `"LinkedIn"`, `"Phone"`). |
| `value` | `string` | Display text shown on the CV. |
| `url` | `string?` | Override target URL for the link. Useful for linking `"WhatsApp"` to `https://wa.me/628xxx`. |
| `icon` | `string?` | Icon key: `"email"`, `"phone"`, `"linkedin"`, `"github"`, `"globe"`. |

---

### `CVSettings`

```json
{
  "themeColor": "#2563eb",
  "accentColor": "#60a5fa",
  "fontFamily": "Inter",
  "photoShape": "circle",
  "dividerStyle": "line",
  "showPhoto": true
}
```

| Field | Type | Options | Description |
|---|---|---|---|
| `themeColor` | `string` (hex) | Any hex | Primary color for section headers, links. |
| `accentColor` | `string` (hex) | Any hex | Subtle secondary accent. |
| `fontFamily` | `string` | `"Inter"`, `"Outfit"`, `"Playfair Display"`, `"Roboto"` | Main CV typeface. |
| `photoShape` | `string` | `"circle"`, `"square"`, `"rounded"` | Photo crop shape. |
| `dividerStyle` | `string` | `"line"`, `"dots"`, `"none"` | Style of section dividers. |
| `showPhoto` | `boolean` | `true`/`false` | Show/hide the profile photo block. |

---

### `CVSection` (Union type)

Each section in `sections[]` has a `type` field that defines its structure.

#### `WorkExperienceSection` — `type: "work"`

```json
{
  "type": "work",
  "id": "uuid",
  "title": "Work Experience",
  "visible": true,
  "entries": [
    {
      "id": "uuid",
      "company": "Acme Corp",
      "role": "Senior Engineer",
      "location": "Jakarta, ID",
      "companyUrl": "https://acme.com",
      "startDate": "Jan 2022",
      "endDate": "Present",
      "current": true,
      "description": ["Led a team of 5 engineers", "Shipped 3 major product features"]
    }
  ]
}
```

#### `EducationSection` — `type: "education"`

```json
{
  "type": "education",
  "id": "uuid",
  "title": "Education",
  "visible": true,
  "entries": [
    {
      "id": "uuid",
      "institution": "University of Indonesia",
      "degree": "B.Sc. Computer Science",
      "location": "Depok, ID",
      "startDate": "2018",
      "endDate": "2022",
      "gpa": "3.85",
      "description": "Thesis: Distributed Systems",
      "url": "https://ui.ac.id"
    }
  ]
}
```

#### `SkillsSection` — `type: "skills"`

```json
{
  "type": "skills",
  "id": "uuid",
  "title": "Skills",
  "visible": true,
  "entries": [
    { "id": "uuid", "name": "TypeScript", "category": "Languages", "url": "https://typescriptlang.org" },
    { "id": "uuid", "name": "Next.js", "category": "Frontend" }
  ]
}
```

#### `ProjectsSection` — `type: "projects"`

```json
{
  "type": "projects",
  "id": "uuid",
  "title": "Projects",
  "visible": true,
  "entries": [
    {
      "id": "uuid",
      "title": "KertasFolio",
      "description": "A tactile WYSIWYG CV builder.",
      "techStack": ["Next.js", "TypeScript", "IndexedDB"],
      "liveUrl": "https://kertasfolio.vercel.app",
      "githubUrl": "https://github.com/Tamatimtam/KertasFolio"
    }
  ]
}
```

#### `CertificationsSection` — `type: "certifications"`

```json
{
  "entries": [
    {
      "id": "uuid",
      "name": "AWS Solutions Architect",
      "issuer": "Amazon Web Services",
      "date": "2024",
      "credentialId": "ABC-123",
      "credentialUrl": "https://aws.amazon.com/verify/ABC-123",
      "url": "https://aws.amazon.com/certification/"
    }
  ]
}
```

#### Other sections

All other section types follow the same base structure (`id`, `title`, `visible`, `entries`):

| Section type | Entry fields |
|---|---|
| `"languages"` | `name`, `proficiency`, `url?` |
| `"awards"` | `title`, `issuer`, `date`, `description?`, `url?` |
| `"volunteer"` | `organization`, `role`, `startDate`, `endDate`, `description?`, `url?` |
| `"publications"` | `title`, `publisher`, `date`, `url?`, `description?` |
| `"references"` | `name`, `relationship`, `company`, `email?`, `phone?`, `url?` |

---

## CV Endpoints

### `GET /api/cvs`

Returns all CVs from local storage, sorted by most recently updated.

**Response** `200 OK`
```json
[
  {
    "id": "d8f2a3bc-...",
    "name": "Frontend Engineer CV",
    "templateId": "modern",
    "createdAt": 1721390000000,
    "updatedAt": 1721394000000,
    "personalInfo": { ... },
    "sections": [ ... ],
    "settings": { ... }
  }
]
```

---

### `POST /api/cvs`

Creates or saves a new CV. If `id` is provided in the body and already exists, it overwrites that CV.

**Request Body** `application/json`
```json
{
  "name": "Backend Engineer CV",
  "templateId": "minimal",
  "personalInfo": {
    "name": "Tama",
    "title": "Backend Engineer",
    "contacts": []
  },
  "sections": [],
  "settings": {
    "themeColor": "#111827",
    "accentColor": "#6b7280",
    "fontFamily": "Inter",
    "photoShape": "circle",
    "dividerStyle": "line",
    "showPhoto": false
  }
}
```

> [!NOTE]
> `name` and `templateId` are the only **required** fields. All other fields default to empty. A UUID is auto-generated for `id` if not provided.

**Response** `201 Created`
```json
{
  "id": "new-uuid-generated",
  "name": "Backend Engineer CV",
  ...
}
```

---

### `GET /api/cvs/{id}`

Retrieve a specific CV by its UUID.

**Path Parameter:** `id` — UUID string

**Response** `200 OK` — Full CV object.

**Response** `404 Not Found`
```json
{ "error": "CV not found" }
```

---

### `PUT /api/cvs/{id}`

Fully replace an existing CV with new data. The `id` in the URL is always used — it overrides any `id` in the request body.

**Path Parameter:** `id` — UUID string

**Request Body** — Full `CV` object (same shape as POST body but with the complete data you want to save).

**Response** `200 OK` — Updated CV object.

> [!TIP]
> This is the primary endpoint for AI-driven editing. Fetch the current CV with GET, modify the JavaScript object, then PUT the whole thing back.

---

### `DELETE /api/cvs/{id}`

Permanently deletes a CV from local storage.

**Path Parameter:** `id` — UUID string

**Response** `200 OK`
```json
{ "success": true, "message": "CV deleted successfully" }
```

**Response** `404 Not Found`
```json
{ "error": "CV not found" }
```

---

### `POST /api/cvs/{id}/duplicate`

Creates a deep copy of an existing CV with a new UUID and `" (Copy)"` appended to its name.

**Path Parameter:** `id` — UUID string of the source CV.

**Response** `201 Created` — Full duplicated CV object with new `id`, `createdAt`, and `updatedAt`.

---

### `GET /api/cvs/{id}/export`

Downloads the raw JSON of the CV as a file attachment. Useful for backup or transferring data between environments.

**Path Parameter:** `id` — UUID string

**Response** — `200 OK` with `Content-Disposition: attachment; filename="cv_name_backup.json"` header and raw JSON body.

---

## Template Endpoints

### `GET /api/templates`

Returns the list of built-in CV templates.

**Response** `200 OK`
```json
[
  { "id": "classic", "name": "Classic", "description": "..." },
  { "id": "modern",  "name": "Modern",  "description": "..." },
  { "id": "minimal", "name": "Minimal", "description": "..." }
]
```

---

## Common Patterns for AI Use

### Pattern 1: Add a new work experience entry

```python
import requests, json

BASE = "http://localhost:3000/api"
CV_ID = "your-cv-uuid-here"

# 1. Get current CV
cv = requests.get(f"{BASE}/cvs/{CV_ID}").json()

# 2. Find the work section
work_section = next(s for s in cv["sections"] if s["type"] == "work")

# 3. Append new entry
import uuid
work_section["entries"].append({
    "id": str(uuid.uuid4()),
    "company": "New Company",
    "role": "Software Engineer",
    "location": "Remote",
    "companyUrl": "https://newcompany.com",
    "startDate": "Jul 2025",
    "endDate": "Present",
    "current": True,
    "description": [
        "Built scalable REST APIs using FastAPI",
        "Reduced query latency by 40%"
    ]
})

# 4. Save back
cv["updatedAt"] = int(time.time() * 1000)
requests.put(f"{BASE}/cvs/{CV_ID}", json=cv)
```

---

### Pattern 2: Update contact links

```python
# Get current CV
cv = requests.get(f"{BASE}/cvs/{CV_ID}").json()

# Update the phone contact to link to WhatsApp
for contact in cv["personalInfo"]["contacts"]:
    if contact["icon"] == "phone":
        contact["value"] = "+62 812 3456 7890"
        contact["url"] = "https://wa.me/6281234567890"

# Save back
requests.put(f"{BASE}/cvs/{CV_ID}", json=cv)
```

---

### Pattern 3: Change theme and settings

```python
cv = requests.get(f"{BASE}/cvs/{CV_ID}").json()

cv["settings"]["themeColor"] = "#7c3aed"     # Purple
cv["settings"]["accentColor"] = "#a78bfa"
cv["settings"]["fontFamily"] = "Outfit"
cv["settings"]["dividerStyle"] = "dots"
cv["settings"]["showPhoto"] = False

requests.put(f"{BASE}/cvs/{CV_ID}", json=cv)
```

---

### Pattern 4: List all CVs and find one by name

```python
cvs = requests.get(f"{BASE}/cvs").json()
target = next((c for c in cvs if "Frontend" in c["name"]), None)
if target:
    print(target["id"])
```

---

## Error Reference

| HTTP Status | Error Body | Cause |
|---|---|---|
| `400 Bad Request` | `{ "error": "Invalid CV data. 'name' and 'templateId' are required." }` | POST body missing required fields. |
| `404 Not Found` | `{ "error": "CV not found" }` | The UUID does not match any stored CV. |
| `500 Internal Server Error` | `{ "error": "..." }` | Filesystem read/write failure (check `data/cvs.json` permissions). |

> [!CAUTION]
> The `data/` folder is not committed to Git by default (it's in `.gitignore`). Your local CV data will not appear on Vercel or other deployment targets.
