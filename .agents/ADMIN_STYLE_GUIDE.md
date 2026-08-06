# eEnglish Admin Design System & Product Specification

This document specifies the global design language, layout shells, typography scales, component rules, and interaction patterns for the eEnglish B2B SaaS Admin Panel. It serves as the reference guide for all development and design decisions.

---

## 1. Product Tone & Philosophy

- **Tone**: Clean, calm, dense, minimal, professional, premium, enterprise-focused.
- **Rules**:
  - **No playfulness**: The interface must remain serious, functional, and clean.
  - **Minimal gradients**: Avoid decorative gradients. Use flat, solid colors or minimal background changes.
  - **Subtle borders**: Do not decorate with excessive lines. Let whitespace define sections.
  - **Workflow first**: Prioritize high scanning density and minimal cognitive load over cosmetic elements. Optimize every screen for fast administrative action.

---

## 2. Global Styling & Design Tokens

- **Fonts**: Use **Inter** exclusively.
- **Base Background**: `#F8FAFC` (Tailwind `slate-50`) in light mode; `#0F172A` (Tailwind `slate-900`) in dark mode.
- **Cards & Sheets Background**: White (`#FFFFFF`) in light mode; `#1E293B` (Tailwind `slate-800`) or `#0F172A` (Tailwind `slate-950`) in dark mode.
- **Accent Palette**:
  - **Brand / Accent**: Blue (`#2563EB` / Tailwind `blue-600`)
  - **Success**: Emerald (`#10B981` / Tailwind `emerald-500`)
  - **Warning**: Amber (`#F59E0B` / Tailwind `amber-500`)
  - **Error / Destructive**: Rose (`#F43F5E` / Tailwind `rose-500`)

---

## 3. Typography Hierarchy

All typography sizes must follow the official scale:

| Element | Font Size | Font Weight | Tailwind Equiv | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Page Title** | 36px | 700 | `text-4xl font-bold` | Exactly one per page. |
| **Section Title** | 22px | 600 / 700 | `text-2xl font-semibold` | Demarcates major page blocks. |
| **Card Title** | 18px | 600 | `text-lg font-semibold` | Used for sub-widgets and card headers. |
| **Label** | 13px | 600 | `text-xs font-semibold` | Form field labels, aligned above inputs. |
| **Body** | 14px | 450 | `text-sm font-normal` | Table cells, descriptive texts, list items. |
| **Helper** | 13px | 400 | `text-xs font-normal` | Supporting form descriptions, empty states. |

---

## 4. Grid, Spacing & Layout Structure

To ensure comfortable density and visual alignment:
- **Maximum Width**: `1600px` for the main layout container.
- **Horizontal Page Padding**: `32px` (`px-8`).
- **Vertical Section Spacing**: `32px` (`py-8` / `space-y-8`).
- **Card Spacing**: `24px` (`gap-6`).
- **Card Inner Padding**: `24px` (`p-6`).

### The Global Page Shell
Every administrative page must render inside a single page template with the following layout hierarchy:
1. **Top Header**: Search bar, command palette trigger, user menu, notifications.
2. **Breadcrumbs**: Unified hierarchy tracker (e.g., `Admin / Billing / Invoices`).
3. **Page Header**: Page title, clear description, and top-right Primary Action button.
4. **KPI Metric Row**: 3 to 5 key-performance cards demonstrating trends (e.g. Outstanding amounts, Active users with +12% delta).
5. **Toolbar**: Unified row with search box (left), filter toggles, action selects, and export options (right).
6. **Main Content**: Split columns (e.g., 70% primary grid, 30% side panel) or unified responsive table.
7. **Secondary Panels**: Optional context panels, detail sheets, or side editors.
8. **Footer Pagination**: Bottom row for table counts and page navigation.

---

## 5. UI Elements Specs

### Cards (`<AdminCard>`)
- **Radius**: `16px` (`rounded-2xl`).
- **Border**: `1px solid rgba(0, 0, 0, 0.06)` (`border-border/50`).
- **Shadow**: `0 2px 8px rgba(15, 23, 42, 0.04)` (`shadow-sm`).
- **Hover Transition**: Translate upward on hover (`hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`).
- **Context**: Never render a page containing only one giant card. Always split data logically.

### Buttons
- **Height**: `40px` (`h-10`).
- **Radius**: `10px` (`rounded-lg`).
- **Alignment**: Primary actions always align top-right.
- **Sizing**: Buttons must always use `w-fit` (shrink-to-content) unless viewing on mobile view.
- **Style**: Primary is filled, Secondary is outlined, Danger is reserved for irreversible destructive actions.

### Inputs
- **Height**: `42px` (`h-[42px]`).
- **Radius**: `10px` (`rounded-lg`).
- **Labels**: Placed strictly above inputs. Underneath, place small descriptive help text.
- **States**: Clear border changes on active focus. Include validation feedback (inline red errors).

---

## 6. Table & CRUD UX Rules

Every list or CRUD interface must support the following functions:
- **Global Search**: Highlight keywords dynamically.
- **Filters & Sorting**: Support toggling column views, filtering by status tabs, or changing date ranges.
- **Bulk Action Toolbar**: Displays automatically when rows are selected, showing actions like multi-delete, status toggle, or batch retry.
- **Export Utility**: Top-right action to export current grid views as CSV.
- **Empty States**: Render an illustration, bold headline, supporting explanation, and clear CTA button. Never display a blank white page.
- **Loading Skeleton**: Replace rows with animated shimmers. Avoid central spinning wheels.
- **Error States**: Display warning headers, retry buttons, and help documentation links.

---

## 7. Form Design Guidelines

- **Split Sections**: Never stretch inputs across a single column. Group parameters into distinct sections:
  1. *General Settings*
  2. *Recipients / Target Scope*
  3. *Content Editor / Code Block*
  4. *Delivery Config*
  5. *Advanced Configurations*
  6. *Review & Confirm*
- **Draft & Autosave**: Auto-persist changes in background where appropriate. Highlight draft status clearly.
- **Confirmation**: Always prompt users with a modal dialog before deleting resources or disabling environments.

---

## 8. Principal Designer Scorecard (Pre-ship Check)

Before committing changes to any Admin UI view, evaluate the page across 9 criteria on a scale of 1-10:
1. **Visual Hierarchy**: Do critical action items stand out? Is tertiary data appropriately muted?
2. **Spacing**: Are margins consistent with the 8pt spacing system (e.g. 24px, 32px)?
3. **Balance**: Is content distributed evenly without empty voids or stretched fields?
4. **Typography**: Does it follow the strict Inter sizes? Is there only one H1?
5. **Accessibility**: Are contrast ratios met (WCAG AA)? Are labels bound via `htmlFor`? Are ARIA labels defined?
6. **Enterprise Feel**: Is the tone calm and dense? Does it feel like a professional tool?
7. **Premium Feel**: Does it look as if it was shipped by Vercel, Stripe, or Linear?
8. **Workflow Efficiency**: Can administrators complete their tasks with the minimum number of clicks?
9. **Information Architecture**: Can a user scan and comprehend the page structure within 3 seconds?

> [!CAUTION]
> **Preship Quality Threshold**:
> - If any individual score is **below 9**, redesign the component immediately.
> - Never commit or ship any page that scores below **9.5/10** average.
