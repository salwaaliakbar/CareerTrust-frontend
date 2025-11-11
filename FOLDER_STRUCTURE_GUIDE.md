# 📁 Folder Structure Guide

## 🔄 Data Flow

```
┌─────────────────┐
│   Component     │  React UI (components/)
│   JobsList.tsx  │
└────────┬────────┘
         │ uses
┌────────▼────────┐
│   Custom Hook   │  State logic (hooks/)
│   useJobs.ts    │
└────────┬────────┘
         │ calls
┌────────▼────────┐
│  API Service    │  Frontend (services/api/)
│  jobs.service   │  fetch('/api/jobs')
└────────┬────────┘
         │ HTTP
┌────────▼────────┐
│   API Route     │  Backend (app/api/jobs/route.ts)
│   GET /api/jobs │  Validates request
└────────┬────────┘
         │ calls
┌────────▼────────┐
│  DB Service     │  Database layer (services/database/)
│  jobs.db.ts     │  SQL queries
└────────┬────────┘
         │ queries
┌────────▼────────┐
│   PostgreSQL    │  Database
└─────────────────┘
```

---

## 📂 Folder Structure

```
CareerTrust/
│
├── app/                          # Next.js routes
│   ├── (auth)/                   # Auth pages: /login, /signup
│   ├── (public)/                 # Public pages: /jobs, /companies
│   └── api/                      # Backend API endpoints/Main Controllers
│       ├── auth/login/           # POST /api/auth/login
│       ├── jobs/[id]/            # GET/PUT/DELETE /api/jobs/:id
│       └── ...
│
├── components/                   # React components
│   ├── jobs/                     # Job components
│   ├── ui/                       # Reusable UI (buttons, inputs)
│   └── shared/                   # Shared components
│
├── services/
│   ├── api/                      # Frontend: fetch calls
│   │   └── jobs.service.ts       # fetchJobs(), createJob()
│   └── database/                 # Backend: DB queries
│       └── jobs.db.ts            # getJobs(), insertJob()
│
├── lib/
│   ├── db/                       # Database client & config
│   └── validations/              # Input validation schemas
│
├── types/                        # TypeScript types
│   └── job.types.ts              # Job, User, Company types
│
├── hooks/                        # Custom React hooks
│   └── useJobs.ts                # useAuth(), useJobs()
│
├── utils/                        # Helper functions
│   └── date.utils.ts             # formatDate(), etc.
│
├── middleware/                   # Request middleware
│   └── auth.middleware.ts        # Authentication checks
│
├── constants/                    # App constants
│   └── routes.ts                 # API_ENDPOINTS, ROUTES
│
├── config/                       # Configuration files
│   └── database.config.ts
│
├── database/                     # PostgreSQL files
│   ├── migrations/               # 001_schema.sql
│   ├── seeds/                    # dev_data.sql
│   └── schema.sql                # Full DB schema
│
└── tests/                        # Test files
    ├── unit/
    └── integration/
```

---

## � Quick Reference

| Folder               | Purpose               | Example File        |
| -------------------- | --------------------- | ------------------- |
| `app/api/`           | Backend API endpoints | `route.ts`          |
| `components/`        | React UI components   | `JobCard.tsx`       |
| `services/api/`      | Frontend API calls    | `jobs.service.ts`   |
| `services/database/` | Backend DB queries    | `jobs.db.ts`        |
| `types/`             | TypeScript types      | `job.types.ts`      |
| `hooks/`             | Custom React hooks    | `useJobs.ts`        |
| `lib/db/`            | Database config       | `client.ts`         |
| `lib/validations/`   | Input validation      | `job.validation.ts` |
| `database/`          | SQL files             | `schema.sql`        |

---

## 🎯 Key Principles

- **Frontend** (`components/`, `hooks/`, `services/api/`) → UI & API calls
- **Backend** (`app/api/`, `services/database/`) → API routes & DB queries
- **Types** (`types/`) → Shared across frontend & backend
- **Never** access database directly from frontend
