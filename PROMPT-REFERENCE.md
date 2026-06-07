# Portfolio — File & Section Reference
Use this to write precise prompts. Format: "In `<file>`, in the `<section>`, change X to Y"

---

## SHARED FILES (affect every page)

| File | What it controls |
|------|-----------------|
| `project/assets/styles.css` | All shared styles — layout, nav, hero, cards, typography, colors, mobile responsive |
| `project/assets/favicon.svg` | The M favicon (Anton font, #b32434 red, white stroke) |
| `project/assets/animations.js` | Scroll reveals, magnetic buttons, counters, tilt effects |
| `project/assets/image-slot.js` | The `<image-slot>` custom component |

---

## HOME PAGE — `project/Home.html`

| Section label | What's in it |
|--------------|--------------|
| `Home / Hero` | 3D character, name, tagline, "Want to know about me?" bubble (links to About), CTA button |
| `Home / About teaser` | Short bio paragraph, portrait slot, skills list |
| `Home / Projects teaser` | 3 project cards: FlexiSpace, Sargam, FlexiSpace Admin |
| `Home / Services teaser` | 3 service cards with icons |
| `Home / Process` | Step-by-step process (Discover → Define → Design → Deliver) |
| `Home / CTA` | "Like what you see? Let's work together" band |
| `Footer` | Name, sitemap links, contact info, social icons |
| `Nav` | Logo + nav links + Contact button + mobile burger |

### Project card IDs (Home)
| Card | image-slot id |
|------|--------------|
| FlexiSpace | `home-proj-flexispace` |
| Sargam | `home-proj-sargam` |
| FlexiSpace Admin | `home-proj-flexiadmin` |

---

## WORK PAGE — `project/Work.html`

| Section label | What's in it |
|--------------|--------------|
| `Work / Header` | "Projects & case studies" hero band |
| `Work / Case studies` | All 5 project articles (01–05) |
| `Work / Experience` | Timeline: Freelance → Ericsson → Hind Academy |
| `Work / CTA` | "Like what you see?" band |
| `Footer` | Same footer as all pages |

### Case study articles (Work page)
| # | Project | image-slot id | Clickable? |
|---|---------|--------------|------------|
| 01 | FlexiSpace | `work-flexispace` | Yes → `flexispace/index.html` |
| 02 | Sargam | `work-sargam` | Yes → `sargam/index.html` |
| 03 | GyanGram | `work-grangram` | No |
| 04 | Crickrida | `work-crickrida` | No |
| 05 | FlexiSpace Admin | `work-flexiadmin` | Yes → `flexispace-admin/index.html` |

---

## ABOUT PAGE — `project/About.html`

| Section label | What's in it |
|--------------|--------------|
| `About / Intro` | Portrait, name, bio, "Download CV" button |
| `About / Education` | Degree, institution, year |
| `About / Skills` | Tools grid: Figma, Maze, Hotjar, etc. |
| `About / Expertise` | UX Research, Interaction Design, Visual Design cards |
| `About / CTA` | "Let's work together" band |
| `Footer` | Standard footer |

### Key element IDs (About)
| Element | ID / selector |
|---------|--------------|
| Portrait image | `image-slot#about-portrait` |
| CV download button | `.btn` inside intro section |

---

## SERVICES PAGE — `project/Services.html`

| Section label | What's in it |
|--------------|--------------|
| `Services / Header` | "What I offer" hero band |
| `Services / Grid` | 6 service cards (UX Research, UI Design, Prototyping, etc.) |
| `Services / How we work` | 4-step process strip |
| `Services / CTA` | "Ready to start?" band |
| `Footer` | Standard footer |

---

## CONTACT PAGE — `project/Contact.html`

| Section label | What's in it |
|--------------|--------------|
| `Contact` | Full-page form: name, email, message, send button + contact details |
| `Footer` | Standard footer |

---

## FLEXISPACE CASE STUDY — `project/flexispace/index.html`

| Section / id | What's in it |
|-------------|--------------|
| `#top` / `.hero` | Title "FlexiSpace", tagline, tags, phone mockups |
| `.band-sm` (meta strip) | Duration, role, team, platform |
| `.band.challenge` | "The Challenge" — 3 problem cards |
| `.band` (opportunity) | Opportunity/goals section |
| `.band-sm.principles` | Design principles |
| `#ba` | Before/After comparison slider |
| `.band-sm.principles` (core exp) | Core experience features |
| `#demo` / `.band.demo` | Interactive prototype iframe |
| `.band` (design system) | Colors, type, components |
| `.band.outcomes` | Results & metrics |
| `.band` (reflections) | "What I took away" |
| `Footer` | Standard case study footer |

### CSS files (FlexiSpace)
| File | Purpose |
|------|---------|
| `casestudy/cs.css` | All case study layout + original teal theme |
| `casestudy/theme-dark.css` | Dark portfolio theme overrides (CSS variables) |
| Inline `<style>` in index.html | `!important` overrides for stubborn elements |

---

## FLEXISPACE ADMIN CASE STUDY — `project/flexispace-admin/index.html`

| Section | What's in it |
|---------|--------------|
| `.hero` / `.ahero-grid` | Title "FlexiSpace Admin", tagline, browser-chrome mockup |
| Meta strip | Duration, role, team, platform |
| Challenge section | Problem statements |
| Features sections | Analytics, 3D floor maps, bookings, people management |
| Design system | Colors, components |
| Outcomes | Results & metrics |
| Reflections | Learnings |

### CSS file (FlexiSpace Admin)
| File | Purpose |
|------|---------|
| `casestudy/cs.css` | Case study layout (shared with FlexiSpace) |
| Inline `<style>` in index.html | Dark theme + admin-specific overrides (`.win`, `.win-bar`, `.ahero-grid`, `.adm-tag`) |

---

## SARGAM CASE STUDY — `project/sargam/index.html`

| Section | What's in it |
|---------|--------------|
| Hero | Sargam title, music app cover, tagline |
| Research | User research findings |
| IA / Flows | Information architecture, user flows |
| UI Design | High-fidelity screens |
| Outcomes | Results |

---

## PROMPT TEMPLATES

### Change text in a section
> In `project/Home.html`, in the `Home / Hero` section, change the tagline text from "..." to "..."

### Change a style
> In `project/assets/styles.css`, in the `@media (max-width: 560px)` block, change `.hero__visual` max-width from `200px` to `180px`

### Change a project card
> In `project/Work.html`, in the `Work / Case studies` section, update the `work-grangram` article description to "..."

### Add something to a section
> In `project/Home.html`, in the `Home / Services teaser` section, add a 4th service card for "Motion Design"

### Change case study content
> In `project/flexispace/index.html`, in the `#demo` section, change the iframe `src` from `FlexiSpace Demo.html` to `FlexiSpace Demo.html?screen=map`

### Change shared styles
> In `project/assets/styles.css`, find the `.nav` block and change the nav background to `rgba(13,5,7,.95)`
