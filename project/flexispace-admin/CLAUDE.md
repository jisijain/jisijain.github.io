# FlexiSpace Admin — Operator Dashboard Case Study

## URLs
- **Live:** https://jisijain.github.io/project/flexispace-admin/
- **Local:** http://localhost:3000/flexispace-admin/index.html

## Folder contents
```
project/flexispace-admin/
  index.html                      ← case study page (entry point)
  FlexiSpace Admin.html           ← live admin dashboard app
  FlexiSpace Admin Case Study.html ← source (index.html copied from this)
  FlexiSpace Demo.html            ← employee prototype (same as flexispace/)
  casestudy/
    cs.css                        ← shared case study styles
    cs.js                         ← scroll/reveal animations
    img/
      admin-dark.png              ← used as Work + Home thumbnail
      admin-analytics.png
      admin-bookings.png
      admin-cc.png
      admin-floors.png
      admin-people.png
  admin/                          ← JSX for the admin dashboard app
  app/                            ← JSX for the employee prototype
  lib/                            ← ios-frame.jsx, tweaks-panel.jsx
  assets/                         ← desk images
  uploads/                        ← Figma export images
  screenshots/                    ← design iteration screenshots
```

## Dark theme
Applied via inline `<style>` block in `index.html` (no separate theme-dark.css).
Key selectors: `.win`, `.win-bar`, `.win.dark .win-bar`, `.live-badge`, `.adm-tag`

## Thumbnail image
`casestudy/img/admin-dark.png` — used in both Home.html and Work.html

## Case study specifics
- Uses desktop browser chrome (`.win`, `.win-bar`) to show the admin UI
- Has a 3D floor map section, analytics charts, bookings management
- Hero uses `.ahero-grid` layout (different from employee case study)
- `.adm-tag` pill shows "Admin Console" label next to the h1

## Back button
Fixed pill at top-left, links to `../Work.html`
