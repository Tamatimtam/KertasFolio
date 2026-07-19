<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->
---
name: KertasFolio Design System
description: Tactile, precise, paper-like visual language for resume editing
colors:
  primary: "#111111"
  accent: "#2563eb"
  neutral-bg: "#fcfbf9"
  neutral-ink: "#1f2937"
  border-subtle: "#e5e7eb"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
---

# Design System: KertasFolio

## 1. Overview

**Creative North Star: "The Modern Stationery"**

KertasFolio is modeled after the feel of physical, high-quality tactile paper ("Kertas") and portfolio layouts ("Folio"). The design rejects SaaS-slop clichés (glowing cards, drop-shadow neon lines, dark-mode gradients) in favor of crisp editorial focus. It is light-mode only, clean, precise, and professional. 

Key Characteristics:
- Crisp borders and fine dividers instead of drop-shadow cards.
- Highly readable editorial type pairing (Outfit + Inter).
- Focus on content density and structured grids rather than nested borders.

## 2. Colors

[Describe the palette character in one sentence.]
The palette is a crisp, high-contrast, paper-inspired scale using deep carbon black ink and light warm-neutral backgrounds.

### Primary
- **Carbon Ink** ({colors.primary}): Default text, primary actions, and headers.

### Secondary
- **Focus Accent** ({colors.accent}): Active states, focus rings, and selection indications. Used sparingly (<= 10% of screen).

### Neutral
- **Felt Paper Background** ({colors.neutral-bg}): The warm off-white workspace canvas.
- **Ink Gray** ({colors.neutral-ink}): Body text and descriptions.
- **Divider Gray** ({colors.border-subtle}): Subtly separates sections.

**The Understated Accent Rule.** The focus accent (blue) is only used to denote interaction availability and state changes. It should never be used as decoration.

## 3. Typography

**Display Font:** Outfit
**Body Font:** Inter
**Label/Mono Font:** Courier New, monospace

**Character:** A geometric Display font (Outfit) for clean structural section headers, paired with a highly readable humanist body font (Inter) for fine text block scanning.

### Hierarchy
- **Display** (600, 1.5rem, 1.2): Section headings and card headers.
- **Headline** (500, 1.125rem, 1.4): Subheaders and CV entry titles.
- **Title** (600, 0.875rem, 1.5): Input labels and table headers.
- **Body** (400, 0.875rem, 1.5): Description text, CV bullet points (max length 70ch).
- **Label** (500, 0.75rem, 1.2, uppercase, 0.05em spacing): Metainfo, date tags.

## 4. Elevation

The system is flat by default, emulating ink-on-paper. There are no decorative box-shadows. Depth is created via borders, borders-within-borders, and background tint layering.

**The Flat-By-Default Rule.** Surfaces are flat at rest. Subtle borders (1px) define containment. Shadows are only used for floating toolbars or modals when layering is physically necessary to communicate stacking.

## 5. Components

Components are styled to look like printed form elements.

### Buttons
- **Shape:** Sharp or slightly rounded edges (4px)
- **Primary:** Carbon ink background with white text. Padding is (8px 16px).
- **Hover / Focus:** Changes to Accent Blue background, or drops in opacity.

### Cards / Containers
- **Corner Style:** Rounded (8px)
- **Background:** White or very light gray tint.
- **Border:** 1px solid gray ({colors.border-subtle}). No shadows.

### Inputs / Fields
- **Style:** Underlined or 1px border.
- **Focus:** Highlighted with Accent Blue outline or border shift.

## 6. Do's and Don'ts

### Do:
- **Do** use strict light-mode theme with high-contrast readable text.
- **Do** limit display heading lengths and use `text-wrap: balance`.
- **Do** use CSS grid/flex gap properties rather than margins for spacing consistency.

### Don't:
- **Don't** use SaaS-slop dashboard aesthetics (like neon gradients, blurry glass cards, or dark purple themes).
- **Don't** use colored side-stripe borders (e.g. `border-left: 4px solid blue` on cards).
- **Don't** use decorative font pairings or gradient headings.
- **Don't** animate image scale on hover.
