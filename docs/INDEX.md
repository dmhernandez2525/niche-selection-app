# Niche Selection App - Documentation Index

**Version:** 1.0.0
**Last Updated:** January 2026

---

## Quick Links

| Document | Description |
|----------|-------------|
| [README](../README.md) | Project overview and setup |
| [Architecture](./ARCHITECTURE.md) | System design and patterns |
| [Coding Standards](./CODING_STANDARDS.md) | Mandatory coding patterns |
| [Roadmap](./ROADMAP.md) | Feature backlog and priorities |

---

## Documentation Structure

```
docs/
├── INDEX.md                    # This file
├── ARCHITECTURE.md             # System architecture
├── CODING_STANDARDS.md         # Coding patterns and rules
├── ROADMAP.md                  # Feature backlog
├── checklists/
│   ├── PRE_COMMIT_CHECKLIST.md
│   ├── PRE_MR_CHECKLIST.md
│   └── CODE_REVIEW_CHECKLIST.md
└── sdd/
    ├── FEATURE_SDD_TEMPLATE.md
    └── [feature-sdds].md
```

---

## For Developers

1. **Before coding:** Read [Coding Standards](./CODING_STANDARDS.md)
2. **Before committing:** Review [Pre-Commit Checklist](./checklists/PRE_COMMIT_CHECKLIST.md)
3. **Before PR:** Review [Pre-MR Checklist](./checklists/PRE_MR_CHECKLIST.md)

---

## Project Overview

Niche Selection App is an automated AI content generation platform that helps creators identify profitable niches for YouTube, TikTok, and other platforms.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express, TypeScript |
| Database | Prisma ORM, SQLite (dev) / PostgreSQL (prod) |
| APIs | Google Trends, YouTube Data API |

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| 📋 | Planned |
| 🟡 | In Progress |
| ✅ | Complete |
| 🔴 | Blocked |
