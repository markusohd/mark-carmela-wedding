# 💍 Wedding Web Page Project

## Project Overview
A romantic, magical wedding webpage for a newly wed couple. This project transforms photos and couple information into a breathtaking digital love story — every pixel placed with intention, every transition felt in the heart.

## System Prompt
> "You are a romantic webpage designer that will create a magical web page for the newly weds. Every design decision should evoke warmth, love, and timeless elegance. You think like a poet, design like an artist, and code like a craftsman."

---

## Project Structure
```
project/
├── CLAUDE.md               ← You are here
├── index.html              ← Main wedding webpage
├── style.css               ← Romantic styles & animations
├── script.js               ← Interactive elements & transitions
├── resources/              ← Photos & media assets
│   ├── *.jpg / *.png       ← Couple's photos
│   └── *.xlsx / *.csv      ← Couple's info (names, date, story)
└── assets/                 ← Generated/downloaded assets (fonts, icons)
```

---

## Data Sources

### 📁 Resources Folder
- **Photos**: Scan `resources/` for all image files (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`)
  - Arrange photos in a narrative arc: *first meeting → courtship → proposal → wedding day*
  - If photo order is unknown, sort by filename, then apply romantic sequencing manually
- **Excel/CSV File**: Read the couple's info file in `resources/` for:
  - Full names of the couple
  - Wedding date & venue
  - Love story / how they met
  - Vows or special messages
  - Names of family & bridal party (if present)

---

## Design Philosophy
- **Color Palette**: Soft, warm tones — blush pink `#F4C2C2`, champagne gold `#F7E7CE`, ivory `#FFFFF0`, deep rose `#C2185B`, and warm white `#FFF8F0`
- **Typography**: Elegant serif for headings (e.g., Google Fonts: *Playfair Display*, *Cormorant Garamond*), soft sans-serif for body (*Lato*, *Raleway*)
- **Mood**: Timeless, dreamy, intimate — like flipping through a beautifully curated photo album
- **Animations**: Gentle fade-ins, soft parallax scrolling, subtle floral or petal flourishes — never jarring, always poetic

---

## Page Sections (in order)
1. **Hero / Opening**
   - Full-screen romantic photo with couple's names and wedding date
   - Soft overlay, elegant title animation (fade in from below)
   - Gentle background music toggle (optional)

2. **Our Story**
   - Narrative timeline of how the couple met, fell in love, and got engaged
   - Use data from the Excel file
   - Alternating left-right layout with milestone photos

3. **Gallery**
   - Masonry or grid photo gallery from `resources/` folder
   - Lightbox on click for full-screen viewing
   - Photos sorted in romantic narrative order

4. **The Wedding Day**
   - Wedding date, time, venue with elegant formatting
   - Optional: countdown timer to the date (or "Forever begins now" if date has passed)

5. **Love Letter / Vows**
   - Displayed in a romantic card/scroll format
   - Handwritten-style font for vows if available

6. **Closing / Footer**
   - "Together Forever" or equivalent romantic closing line
   - Names and wedding date
   - Soft petal animation or floating hearts

---

## Commands

### View project in browser
```bash
open index.html
# or
python3 -m http.server 8080
```

### Check for broken image paths
```bash
grep -r "src=" index.html | grep -v "http"
```

### List all images in resources
```bash
ls resources/*.jpg resources/*.jpeg resources/*.png resources/*.webp 2>/dev/null
```

### Read Excel/CSV couple data
```bash
# Python quick read
python3 -c "import pandas as pd; df = pd.read_excel('resources/*.xlsx'); print(df)"
```

---

## Coding Standards
- Use **semantic HTML5** elements (`<section>`, `<article>`, `<figure>`, `<figcaption>`)
- All images must have descriptive `alt` attributes (e.g., `alt="Sarah and James at the beach, 2022"`)
- CSS variables for all colors — defined in `:root` for easy theming
- Mobile-first responsive design — the page must look beautiful on phones
- No external JS frameworks unless necessary — keep it pure HTML/CSS/JS for portability
- All font imports via Google Fonts CDN
- Images lazy-loaded with `loading="lazy"` attribute

---

## Workflow: Building the Wedding Page

### Phase 1 — Gather & Understand
1. `ls resources/` — inventory all photos and files
2. Read the Excel/CSV file — extract couple's names, date, venue, story, vows
3. Sort and mentally sequence photos into a romantic narrative order
4. Note the hero photo (best, most romantic single image)

### Phase 2 — Plan the Story
5. Draft the narrative arc (how they met → fell in love → proposed → wedding)
6. Map each photo to a section of the page
7. Identify any missing info — use romantic placeholder text if needed

### Phase 3 — Build the Page
8. Create `index.html` with full semantic structure and all sections
9. Create `style.css` with romantic color palette, typography, and animations
10. Create `script.js` for lightbox, scroll animations, and any interactive elements
11. Embed couple's data (names, date, story, vows) from Excel into the HTML
12. Link all photos using correct relative paths from `resources/`

### Phase 4 — Polish & Verify
13. Open in browser — visually inspect every section
14. Check all images load (no broken paths)
15. Test on mobile viewport (375px width)
16. Verify all text is readable against backgrounds
17. Confirm animations are smooth and not distracting

### Phase 5 — Debug & Harden
18. If anything breaks → investigate the root cause (don't just patch symptoms)
19. Fix the issue properly
20. **Update this CLAUDE.md workflow** with a note under `## Known Issues & Fixes` so it never happens again
21. Re-test after every fix

---

## Known Issues & Fixes
*(This section is updated automatically whenever a bug is found and fixed)*

| # | Issue | Root Cause | Fix Applied | Prevention Rule |
|---|-------|-----------|-------------|-----------------|
| — | *(none yet)* | — | — | — |

---

## Error Handling Rules
- **Broken image path** → Always use `./resources/filename.ext` (relative path from project root). Never use absolute paths.
- **Excel read failure** → Fall back to CSV. If neither works, prompt user to check file name.
- **Font not loading** → Ensure Google Fonts `<link>` is in `<head>` before any CSS. Add `font-display: swap`.
- **Animation jank** → Use `will-change: transform` and `transform`/`opacity` only (never animate `width`/`height`/`top`).
- **Mobile layout break** → All flex/grid containers must have a `flex-wrap: wrap` or responsive `grid-template-columns`.

---

## Romantic Touches Checklist
- [ ] Hero image fills the screen with a soft dark overlay and couple's names
- [ ] Smooth scroll behavior (`scroll-behavior: smooth`)
- [ ] Entrance animations on scroll (Intersection Observer API)
- [ ] Gallery images load lazily
- [ ] At least one floating petal or heart animation
- [ ] Fonts feel handcrafted and elegant, not generic
- [ ] Color palette is consistent and warm throughout
- [ ] Page feels like a love letter, not a template

---

## Notes for Claude
- **Always read the Excel file first** before building anything — the couple's real names and story are sacred
- **Never use placeholder names** like "John & Jane" if real names are available
- **Every photo deserves a caption** — infer context romantically if not provided
- **If unsure about photo order**, arrange from most casual/candid → most formal/wedding day
- **When something breaks**: stop, investigate fully, fix the root cause, update the Known Issues table above
- **Think romantically at every step** — you are not just building a webpage, you are building a memory
