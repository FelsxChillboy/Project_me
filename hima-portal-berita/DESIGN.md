# Design Direction: Portal Berita HIMA Ilmu Hukum

## Identity & Aesthetic
- **Visual Language**: Editorial Hukum Klasik (modern legal journal & broadsheet publication).
- **Audience**: Mahasiswa Ilmu Hukum, dosen, civitas akademika, dan masyarakat pembaca opini hukum.
- **Dial**: `ENERGY 2 / RHYTHM 2 / MOTION 1`
- **Identity Motif**: Double hairline archival rules (`border-t-2 border-[#14263D]` paired with warm `#D8D1C3` dividers) and broadsheet editorial typography hierarchy.

## Palette (WCAG AA Verified via contrast-check.py)
- **Ground (Archival Paper)**: `#F7F4EE`
- **Elevated Sheet**: `#FFFDF9`
- **Primary Ink (Headings & Body)**: `#14263D` (13.92:1 on `#F7F4EE`)
- **Brand Navy (Primary Interactive)**: `#1E3A5F` (10.48:1 on `#F7F4EE`; `#FFFFFF` on `#1E3A5F` = 11.50:1)
- **Secondary Ink (Metadata & Captions)**: `#475467` (7.00:1 on `#F7F4EE`, 7.57:1 on `#FFFDF9`)
- **Accent Brass (Rules & Primary Gold CTA)**: `#C9A227` (`#14263D` ink on `#C9A227` = 6.32:1)
- **Accent Gold Ink (Light Surfaces)**: `#785B0A` (5.80:1 on `#F7F4EE`, 6.26:1 on `#FFFDF9`)
- **Accent Gold Ink (Dark Surfaces)**: `#F0D57A` (10.55:1 on `#14263D`)
- **Hairline Divider**: `#D8D1C3`
- **Input Border (WCAG 1.4.11 >= 3:1)**: `#8C8272` (3.72:1 on `#FFFDF9`)

## Typography
- **Display & Editorial Serif**: `Newsreader` (Google Fonts via `next/font/google`) for headlines, masthead, article titles, and editorial pull quotes.
- **Body & Interface Sans**: `Plus Jakarta Sans` (Google Fonts via `next/font/google`) for body paragraphs, navigation, forms, and tabular metadata.
- **Body Measure**: `65ch-70ch` on long-form article views; `tabular-nums` for dates, counters, and statistics.

## Surface & Interaction Rules
- **Theme**: Fixed warm light archival paper (editorial reading clarity for legal prose).
- **Elevation**: Hairline borders (`1px solid #D8D1C3`) as primary containment; subtle shadow reserved for modals and elevated hover lifts only.
- **Motion**: Quiet hover & press transitions only (`MOTION 1`); all non-essential transitions disabled under `prefers-reduced-motion: reduce`.
- **Accessibility**: Visible `:focus-visible` rings, Escape-closable dialogs, skip-to-content link, `>= 44px` tap targets on mobile, zero em dashes in agent copy.
