# FlexiSpace — Employee App Case Study

## URLs
- **Live:** https://jisijain.github.io/project/flexispace/
- **Local:** http://localhost:3000/flexispace/index.html

## Folder contents
```
project/flexispace/
  index.html              ← case study page (entry point)
  FlexiSpace Demo.html    ← interactive prototype (loaded in iframe)
  casestudy/
    cs.css                ← case study styles (original teal theme)
    cs.js                 ← scroll/reveal animations
    theme-dark.css        ← dark portfolio theme override
    img/                  ← case study mockup screenshots
  app/                    ← React JSX screens for the prototype
  lib/                    ← ios-frame.jsx, tweaks-panel.jsx
  assets/                 ← desk-cluster.png, desk-setup.png, desk-view.png
  uploads/                ← original Figma export images
```

## Dark theme
Applied via TWO layers in `index.html`:
1. `<link rel="stylesheet" href="casestudy/theme-dark.css" />` — CSS variables
2. Inline `<style>` block — `!important` overrides for stubborn elements

Key overrides: `html,body{background:#0d0507}`, `.phone{background:#1c0a0d}`,
`.hero{background:#0d0507}`, `.eyebrow{color:#c8384a}`

## Interactive prototype (iframe)
The iframe in the "Interactive Demo" section loads `FlexiSpace Demo.html`.
That file requires these folders to be present:
- `app/` — all screen JSX files
- `lib/ios-frame.jsx`

## Case study CSS structure
- Original colors: teal `#0E9C8E`, indigo `#4F46E5`, canvas `#F4F6F9`
- Dark theme overrides these via `theme-dark.css` + inline styles
- Phone frames: `.phone { background: #fff }` — override to `#1c0a0d` in dark theme
- Reveal animation: `.reveal { opacity:0; transform:translateY(26px) }` — JS fires `.in` class on scroll

## Back button
Fixed pill at top-left, links to `../Work.html`
Style: `rgba(0,0,0,.45)` background, blur, white text, uppercase
