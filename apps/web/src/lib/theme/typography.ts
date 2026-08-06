/**
 * Typography Configuration for Design System font evaluation.
 *
 * NOTE: This is a Vite React application. In a Next.js environment, we would use:
 *
 * import { GeistSans } from "geist/font/sans";
 * import { GeistMono } from "geist/font/mono";
 * import { Plus_Jakarta_Sans } from "next/font/google";
 *
 * Since this is Vite, the fonts are preloaded via Google Fonts links in `index.html`
 * for optimal loading and layout, and we swap them by setting the corresponding body class.
 */

// Primary production candidate.
// Excellent readability for SaaS dashboards.
// Used by Vercel ecosystem.
// const geistSansClass = "font-geist-sans";

// Primary monospace candidate.
// Used for logs, code, UUIDs, keys, and terminals.
// const geistMonoClass = "font-geist-mono";

// Alternative candidate.
// Softer appearance.
// Great for premium dashboard UI.
// Enable later for comparison.
// Initial testing only.
// const plusJakartaClass = "font-plus-jakarta";

export const Typography = {
//   // Toggle this variable to switch the active font instantly
//   // Uncomment to evaluate the alternative font candidate
//   activeFontClass: geistSansClass,
//   // activeFontClass: plusJakartaClass,

//   monoClass: geistMonoClass,
}
