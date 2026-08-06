# Cleanup Report — Phase 0 (Design System Overhaul)

Date: 2026-07-31

## Pages deleted (Category C — template residue, no API wiring, fake data)

| Page | Route removed | Reason |
|---|---|---|
| `src/domains/admin/pages/AdminCustomersPage.tsx` | `/admin/customers` | Fake CRM with hardcoded customers, unsplash avatars |
| `src/domains/admin/pages/AdminSitesPage.tsx` | `/admin/sites` | Tesla / L-Charge EV-charging demo data |
| `src/domains/admin/pages/AdminDomainSubscriptionsPage.tsx` | `/admin/subscriptions` | Hardcoded mock subscriptions, no API |
| `src/domains/admin/pages/AdminSharePage.tsx` | `/admin/share-modal` | Modal demo page, not a product feature |

## Dead components deleted

- `src/shared/components/common/ShareDocumentModal.tsx` — only consumer was AdminSharePage
- `src/shared/components/layout/side-bar.tsx` — legacy sidebar, exported from barrels but imported by no page
- `src/shared/components/layout/admin/sidebar/nav-items.ts` — typed nav config imported nowhere; referenced nonexistent routes (`/admin/analytics/*`, `/admin/coupons`, `/admin/media`, …)

## Dead directories deleted

- `src/features/` — legacy tree, excluded from `tsconfig.json`, duplicated `src/domains/` content.
  **Partial**: 7 files remain locked by another process (`admin/api/{hooks,service}.ts`, `self-study-practice/*`, `writing/stores/use-writing-store.ts`). Harmless (tsconfig-excluded); delete once file locks are released.

## Dependencies removed

- `@e-english/ielts-ai` — broken workspace symlink to nonexistent `packages/ielts-ai`; zero imports in `src/`.

## Files edited

- `src/routes/routeConfig.tsx` — removed 4 route entries + 4 imports
- `src/domains/admin/index.ts` — removed 4 barrel exports
- `src/shared/components/index.ts` — removed `AppSidebar` export
- `src/shared/components/layout/index.ts` — removed `SideBar` export
- `src/shared/components/layout/admin-side-nav.tsx` — removed 4 dead nav links (Customers CRM, Sites Monitoring, Subscriptions, Share Modal)

## Category B pages (kept, pending ComingSoon replacement in Phase B)

`/admin/delivery-tracker`, `/admin/signer-flow`, `/admin/bio-pages`, `/admin/qr-generator`, `/admin/call-history`

## Verification

- `npm run build` (tsc + vite) — green after cleanup
- Grep: zero remaining references to deleted pages/routes/components
