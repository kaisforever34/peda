---
name: PEDA
description: AI-powered learning platform for students and teachers
colors:
  primary: "#2563eb"
  primary-foreground: "#ffffff"
  background: "#f0f4ff"
  foreground: "#0f1b35"
  card: "#ffffff"
  card-foreground: "#0f1b35"
  secondary: "#dbeafe"
  secondary-foreground: "#1d4ed8"
  muted: "#f0f4ff"
  muted-foreground: "#6b7fa3"
  accent: "#dce5f7"
  accent-foreground: "#0f1b35"
  destructive: "#ef4444"
  destructive-foreground: "#ffffff"
  border: "#dce5f7"
  input: "#dce5f7"
  ring: "#2563eb"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 5vw + 1rem, 4rem)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: normal
  body:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.5vw + 0.9rem, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.01em
  label:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: normal
rounded:
  sm: "calc(0.5rem - 2px)"
  md: "0.5rem"
  lg: "calc(0.5rem + 2px)"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
---

# Design System: PEDA

## 1. Overview

**Creative North Star: "The Study Nook"**

A learning space that feels personal and focused like a well-worn study nook — familiar enough to be comfortable, sharp enough to command attention. PEDA's interface should feel like sitting down at a clean desk with good light: everything you need is in reach, nothing distracts, and the tools themselves fade into the background of the work.

The design pairs the spacious, low-density confidence of Linear with a warmth appropriate for education. This is not a sterile enterprise dashboard — it has temperature. Cards have soft shadows. Whitespace is generous. Interaction feels tactile, not cold.

**Key Characteristics:**
- Spacious and airy — generous whitespace, low information density
- Lifted surfaces with soft shadows — depth through elevation, not tonal layers
- One primary accent (blue), restrained usage
- Sharp typographic hierarchy with Outfit's geometric clarity
- Responsive motion that aids understanding, never decorative

## 2. Colors

PEDA's palette is built around a cool blue primary with warm-tinted neutrals in the default (Arctic) theme. Six themes trade the primary and background values while keeping the same structural roles.

