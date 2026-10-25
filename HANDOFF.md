# TOEFL Exam App — Handoff Memory

Read this first in a new conversation, then reply "ready" and wait for the user to say "continue".

## Project
Modern, responsive, professional TOEFL exam web app in **Next.js** (version has breaking changes; read `node_modules/next/dist/docs/` before writing code, see AGENTS.md). Front-end only with **dummy data** for now. Final target: run inside Safe Exam Browser. Two roles: **admin** and **user (examinee)**. Must be secure for testing. Build in **phases; user approves each phase**. Ask the user if anything is unclear.

Rules: Vanilla CSS (CSS modules + `src/app/globals.css`), no Tailwind. Premium look: dark/glass, gradients, micro-animations, Google fonts. Unique ids on interactive elements. SEO titles/meta. Keep replies concise. Ponytail mode (smallest complete change) was requested.

## Done
- **Phase 1–2**: Landing, login (`/login`, `/login/admin`, demo-credential fill button), user dashboard (`/dashboard`, `/dashboard/exams`), exam flow, AppShell + Sidebar components.
- **Phase 3 (admin)**, all built and `next build` passed with 0 errors:
  - `/admin` dashboard (`AdminDashboardContent.tsx`, real data from `src/lib/adminData.ts`, quick actions link to real pages)
  - `/admin/exams` (filterable table, create/edit/delete modals)
  - `/admin/questions` (accordion question bank, edit/add modal)
  - `/admin/users` (stats, filters, profile modal with history)
  - `/admin/results` (`AdminResultsContent.tsx`, `adminResults.module.css`: KPI cards, score distribution chart, per-exam bars, results table)
- Data: `src/lib/examData.ts` (EXAMS), `src/lib/adminData.ts` (EXAM_RESULTS, ADMIN_USERS, getAnalytics, getScoreDistribution).
- Global CSS already has badges (`badge-success/brand/danger/neutral`) and buttons (`btn-danger`, `btn-lg`).
- Demo admin login: `admin@toeflexam.edu` / `Admin@1234`.

## Known notes
- Dev server warns that Google Font Inter can't download when offline; falls back to a default font. Optional fix: `next/font/local`.
- Browser automation previously hit a CDP timeout; UI was verified only by build and server logs (all routes returned 200).
- Project folder was renamed/moved: `toeflexam_app` -> `testtoefl_app`. Verify source files actually exist (`src/`, `package.json`).

## Next: Phase 4 (awaiting user "continue")
User-side **Results & Analytics**: personal score history, progress chart over time, per-section breakdown (Reading/Listening/Speaking/Writing), result detail view, reachable from the dashboard sidebar. Reuse existing data helpers and CSS. Later phases: security hardening for Safe Exam Browser (fullscreen/tab-leave detection, copy-paste block, session handling), polish.
