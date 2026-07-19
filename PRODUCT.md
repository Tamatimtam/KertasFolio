# Product

## Register

product

## Platform

web

## Users
Job-seekers, developers, designers, and professionals who need to maintain multiple versions of their CV/resume. They need a highly responsive, visual, and satisfying way to edit their CVs in real-time, customize templates, and export clean PDFs/DOCXs. They also want to use AI coding agents (like Gemini/Antigravity) to automate CV updates through a local REST API.

## Product Purpose
To provide an extremely satisfying, frictionless, WYSIWYG inline CV maker that manages multiple CVs client-side, allows modular layout customization, and exposes a local developer-friendly API for programmatic/AI resume automation. Success is a user exporting a perfectly formatted PDF/DOCX within minutes of editing.

## Positioning
A physical-paper-feeling digital resume workspace that merges direct visual editing (WYSIWYG) with developer-grade automation APIs.

## Brand Personality
- Professional, clean, tactile
- 3-word personality: Tactile, Focused, Precise
- Emotional goals: Confidence, satisfaction, clarity

## Anti-references
- SaaS-slop dashboard (with huge saturated purple/blue gradients, glassmorphism everywhere, and generic nested cards).
- Over-complex form builders with tiny side-by-side previews where users feel like they are filing tax returns instead of writing their resume.
- Over-designed "creative" resumes that ATS systems fail to parse.

## Design Principles
1. **Direct Manipulation**: If you see it, you can click and edit it. Avoid modal forms where inline text input makes more sense.
2. **Tactile Hierarchy**: Emulate the feel of fine paper ("KertasFolio"). Spacing, margins, and type sizing should feel like a premium editorial document, not a web application.
3. **Structured Modularity**: Treat resume sections as robust Lego blocks. The system must support reordering and toggling visibility without breaking the document flow.
4. **Developer/AI-First**: The backend is simple, transparent, and optimized for programmatic editing via a clean JSON REST API.

## Accessibility & Inclusion
- Contrast ratios of at least 4.5:1 for body and UI text.
- Keyboard-navigable editor actions and tab indexing.
- Supports screen readers via semantic HTML (e.g. `article`, `header`, `section`, `address`).
- Respects `prefers-reduced-motion` for all interface transitions.
