# Niche Selection App

An intelligent niche research platform that helps content creators identify profitable niches for YouTube, TikTok, and other social media platforms using data-driven analysis.

---

## Overview

| Feature | Description |
|---------|-------------|
| **Trend Analysis** | Integrates with Google Trends to identify rising topics |
| **Competition Analysis** | Evaluates market saturation and competitor strength |
| **Profitability Scoring** | Calculates potential revenue based on CPM and volume |
| **Keyword Research** | Suggests related keywords with search volume data |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | Prisma ORM, SQLite (dev) / PostgreSQL (prod) |
| **Data Fetching** | TanStack Query |
| **Testing** | Vitest, Testing Library, MSW |
| **Deployment** | Render.com |

---

## Project Structure

```
niche-selection-app/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── lib/            # Utilities
│   │   ├── hooks/          # Custom React hooks
│   │   └── test/           # Test utilities & mocks
│   ├── vitest.config.ts
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   └── types/          # TypeScript types
│   ├── prisma/             # Database schema
│   └── package.json
├── docs/                   # Documentation
│   ├── INDEX.md            # Documentation hub
│   ├── ARCHITECTURE.md     # System design
│   ├── CODING_STANDARDS.md # Coding patterns
│   ├── ROADMAP.md          # Feature backlog
│   ├── checklists/         # Quality checklists
│   └── sdd/                # Feature design docs
├── .github/workflows/      # CI/CD pipelines
├── render.yaml             # Deployment config
└── package.json            # Monorepo config
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/niche-selection-app.git
cd niche-selection-app

# Install dependencies
npm install
cd client && npm install
cd ../server && npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run database migrations (if using Prisma)
cd server && npx prisma migrate dev

# Start development servers
cd .. && npm run dev:server  # Terminal 1
npm run dev:client           # Terminal 2
```

### Running Tests

```bash
# Run all client tests
cd client
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

---

## Development

### Available Scripts

**Client:**
```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript check
npm run test        # Run tests
npm run test:coverage  # Run tests with coverage
```

**Server:**
```bash
npm run dev         # Start with hot reload
npm run start       # Start production server
npm run build       # Compile TypeScript
```

---

## Deployment

### Render.com (Recommended)

1. Fork this repository
2. Create a new Blueprint on Render
3. Connect your repository
4. Render will auto-deploy using `render.yaml`

### Manual Deployment

```bash
# Build client
cd client && npm run build

# Start server
cd ../server && npm start
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/niches/analyze` | Analyze a niche |
| GET | `/api/keywords/:niche` | Get keyword suggestions |
| POST | `/api/competition` | Analyze competition |

---

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Coding Standards](./docs/CODING_STANDARDS.md)
- [Roadmap](./docs/ROADMAP.md)
- [Pre-Commit Checklist](./docs/checklists/PRE_COMMIT_CHECKLIST.md)

---

## Vision

This application is part of a larger automated content generation system designed to:

1. **Research Niches** - Identify profitable content opportunities
2. **Analyze Competition** - Evaluate market saturation
3. **Generate Content** - Create AI-powered video scripts
4. **Distribute Content** - Post across multiple platforms
5. **Optimize Revenue** - Continuously improve based on performance

The system uses a feedback loop to monitor revenue and automatically scale successful content streams.

---

## Contributing

1. Read [Coding Standards](./docs/CODING_STANDARDS.md)
2. Create a feature branch
3. Complete [Pre-Commit Checklist](./docs/checklists/PRE_COMMIT_CHECKLIST.md)
4. Submit a pull request

---

## License

MIT

---

## Author

**Daniel Hernandez** - Senior Full-Stack Engineer

[LinkedIn](https://www.linkedin.com/in/dh25/)
