---
name: Twist & Bloom
description: A tactile flower studio, made from fuzzy stems and a playful spirit.
colors:
  paper: "#faf7ee"
  paper-light: "#fffcf5"
  ink: "#3c2939"
  muted: "#71626a"
  pink: "#ce4e73"
  pink-dark: "#a63258"
  pink-soft: "#f3dce0"
  pink-surface: "#f3e5e4"
  yellow: "#efd371"
  yellow-surface: "#f4edcf"
  lavender: "#b6a0c8"
  lavender-surface: "#e9e3ef"
  green: "#678059"
  green-surface: "#e7eadc"
  border: "#dbd2ca"
  footer: "#e8ecdf"
  footer-ink: "#344a35"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(64px, 6.65vw, 96px)"
    fontWeight: 600
    lineHeight: 0.985
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(40px, 4.1vw, 61px)"
    fontWeight: 500
    lineHeight: 1.07
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.6
  button:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.6
rounded:
  field: "5px"
  control: "6px"
  image-mobile: "8px"
  image: "12px"
  chip: "30px"
  circle: "50%"
spacing:
  section: "clamp(80px, 8vw, 128px)"
  section-mobile: "76px"
  field-padding: "12px"
  form-gap: "16px"
  collection-column-gap: "24px"
  collection-row-gap: "38px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-light}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "15px 25px"
  button-primary-hover:
    backgroundColor: "{colors.pink-dark}"
    textColor: "{colors.paper-light}"
  button-outline:
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "10px 15px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-text:
    textColor: "{colors.ink}"
    padding: "3px 0"
  button-icon:
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    size: "44px"
  chip-filter:
    textColor: "{colors.ink}"
    rounded: "{rounded.chip}"
    padding: "9px 17px"
  chip-filter-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "{spacing.field-padding}"
  creation-image:
    backgroundColor: "{colors.pink-surface}"
    rounded: "{rounded.image}"
  dialog:
    backgroundColor: "{colors.paper-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.image}"
---

# Design System: Twist & Bloom

## Overview

**Creative North Star: "The tactile flower studio"**

Warm paper, plum lettering, rose accents, and fuzzy handmade forms make the interface feel like a cheerful studio visit. Large, closely set headings give the brand presence; smaller conversational copy and open spacing keep the tone gentle.

Material texture belongs to the artwork. Controls stay clear and simple, with small physical responses to touch and hover. This document records the implemented system; it is not a record of an approved visual comp. Source authority is `src/styles.css`, with behavior in the React components. Page composition and business constraints remain in the home surface brief and `PRODUCT.md`.

**Key Characteristics:**

- Warm cream grounds with plum text and selective rose emphasis.
- Original dimensional chenille objects, pastel stages, and irregular paper shapes.
- Expressive display type paired with quiet, readable interface copy.
- Restrained tactile motion with keyboard access and reduced-motion support.

## Colors

The palette feels warm and handmade, with stronger colors carrying emphasis and pale colors giving objects room.

The sidecar's synthesized tonal strips are visualization aids, not additional implementation tokens.

- **Primary:** Plum ink supplies headings, text, and primary buttons. Rose pink marks expressive words and flowers; deep rose carries smaller accent text, hover states, and focus outlines.
- **Secondary:** Butter yellow and dusty lavender distinguish stamps, workshop labels, and bouquet mood controls. Leaf green and forest ink support the closing studio statement.
- **Neutral:** Warm paper is the page ground; light paper is the dialog and floating-control surface. Muted plum supports prose. Warm gray borders define fields, filters, and FAQ rows.
- **Tonal surfaces:** Soft pink supports broad bands and the hero backdrop. Pink, yellow, lavender, and sage image surfaces sit behind creation artwork. The pale sage footer has its own forest text pairing.

**The Color Roles Rule.** Keep pale pastels as supporting surfaces; use ink or deep rose for functional text and states.

## Typography

Bricolage Grotesque supplies expressive headings, creation titles, the wordmark, and occasional studio notes. DM Sans supplies prose, navigation, forms, and controls. Both fall back to sans-serif. The scale is responsive and role-specific, not a fixed mathematical progression.

- Display headlines use tight leading and tracking; selective colored words and a hand-drawn underline supply character without another type family.
- Section headings use medium weight. Workshop and footer statements have their own larger responsive sizes; avoid treating the hero size as a universal heading preset.
- Creation titles are compact and medium weight. Description text and the gallery illustration disclosure remain at least (12px) in the current responsive rules.
- General prose is muted, with longer story and workshop paragraphs using generous leading (1.9). Small labels vary by context; they are supporting details, not substitutes for explanatory copy.
- Form text rises from (12px) to (16px) on phone layouts. Product dialogs begin directly with their title, followed by prose and an action.

