# Mahima Jain — Portfolio (jisijain.github.io)

## Repo & deploy
- **Repo:** https://github.com/jisijain/jisijain.github.io
- **Live URL:** https://jisijain.github.io/project/Home.html
- **Branch:** `main` → auto-deploys to GitHub Pages (takes ~1-2 min)
- **Deploy:** `git add <files> && git commit -m "..." && git push origin main`
- **Local preview:** `npx serve project -l 3000` → http://localhost:3000

## Folder structure
```
project/
  Home.html          ← main landing page
  Work.html          ← all case studies list
  About.html
  Services.html
  Contact.html
  assets/
    styles.css       ← shared portfolio styles
    favicon.svg      ← letter M, Anton font, #b32434 red + white stroke
    animations.js
    image-slot.js
  flexispace/        ← FlexiSpace employee app case study
  flexispace-admin/  ← FlexiSpace Admin dashboard case study
  sargam/            ← Sargam AI music app case study
index.html           ← root redirect → project/Home.html
```

## Color palette (portfolio theme)
| Token      | Value       | Use                        |
|------------|-------------|----------------------------|
| canvas     | `#0d0507`   | page background            |
| surface    | `#1c0a0d`   | cards, panels              |
| panel      | `#271013`   | topbar, secondary surfaces |
| ink        | `#f4ebe6`   | body text                  |
| ink2       | `#c9b5ae`   | secondary text             |
| ink3       | `#9a7e78`   | muted / labels             |
| teal/red   | `#b32434`   | primary accent (red)       |
| teal-deep  | `#c8384a`   | hover accent               |
| indigo     | `#7a1420`   | deep accent                |
| line       | `rgba(244,235,230,.08)` | borders       |

## Adding a new project — checklist
1. Copy project files to `project/<slug>/`
2. Rename main HTML to `index.html`
3. In `index.html` `<head>`, add after CSS link:
   `<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />`
4. After `<body>`, add "← Back to Work" button (see any existing case study)
5. Add dark theme `<style>` block (copy from `flexispace/index.html` inline style)
6. Add project card to **Home.html** (proj-grid section)
7. Add case article to **Work.html** (numbered 01-05+, alternating `case--flip`)
8. Commit + push

## Home.html — project grid
Currently shows: FlexiSpace → Sargam → FlexiSpace Admin
Section: `<!-- ===== WORK PREVIEW ===== -->`
Cards use `.proj` `.proj__media` `.proj__meta` pattern.

## Work.html — case studies order
| # | Project           | Flip?      | Clickable? |
|---|-------------------|------------|------------|
| 01 | FlexiSpace       | no         | yes        |
| 02 | Sargam           | case--flip | yes        |
| 03 | GyanGram         | no         | no         |
| 04 | Crickrida        | case--flip | no         |
| 05 | FlexiSpace Admin | no         | yes        |

## Image pattern
- Case study thumbnails use `<image-slot>` with `src=` set to a permanent path
- Hero + about portrait: `assets/character.webp`
- Never rely on `.image-slots.state.json` for permanent images

## Mobile responsive (styles.css)
- At 900px: hero text first (order:1), character below (order:2), centered
- At 560px: character smaller (220px), bubble switches to relative positioning

## Favicon
SVG at `project/assets/favicon.svg` — letter M, Anton font, `#b32434` fill, white stroke 1.5px
