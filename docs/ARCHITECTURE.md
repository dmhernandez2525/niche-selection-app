# Niche Selection App - Architecture

**Version:** 1.0.0
**Last Updated:** January 2026

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │   React     │  │  TanStack    │  │    Tailwind +       │ │
│  │   Router    │  │    Query     │  │    shadcn/ui        │ │
│  └──────┬──────┘  └──────┬───────┘  └─────────────────────┘ │
│         │                │                                   │
│         └────────────────┼───────────────────────────────────┤
│                          │                                   │
│                    HTTP/REST API                             │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                        SERVER                                │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │   Express   │  │   Services   │  │   External APIs     │ │
│  │   Routes    │  │   Layer      │  │   (Google, YT)      │ │
│  └──────┬──────┘  └──────┬───────┘  └─────────────────────┘ │
│         │                │                                   │
│         └────────┬───────┘                                   │
│                  │                                           │
│           ┌──────┴──────┐                                    │
│           │   Prisma    │                                    │
│           │    ORM      │                                    │
│           └──────┬──────┘                                    │
└──────────────────┼───────────────────────────────────────────┘
                   │
            ┌──────┴──────┐
            │  PostgreSQL │
            │  (SQLite)   │
            └─────────────┘
```

---

## Directory Structure

```
niche-selection-app/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── lib/            # Utilities
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   └── test/           # Test utilities
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── docs/                   # Documentation
├── .github/                # CI/CD workflows
├── render.yaml             # Deployment config
└── package.json            # Root monorepo config
```

---

## Frontend Architecture

### Component Structure

```
src/components/
├── ui/                     # shadcn/ui primitives
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── layout/                 # Layout components
│   ├── AppLayout.tsx
│   └── Sidebar.tsx
└── features/               # Feature-specific components
    └── niche-finder/
        ├── NicheFinder.tsx
        └── NicheResults.tsx
```

### State Management

- **Server State:** TanStack Query for API data
- **Client State:** React useState/useReducer for local UI state

### Data Flow

```
User Action → Component → TanStack Query → API Service → Server
                                    ↓
                              Cache Update
                                    ↓
                              UI Re-render
```

---

## Backend Architecture

### Layer Separation

1. **Routes Layer** (`routes/`)
   - HTTP endpoint definitions
   - Request validation
   - Response formatting

2. **Controller Layer** (`controllers/`)
   - Request handling
   - Input validation
   - Service orchestration

3. **Service Layer** (`services/`)
   - Business logic
   - External API integration
   - Database operations

4. **Data Layer** (Prisma)
   - Database schema
   - Migrations
   - Query building

### API Design

```
GET    /api/health              # Health check
GET    /api/niches              # List niches
POST   /api/niches/analyze      # Analyze niche
GET    /api/keywords/:niche     # Get keywords
POST   /api/competition         # Competition analysis
```

---

## External Integrations

| Service | Purpose | Rate Limits |
|---------|---------|-------------|
| Google Trends | Trend data | 1 req/sec |
| YouTube Data API | Video/channel stats | 10,000 units/day |

---

## Security Considerations

1. **API Keys:** Stored in environment variables
2. **CORS:** Configured for specific origins
3. **Helmet:** Security headers enabled
4. **Rate Limiting:** Implement for production

---

## Performance Patterns

1. **Frontend:**
   - Code splitting with React.lazy
   - Query caching with TanStack Query
   - Optimistic updates

2. **Backend:**
   - Response caching
   - Connection pooling (Prisma)
   - Efficient database queries

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│              Render.com                  │
├─────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────────┐ │
│  │   Client    │    │     Server      │ │
│  │  (Static)   │←──→│   (Web Svc)     │ │
│  └─────────────┘    └────────┬────────┘ │
│                              │          │
│                     ┌────────┴────────┐ │
│                     │   PostgreSQL    │ │
│                     │   (Database)    │ │
│                     └─────────────────┘ │
└─────────────────────────────────────────┘
```