### Primary (Arctic default)
- **Study Blue** (#2563eb / oklch(55% 0.19 265)): Primary actions, links, focus rings, active nav. Reserved for interactive elements only — never decorative use.

### Neutral
- **Ice Background** (#f0f4ff): Page background. Slightly blue-tinted off-white, never pure white.
- **Snow Card** (#ffffff): Surface background for cards, dialogs, popovers.
- **Slate Text** (#0f1b35): Body and heading text. High contrast on all surfaces.
- **Mist Border** (#dce5f7): Card borders, input strokes, dividers. Subtle presence.
- **Frost Muted** (#6b7fa3): Secondary text, placeholders, disabled states.

### Secondary
- **Sky Wash** (#dbeafe): Secondary buttons, selected states, subtle highlights.
- **Sky Text** (#1d4ed8): Text on secondary surfaces.

### Semantic
- **Alert Red** (#ef4444): Destructive actions, errors, critical notifications.
- **Alert Red Text** (#ffffff): Text on destructive surfaces.

### Theme Variants
- **light**: Warm off-white background (#fafafa), indigo primary (#4f46e5). Lighter, more traditional.
- **dark**: Dark slate background (#0f172a), purple-indigo primary (#6366f1). Full dark mode.
- **obsidian**: Very dark indigo (#0a0a0f), violet primary (#6c63ff). Deep, dramatic.
- **terra**: Warm beige background (#fdf6ee), burnt-orange primary (#c05621). Warmest option.
- **signal**: Dark green background (#040d0a), neon green primary (#00ff88). High-energy.

### Named Rules
**The One Voice Rule.** The primary accent drives all interactive cues. It appears on buttons, links, focus rings, and active navigation — never on decorative borders, never as background washes, never as a content differentiator. When the primary is present, it means "you can interact here."

**The Mist Border Rule.** Card and container borders are always low-contrast (oklch(85% 0.01 265)). They define boundaries without competing with content. Never use high-contrast borders on containers.

## 3. Typography

**Display & Body Font:** Outfit (geometric sans-serif, with system-ui fallback)

Outfit's geometric clarity pairs the sharpness of a modern sans-serif with warm, open apertures that keep it readable even at display sizes. It carries both headline confidence and body text comfort without a second typeface.

**Character:** Confident but warm. Wide letterforms and open shapes give PEDA an approachable precision — like a well-designed textbook typeset by someone who cared about the reading experience.

### Hierarchy
- **Display** (900, clamp(1.875rem, 5vw + 1rem, 4rem), 1.1): Page titles, hero sections only. Extreme weight contrast draws immediate attention.
- **Headline** (700, 1.5rem, 1.2): Section headings, card titles. Where most content headings live.
- **Title** (600, 1.125rem, 1.3): Card titles, nav labels, emphasis text.
- **Body** (400, clamp(1rem, 0.5vw + 0.9rem, 1.25rem), 1.6): All reading text. Max line length 72ch.
- **Label** (500, 0.875rem, 1.25): Form labels, stats, metadata, timestamps. Uppercase + wider tracking for emphasis when needed.

### Named Rules
**The 900-400 Rule.** Weight is the primary hierarchy signal. Display is 900, body is 400 — a 500-point gap that creates unmistakable visual separation without relying on color or size alone. Never use a weight between 400 and 900 for body or display text; reserve intermediate weights (500, 600, 700) for interactive text (labels, buttons, navigation).

## 4. Elevation

PEDA uses a lifted surface model with subtle shadows. Cards and interactive elements sit slightly above the background, creating a tactile, physical feel appropriate for an app where users handle documents, exams, and assignments.

**Character:** Gentle elevation with tight blur radii. Shadows should feel like paper-thin lifts, not floating layers. Surface background shifts (card vs. page) combined with soft shadows produce depth without drama.

### Shadow Vocabulary
- **Card Shelf** (`box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)`): Default card and container elevation.
- **Hover Lift** (`box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)`): Card hover state, dialog, dropdown. More pronounced, signals interactivity.
- **Modal Float** (`box-shadow: 0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)`): Modals, full-screen overlays.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat at rest. Shadows appear only as a response to interaction (hover, focus, selection) or to distinguish modal content from the page below. A card at rest has the minimal Card Shelf shadow — just enough to lift it off the background.

## 5. Components

### Buttons

Buttons are rounded-rectangle with Outfit 500 weight. Three tiers of hierarchy.

- **Shape:** Gently curved rectangles (0.5rem radius)
- **Primary:** Study Blue fill (#2563eb), white text, 0.5rem 1rem padding. Hover: lighten to 90% opacity. Focus: 2px ring in primary.
- **Outline:** Transparent fill, 1px Mist Border stroke (#dce5f7), Slate Text. Hover: Sky Wash background (#dbeafe). Active pressed state.
- **Ghost:** No border, no background. Hover: accent wash (#dce5f7).

### Cards

Cards are the primary container pattern — used for course items, exam questions, dashboard stats, and settings panels.

- **Corner Style:** Rounded corners (0.5rem)
- **Background:** Snow Card (#ffffff)
- **Shadow Strategy:** Card Shelf at rest, Hover Lift on hover and selected state
- **Border:** 1px Mist Border (#dce5f7)
- **Internal Padding:** 1.5rem (p-6) content, CardHeader adds 1.5rem top padding and 1.5rem bottom gap
- **Title:** Outfit 600 weight, 1.125rem (text-lg)
- **Description:** Outfit 400, 0.875rem, Frost Muted (#6b7fa3)

### Inputs / Text Fields

- **Style:** 1px Mist Border stroke, transparent background, 0.5rem radius
- **Padding:** 0.5rem 0.75rem
- **Focus:** 2px primary ring (#2563eb), border shifts to primary
- **Label:** 0.875rem, Outfit 500
- **Placeholder:** Frost Muted (#6b7fa3)
- **Error:** Alert Red border (#ef4444) + red-tinted background

### Navigation (App Shell)

Sidebar navigation for authenticated sections. Two-tier: icons-only collapsed, expanded with labels.

- **Style:** No background in default state. Selected state: primary tint wash.
- **Typography:** Outfit 500, 0.875rem
- **Active:** Primary icon color + subtle background tint.
- **Hover:** Accent wash background (#dce5f7)

## 6. Do's and Don'ts

### Do:

- **Do** use generous whitespace between sections — 1.5rem minimum, 2rem preferred between major blocks.
- **Do** use Outfit at 900 weight for page titles and 400 for body text. The 500-point gap is intentional.
- **Do** use the Study Blue accent for interactive elements only — buttons, links, active nav.
- **Do** use the Mist Border rule for all container outlines.
- **Do** use soft shadows (Card Shelf) to lift surfaces subtly.
- **Do** use clamp-based font sizes for fluid typography across viewports.

### Don't:

- **Don't** look like Canvas, Moodle, or any traditional LMS — dense tables, cluttered sidebars, heavy borders, small fonts.
- **Don't** use the primary accent for decorative purposes (background washes on non-interactive elements, ornamental borders).
- **Don't** use gradient text (`background-clip: text` + gradient). Emphasis comes from weight and size.
- **Don't** use glassmorphism, frosted glass, or decorative blur effects.
- **Don't** use side-stripe borders (border-left > 1px as an accent stripe on cards or list items).
- **Don't** use `#000` or `#fff` — always tint neutrals.
- **Don't** use identical card grids repeating the same layout pattern endlessly.
- **Don't** use modals as a first solution — exhaust inline and progressive alternatives first.
- **Don't** animate layout properties (width, height, top, left). Use transforms and opacity only.