## Layout

The shared content container caps at (1280px), with desktop side space of (56px). At widths up to (1100px), side space becomes (36px); up to (640px), it becomes (20px); below (375px), it becomes (16px). The masthead and hero have slightly wider desktop caps.

Sections use the responsive section-spacing token. Major editorial pairs use unequal or equal two-column grids according to the content. The creation index is three columns, becomes two at (800px), and retains two on phones. Image proportions move from near-square to portrait. At (640px), hero, story, workshops, FAQ, product dialog, and form rows stack; the category chip row becomes a native select and the navigation becomes a menu.

The other implemented breakpoints are (374px), (800px), and a large-display enhancement at (1600px). Preserve the two-column collection and readable wrapping when extending the small-screen layout. The grid is not a universal wrapper for editorial sections.

## Elevation & Depth

Depth comes primarily from textured 3D artwork, overlapping stickers, and contrasting pastel surfaces. Creation cards are flat at rest. Soft plum shadows lift handmade stamps, the mobile menu, toasts, and dialogs; primary buttons gain a short shadow on hover. Exact shadow and motion values live in the sidecar.

**The Material Depth Rule.** Let artwork carry dimensional richness; use interface shadows to distinguish a lifted object or temporary layer.

Hover movement is small: buttons lift, arrows travel diagonally, saved hearts scale, and images gently enlarge and turn. Standard easing handles transitions; spring easing is limited to tactile controls. The ribbon runs slowly and pauses on hover or focus. The bouquet responds to drag and arrow keys, supports palette changes, pauses when not visible, and has a static fallback. Reduced motion suppresses decorative animation; the footer exposes a motion pause control.

## Shapes

Buttons and fields have modest corners. Filter chips and circular icon controls have distinct functional silhouettes. Image and dialog corners are softer. Organic asymmetry belongs to artwork stages: the rotated rounded hero backdrop, one large story-image corner, an arched workshop image, flower motifs, and irregular paper edges.

**The Shape Roles Rule.** Keep controls geometrically clear; reserve handmade irregularity for artwork, stamps, and section decoration.

## Components

- **Buttons:** Plum-filled primary actions use light-paper text and a directional icon. Deep rose, a slight lift, and a soft shadow mark hover; press settles the button. Outline contact buttons fill with plum. Underlined text actions widen the icon gap; round icon actions gain a soft-pink ground.
- **Focus and disabled states:** Buttons, links, and the canvas use a deep-rose outline (3px, 5px offset). Fields use a closer outline (2px, 2px offset). Disabled buttons reduce opacity to (.45). Preserve focus visibility; no custom error palette is implemented.
- **Filters and saved controls:** Outlined pill filters fill with plum when selected. Saved hearts use deep rose with soft-pink fill and expose a pressed state. Bouquet swatches combine an outer ring and a check, so selection has a shape cue as well as color.
- **Creation cards:** Pastel image panel, separate circular save control, title and arrow row, then muted description. Image hover reveals a closer-look prompt; keyboard focus reveals it too. On phones that overlay is hidden, while the image and title still open the creation. Use the actual illustrated creation assets and preserve their soft fiber texture.
- **Navigation:** Open masthead with a flower wordmark, compact text links, an underline on hover, and a bordered contact action. On phones, an explicit menu control reveals larger divided link rows. Escape closes the menu and restores focus.
- **Fields and dialogs:** Warm-paper fields sit inside light-paper dialogs with persistent labels. Product dialogs pair artwork and title-led prose; enquiry dialogs prepare an editable note to copy or download. Modal focus, Escape dismissal, outside dismissal, scroll containment, and focus restoration are part of the pattern.
- **FAQ and feedback:** FAQ rows use fine dividers and round plus/minus controls; the open control changes from sage to soft pink. Saved-item feedback appears as a brief plum toast. Empty saved collections show a centered, low-density invitation to explore.

## Do's and Don'ts

### Do:

- Do use the established color roles and type pairing.
- Do keep chenille fibers, imperfect loops, and soft object lighting visible in artwork.
- Do retain readable gallery descriptions and illustration disclosure on small screens.
- Do preserve keyboard equivalents, visible focus, static artwork fallback, and motion controls.

### Don't:

- Don't replace the material artwork with generic interface decoration.
- Don't turn every section into a rounded, shadowed card.
- Don't use faint pastel colors for explanatory text or selected-state feedback.
- Don't imply confirmed stock, prices, bookings, or sent enquiries through interface styling or copy.
