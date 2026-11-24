# Design Direction: Portal Berita HIMA Ilmu Hukum

- **Visual Language**: Portal Berita Hukum Indonesia (terinspirasi struktur redaksi media hukum seperti PortalHukum dan Hukumonline, dipadukan ketajaman jurnal hukum).
- **Dial**: ENERGY 2 / RHYTHM 2 / MOTION 1
- **Motif**: Header berita 3-lapis (utility bar, masthead + pencarian, bilah rubrik navy) dan judul seksi dua warna (`#0B4F9C` + `#111827`) bergaris bawah tegas.

## Colors

Tokens live in `src/app/globals.css` (semua lulus WCAG AA via `contrast-check.py`):

- Canvas: `#F4F6F9`, Sheet: `#FFFFFF`, Tinted Tag: `#EAF2FB`
- Deep Institutional Navy: `#0F213E` (header bar & footer), Primary Navy: `#142D55`
- Legal Editorial Blue: `#0B4F9C` (8.04:1 on `#FFFFFF`, 7.12:1 on `#EAF2FB`)
- Ink: `#111827` (17.74:1), Secondary Slate: `#475569` (7.58:1)
- Gold Accent: `#D4A72C` (`#0F213E` text = 7.16:1), Gold on Dark: `#F5D061` (10.77:1)
- Borders: `#DCE2EA` (structural hairline), `#64748B` (input border, 4.76:1)

## Typography

Loaded in `src/app/layout.tsx` via Google Fonts:

- Headlines & Article Titles: Newsreader
- UI, Lists & Body Copy: Plus Jakarta Sans (`tabular-nums` for dates/views, `68ch` reading measure)

## Components

- Navigation: `src/components/layout/Navbar.tsx` (3-tier newsroom header + search + live categories), `src/components/layout/Footer.tsx`, `src/components/layout/AdminSidebar.tsx`.
- Primitives: `src/components/ui/Button.tsx`, `Badge.tsx`, `Card.tsx`, `Input.tsx`, `Modal.tsx`.
- Newsroom: `src/components/articles/ArticleCard.tsx`, `PortalSidebar.tsx`, `GalleryGrid.tsx`, `ShareButtons.tsx`.
