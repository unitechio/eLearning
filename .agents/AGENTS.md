# Project Rules — eEnglish Web App

## Semantic HTML (ENFORCED)

> Tuyệt đối KHÔNG dùng `<div>` vô nghĩa làm wrapper bố cục. Mọi element phải có ngữ nghĩa rõ ràng.

### Element mapping

| Mục đích          | Element đúng                                               |
|-------------------|------------------------------------------------------------|
| Layout page wrap  | `<main>`, `<section>`, `<article>`                         |
| Navigation        | `<nav aria-label="...">` + `<ul><li>` hoặc `<NavLink>`    |
| Sidebar           | `<aside aria-label="...">`                                 |
| Top bar           | `<header aria-label="...">`                                |
| Bottom bar        | `<footer>`                                                 |
| Icon-only logo    | `<figure aria-hidden="true">`                              |
| Grouping in nav   | `<section>` bên trong sidebar                              |
| Action button     | `<button type="button">` hoặc `<button type="submit">`     |
| Navigation link   | `<a>` hoặc `<Link>` / `<NavLink>` (react-router)          |
| Form label wrap   | `<label htmlFor="...">` thay cho icon + input wrapper div  |
| Divider           | `<hr aria-hidden="true">` hoặc `<li aria-hidden="true">`   |
| Badge / count     | `<span>` với `aria-label` hoặc `<span aria-hidden="true">` |
| Avatar / logo img | `<OptimizedImage alt="...">` với alt mô tả đầy đủ          |
| Screen reader     | `<span className="sr-only">` khi cần text ẩn              |

### Rules

- **Không** dùng `<div>` làm nav group — dùng `<section>` hoặc `<ul><li>`
- **Không** dùng `<div>` làm header/footer của card — dùng `<header>` / `<footer>` trong context thích hợp
- Mọi `<button>` icon-only phải có `aria-label`
- Mọi `<nav>` phải có `aria-label` mô tả vùng navigation
- `<input>` phải gắn với `<label>` (dùng `htmlFor` hoặc wrap)

---

## Styling (Tailwind)

- **Chỉ dùng Tailwind CSS** — không dùng inline `style={{}}`
- Dark mode: toggle class `.dark` trên `<html>`, dùng `dark:` variant
- Theme được persist qua `localStorage` bằng hook `useTheme` (`src/shared/hooks/useTheme.ts`)
- Màu sắc: dùng color token từ `tailwind.config.ts` (ví dụ `text-slate-400`, `bg-slate-950`)
  - Admin UI: `bg-slate-950` (sidebar), `bg-slate-900` (main dark bg)
  - Accent: `red-500`/`red-600` cho active states, hover, alerts
- Không dùng TailwindCSS arbitrary values khi đã có token (`text-[10px]` → ok cho micro text)

---

## Responsive Design

- **Mobile-first**: default styles cho mobile, `sm:`, `md:`, `lg:` cho larger screens
- Sidebar pattern:
  - Desktop (`lg:`): fixed, collapsible (toggle width `w-60` ↔ `w-[68px]`)
  - Mobile: overlay (hidden via `-translate-x-full`, show via `translate-x-0` khi `mobileOpen`)
  - Backdrop: `<button>` overlay trên mobile khi sidebar mở
- Main content offset: `lg:ml-60` (expanded) hoặc `lg:ml-[68px]` (collapsed)
- Header: search bar ẩn trên mobile (`hidden md:flex`), chỉ hiện icon search

---

## Component Architecture

- **Layout components** nằm ở `src/shared/components/layout/`
- **Admin layout**: `AdminLayout.tsx` quản lý state `sidebarCollapsed` + `mobileSidebarOpen`, truyền xuống `AdminSideNav` và `AdminHeader`
- **Dark mode hook**: `useTheme` từ `src/shared/hooks/useTheme.ts`
  - Persist: `localStorage` key `eenglish-admin-theme`
  - Apply: toggle class `.dark` trên `document.documentElement`
  - Fallback: OS preference (`prefers-color-scheme`)
- **Export**: mọi component layout mới phải được export từ `src/shared/components/layout/index.ts`

---

## Dropdown / Interactive Patterns

- Dropdown: dùng `useState` + `useEffect` với `mousedown` listener để đóng khi click ngoài
- Dropdown container: `role="menu"`, items dùng `role="menuitem"`
- Avatar trigger: `aria-expanded`, `aria-haspopup="menu"`
- Animation: dùng `animate-in fade-in zoom-in-95` (Tailwind animate plugin) cho smooth appearance
