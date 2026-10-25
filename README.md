# TOEFL Exam App

A modern, responsive TOEFL practice-exam web app built with **Next.js 16**, **React 19** and **TypeScript**. Styling is plain CSS (CSS Modules plus `src/app/globals.css`), with a dark/light theme.

> **Status: in development.** Front-end only with dummy data. There is no backend or database yet. Authentication is simulated in the browser. The final target is to run inside [Safe Exam Browser](https://safeexambrowser.org/).

## Features

**Examinee**
- Login, dashboard, and exam list
- Exam engine with timer and session persistence
- Exam result screen
- **My Results**: history, score progress chart, per-section breakdown, and a detailed score report per attempt
- Profile page

**Admin**
- Dashboard with quick actions
- Exam management (create, edit, delete)
- Question bank
- User management with profile and history
- Results and analytics (KPIs, score distribution, per-exam bars)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Use the demo-credential button on the login pages. The admin demo account is `admin@toeflexam.edu` / `Admin@1234`.

## Project structure

```
src/
├── app/          # Routes: /, /login/{user,admin}, /dashboard/*, /admin/*, /exam/[id]
├── components/   # AppShell, Sidebar, Topbar, ThemeToggle, Exam (engine, timer, start screen)
├── context/      # AuthContext, ThemeContext
└── lib/          # auth, examData, adminData, examSession (dummy data and helpers)
```

## Roadmap

- [x] Phase 1–2: landing, login, user dashboard, exam flow
- [x] Phase 3: admin panel
- [x] Phase 4: user results and analytics
- [ ] Phase 5: Safe Exam Browser hardening (fullscreen and tab-leave detection, copy-paste blocking, session handling)
- [ ] Real backend, database and authentication
- [ ] Listening, Speaking and Writing sections (only Reading is simulated)

## Notes

- Next.js 16 has breaking changes versus older versions. See `AGENTS.md` and `node_modules/next/dist/docs/` before changing framework-level code.
- All credentials and data are for demonstration only. Do not use real passwords.
