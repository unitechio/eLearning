# Design System Specification: The Cognitive Atelier

This document outlines the visual language and structural logic for a high-end, AI-powered learning platform. It is designed to move beyond the "bootstrap" aesthetic, favoring a signature editorial feel that balances the technical precision of Vercel with the approachable utility of Notion and the fluid polish of Stripe.

---

## 1. Overview & Creative North Star: "The Digital Curator"

The Creative North Star for this system is **The Digital Curator**. In an era of AI-driven information overload, the UI must act as a calm, sophisticated gallery for knowledge. 

To achieve this, we break the "template" look through:
*   **Intentional Asymmetry:** Avoiding perfectly centered grids in favor of dynamic, left-aligned editorial layouts.
*   **Breathable Luxury:** Using aggressive whitespace (Scale 16 and 20) to signal importance.
*   **Surface-First Architecture:** Eliminating borders in favor of tonal "islands" that guide the eye naturally.

---

## 2. Colors & Surface Logic

We utilize a Material Design-inspired token system, but we apply it with a "High-End Editorial" lens.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders for sectioning or containment. 
Boundaries must be defined solely through background color shifts. For example, a `surface_container_low` sidebar sitting against a `surface` main content area provides enough contrast without the "visual noise" of a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, semi-transparent layers.
*   **Base Layer:** `surface` (#faf8ff) or `surface_container_lowest` (#ffffff).
*   **Structural Islands:** Use `surface_container_low` (#f2f3ff) for large structural blocks (e.g., a dashboard feed).
*   **Active Elements:** Use `surface_container_high` (#e2e7ff) for interactive cards that need to "pop" against the background.

### The "Glass & Gradient" Signature
To inject "soul" into the minimal palette:
*   **CTAs & Primary Actions:** Use a linear gradient from `primary` (#393ac8) to `secondary` (#6b38d4) at a 135° angle.
*   **Glassmorphism:** For floating menus or navigation bars, use `surface` at 80% opacity with a `backdrop-filter: blur(20px)`. This allows the "learning content" to subtly bleed through the interface, creating a sense of depth.

---

## 3. Typography: The Editorial Voice

We lead with **Inter**, utilizing a high-contrast scale to create an authoritative hierarchy.

*   **Display (The Hook):** `display-lg` (3.5rem) should be used sparingly for hero headers. Reduce letter-spacing to `-0.04em` for a "tight" premium feel.
*   **Headline (The Narrative):** `headline-md` (1.75rem) defines major sections. Use `Medium` (500) weight to maintain a professional, non-aggressive tone.
*   **Body (The Content):** `body-lg` (1rem) is the workhorse. Line height should be generous (1.6) to ensure long-form learning content feels approachable.
*   **Labels (The Utility):** `label-md` (0.75rem) in `on_surface_variant` (#464555) should be used for metadata and micro-copy.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are replaced by **Ambient Luminosity**.

*   **Layering Principle:** Place a `surface_container_lowest` (#ffffff) card on a `surface_container_low` (#f2f3ff) section. This creates a natural "lift" without a single pixel of shadow.
*   **Ambient Shadows:** For floating elements (Modals, Popovers), use a shadow with a 40px–60px blur at 6% opacity, tinted with `on_surface` (#131b2e). It should feel like a soft glow, not a dark drop-shadow.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` at **15% opacity**. High-contrast borders are strictly prohibited.

---

## 5. Components

### Buttons & Actions
*   **Primary:** The Blue-to-Purple gradient. Corner radius: `md` (1.5rem). 
*   **Secondary:** `surface_container_high` background with `primary` text. No border.
*   **Ghost:** Transparent background, `primary` text. For low-priority navigation.

### Input Fields
*   **Styling:** Use `surface_container_low` as the background. On focus, transition to `surface_container_lowest` with a 1px "Ghost Border" of `primary` at 30% opacity. 
*   **Corners:** `DEFAULT` (1rem).

### Learning Cards & Progress Lists
*   **Rule:** Forbid divider lines.
*   **Implementation:** Separate list items using `Spacing 4` (1.4rem) of vertical whitespace. Use a subtle background shift (`surface_container_low`) on hover to indicate interactivity.
*   **Progress Indicators:** Use the `secondary` (#6b38d4) token for progress bars to differentiate "learning state" from "system actions."

### Artificial Intelligence Micro-Interactions
*   **The AI Pulse:** When the platform is "thinking," use a subtle `surface_tint` (#494bd6) glow animation (opacity 0.1 to 0.3) behind the container.
*   **Sparkle Accents:** Use `tertiary` (#614283) for AI-generated insights or "magic" features.

---

## 6. Do’s and Don'ts

### Do
*   **Do** prioritize whitespace over content density. If a screen feels "full," increase the spacing scale.
*   **Do** use `xl` (3rem) or `full` (9999px) rounded corners for pills and decorative elements to soften the AI's technical edge.
*   **Do** use `on_surface_variant` for secondary text to maintain a soft visual hierarchy.

### Don't
*   **Don't** use pure black (#000000). Use `on_background` (#131b2e) for the darkest text.
*   **Don't** use 1px dividers to separate content blocks. Use background color steps (`surface` → `surface_container_low`).
*   **Don't** use standard 4px or 8px corners. Anything under 16px (`DEFAULT`) will feel dated in this system.