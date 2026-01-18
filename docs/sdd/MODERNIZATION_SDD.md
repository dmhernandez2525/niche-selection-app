# Software Design Document: niche-selection-app Modernization

**Version:** 1.0.0
**Author:** Daniel Hernandez
**Created:** January 2026
**Status:** Draft - Awaiting Review

---

## 1. Executive Summary

This document outlines the minimal modernization strategy for niche-selection-app. **This project is already modern** and only requires minor upgrades to align with Tailwind v4 and ensure all dependencies are at their latest LTS versions.

### Current State (Already Modern!)
- **Node.js:** Unspecified (should add engines)
- **React:** 19.2.0 ✅ (Latest)
- **Build Tool:** Vite 6.4.1 ✅ (Latest)
- **Styling:** Tailwind CSS 3.4.19 (Upgrade to v4)
- **State Management:** React Query 5.90.16 ✅ (Latest)
- **Routing:** React Router 7.12.0 ✅ (Latest)
- **TypeScript:** 5.9.3 ✅ (Latest)
- **Testing:** Vitest 2.0.0 ✅ (Latest)
- **Backend:** Express 4.22.1, Prisma 7.2.0 ✅ (Latest)

### Target State
- **Styling:** Tailwind CSS v4 + Shadcn
- **Add:** Node.js engine specification (22.x)
- **All Other:** Already at target state

---

## 2. Current Technology Audit

### Backend (server/package.json)

| Package | Current | LTS/Latest | Action | Breaking Changes |
|---------|---------|------------|--------|------------------|
| express | 4.22.1 | 4.22.x | ✅ Current | None |
| @prisma/client | 7.2.0 | 7.x | ✅ Current | None |
| prisma | 7.2.0 | 7.x | ✅ Current | None |
| cors | 2.8.5 | 2.8.5 | ✅ Current | None |
| dotenv | 16.6.1 | 16.x | ✅ Current | None |
| helmet | 8.1.0 | 8.x | ✅ Current | None |
| zod | 4.3.5 | 4.x | ✅ Current | None |
| googleapis | 118.0.0 | 118.x | ✅ Current | None |
| typescript | 5.9.3 | 5.9.x | ✅ Current | None |

### Frontend (client/package.json)

| Package | Current | LTS/Latest | Action | Breaking Changes |
|---------|---------|------------|--------|------------------|
| react | 19.2.0 | 19.x | ✅ Current | None |
| react-dom | 19.2.0 | 19.x | ✅ Current | None |
| react-router-dom | 7.12.0 | 7.x | ✅ Current | None |
| @tanstack/react-query | 5.90.16 | 5.x | ✅ Current | None |
| vite | 6.4.1 | 6.x | ✅ Current | None |
| vitest | 2.0.0 | 2.x | ✅ Current | None |
| typescript | 5.9.3 | 5.9.x | ✅ Current | None |
| tailwindcss | 3.4.19 | **4.x** | **Upgrade** | Major - config changes |
| tailwindcss-animate | 1.0.7 | Check v4 compat | Review | May need update |
| tailwind-merge | 3.4.0 | 3.x | ✅ Current | None |

### Dependencies to Add

| Package | Version | Purpose |
|---------|---------|---------|
| @shadcn/ui | latest | Component library |

---

## 3. Migration Strategy

### Phase 1: Tailwind v4 Upgrade (PR #1)
**Scope:** Upgrade Tailwind CSS from 3.4 to 4.x
**Breaking Changes:** Configuration format, some utility classes

#### Steps:
1. Install Tailwind CSS v4
2. Update `tailwind.config.ts` to new format
3. Review and update utility class usage
4. Check `tailwindcss-animate` compatibility
5. Update PostCSS configuration if needed

#### Tailwind v4 Configuration Changes:
```typescript
// Tailwind v3 config
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

// Tailwind v4 uses CSS-based configuration
// @import "tailwindcss";
// @theme { ... }
```

#### Key Tailwind v4 Changes:
- CSS-first configuration
- Native cascade layers
- New color palette format
- Some utility renames

---

### Phase 2: Shadcn Integration (PR #2)
**Scope:** Add Shadcn component library
**Breaking Changes:** None - additive only

#### Steps:
1. Initialize Shadcn: `npx shadcn@latest init`
2. Configure components path
3. Add base components as needed
4. Update existing components to use Shadcn where beneficial

#### Shadcn Setup:
```bash
npx shadcn@latest init

# Add components as needed
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

---

### Phase 3: Engine Specification (PR #3)
**Scope:** Add Node.js engine specification
**Breaking Changes:** None

#### Steps:
1. Add `engines` field to both package.json files
2. Add `.nvmrc` or `.node-version` file
3. Update CI workflows to use specified Node version

#### Package.json Update:
```json
{
  "engines": {
    "node": ">=22.0.0"
  }
}
```

---

## 4. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Tailwind v4 utility changes | Low | Medium | Review migration guide |
| tailwindcss-animate incompatibility | Low | Low | Check compatibility, update if needed |
| Shadcn style conflicts | Low | Low | Gradual adoption |

---

## 5. Dependencies & Prerequisites

### Development Environment
- Node.js 22.x LTS (already in use)
- pnpm or npm 10.x

### External Dependencies
- None additional required

---

## 6. Success Criteria

- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Tailwind v4 fully functional
- [ ] Shadcn components working
- [ ] All features functional
- [ ] No visual regressions

---

## 7. Rollback Plan

Each PR can be reverted independently. Given the minimal changes required, rollback is straightforward.

---

## 8. Timeline Estimate

| Phase | Estimated Effort |
|-------|------------------|
| Phase 1: Tailwind v4 | 2-4 hours |
| Phase 2: Shadcn | 2-3 hours |
| Phase 3: Engine Spec | 0.5 hours |
| **Total** | **4.5-7.5 hours** |

---

## 9. Open Questions for Review

1. **Tailwind v4:** Wait for stable release or use current beta?
2. **Shadcn Components:** Which components to add initially?
3. **tailwindcss-animate:** Keep or replace with Tailwind v4 native animations?

---

## 10. Notes

This project is in excellent shape and serves as a reference implementation for the other legacy projects. The architecture and tooling choices (Vite, React Query, TypeScript, Vitest) are exactly what the other projects should migrate to.
