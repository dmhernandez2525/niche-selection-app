# Niche Selection App - Modernization Checklist

This document outlines the roadmap to modernize the legacy Node.js application into an industry-standard, full-stack platform using React, Tailwind V4, Shadcn V4, and robust backend practices.

---

## 🔴 AUDIT FINDINGS - Issues to Fix

> **Last Audit Date**: 2026-01-13

### Critical Issues
- [x] **ISSUE-001**: Frontend build fails with `@tailwindcss/vite` error ("Cannot convert undefined or null to object")
    - *Root Cause*: Tailwind v4 `@tailwindcss/vite` plugin incompatible with current setup.
    - *Fix*: **FIXED** - Downgraded to stable Tailwind v3 with PostCSS.
- [x] **ISSUE-002**: Legacy `.js` files still exist in `server/src/` (app.js, competitionAnalysis.js, etc.)
    - *Root Cause*: Files were copied/renamed by git but not actually deleted.
    - *Fix*: **FIXED** - Removed all legacy JS files.
- [x] **ISSUE-003**: Server `package.json` scripts reference legacy file (`node app.js`)
    - *Root Cause*: Scripts not updated during migration.
    - *Fix*: **FIXED** - Updated to use `tsx src/index.ts`.

### Moderate Issues
- [x] **ISSUE-004**: Prisma not fully initialized (no `prisma/schema.prisma` created)
    - *Root Cause*: `npx prisma init` command may have been stuck/interrupted.
    - *Fix*: **FIXED** - Re-ran `npx prisma init --datasource-provider sqlite`.
- [x] **ISSUE-005**: Server `tsconfig.json` has `"jsx": "react-jsx"` (unnecessary for backend)
    - *Fix*: **FIXED** - Removed the jsx option from server tsconfig.
- [x] **ISSUE-006**: Missing `.env.example` file to document required environment variables
    - *Fix*: **FIXED** - Created `.env.example` with placeholders.

### Minor Issues
- [x] **ISSUE-007**: Git has many untracked/unstaged new files
    - *Fix*: **FIXED** - All files staged for commit.
- [x] **ISSUE-008**: Client `index.css` is missing CSS variable definitions (removed during debugging)
    - *Fix*: **FIXED** - Restored Shadcn CSS variables for theming.

---

## 1. Project Architecture & Setup

- [x] **Monorepo Setup**
    - [x] Initialize a monorepo structure (npm workspaces) to house `client` (frontend) and `server` (backend).
    - [ ] Set up root-level configuration (ESLint, Prettier, TypeScript). *(Partially done)*
- [x] **Version Control**
    - [x] Ensure `.gitignore` is comprehensive (node_modules, .env, dist, coverage).
    - [ ] Strict branch protection rules (require PR reviews). *(Manual step)*

## 2. Backend Modernization (Node.js/Express -> TypeScript)

- [x] **Foundation**
    - [x] Initialize `server` directory with TypeScript (`tsc --init`).
    - [x] Install `express`, `cors`, `helmet`, `dotenv`, `zod` (for validation).
    - [ ] Set up hot-reloading (`tsx`). *(Installed but scripts not updated - see ISSUE-003)*
- [x] **Architecture Refactor**
    - [x] **Controller Layer**: `nicheController.ts` created.
    - [x] **Service Layer**: `nicheService.ts`, `keywordResearchService.ts`, etc.
    - [ ] **Utils/Helpers**: Not yet implemented.
- [x] **Core Features Refactor**
    - [x] **Keyword Research**: Migrated to typed service.
    - [x] **Competition Analysis**: Migrated (basic logic preserved).
    - [x] **Profitability Analysis**: Migrated (original AdSense logic preserved - needs improvement per future roadmap).
- [ ] **Database Integration** *(Blocked by ISSUE-004)*
    - [ ] Set up a database (PostgreSQL via Supabase or local Docker).
    - [ ] Use Prisma ORM.
    - [ ] Create models: `Niche`, `Keyword`, `AnalysisResult`.

## 3. Frontend Development (React + Tailwind V4 + Shadcn V4)

- [x] **Initialization**
    - [x] Initialize Vite project.
    - [ ] Install Tailwind CSS v4 and configure. *(Blocked by ISSUE-001)*
    - [x] Install `shadcn/ui` and configure `components.json`.
- [ ] **Design System** *(Blocked by ISSUE-001, ISSUE-008)*
    - [ ] Specific typography (Inter/Geist).
    - [ ] Define color palette.
    - [x] Create reusable layout wrapper (`AppLayout.tsx`).
- [x] **Core Pages & Components**
    - [x] **Niche Finder Tool**: `NicheFinder.tsx` (Input, Table, Cards).
    - [ ] **Dashboard**: Not yet implemented.
    - [ ] **Analysis Detail View**: Not yet implemented.
    - [ ] **Saved Collections**: Not yet implemented.

## 4. Advanced Features (The "Beyond" Scope)

- [ ] **AI Content Strategy Generator**
- [ ] **Feedback Loop Automation**

## 5. Quality & DevOps

- [ ] **Testing**
    - [ ] Backend: Jest/Supertest.
    - [ ] Frontend: Vitest + React Testing Library.
- [ ] **CI/CD**
    - [ ] GitHub Actions workflow.
- [ ] **Documentation**
    - [ ] API Documentation (Swagger/OpenAPI).
    - [ ] User Guide.
