# CareerTrust — Frontend

CareerTrust is an AI-Powered full-stack recruitment platform connecting job seekers and employers through verified profiles, employment-history-backed reputation signals, and AI-assisted matching. This repository is the **Next.js frontend** — the customer-facing web app for job seekers, employers, and platform admins.

**Live app:** https://career-trust-frontend.vercel.app
**Backend API:** https://careertrust-backend.onrender.com
**Demo video:** [Watch on Google Drive](https://drive.google.com/file/d/1OHbpxpA-Cr3Ty2lUqKvng1T5XsgXxJTV/view?usp=sharing)

> **Note on AI features:** Resume parsing, face verification, sentiment analysis, and AI job matching are implemented and demonstrated in the video above, but are **not live** in the current deployment — the underlying ML models are too large to run on free-tier hosting. See the [AI Services repo](https://github.com/salwaaliakbar/careerTrust-AIServices) for that service's implementation.

## Overview

CareerTrust serves three user roles from one codebase:

- **Job seekers** — build a verified profile, browse and apply to jobs, track applications, request employment exit confirmation from past employers, and get AI-ranked job recommendations.
- **Employers** — post jobs, manage a company profile, review applicants, browse a verified candidate pool, and respond to employment exit requests.
- **Admins** — moderate users, companies, jobs, and exit requests from a dedicated dashboard.

## Key Features

- Role-based authentication and route protection via Clerk (job seeker / employer / admin)
- Job posting, browsing, filtering, and application tracking
- Employer company profile and candidate management
- Employment exit request workflow (jobseeker-initiated, employer-confirmed)
- Real-time notifications (Socket.IO)
- Company reputation scoring, backed by AI sentiment analysis of reviews
- AI-assisted resume parsing and job-match recommendations
- Face-verification identity check during onboarding
- Responsive, animated UI with light/dark-safe theming considerations

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Auth:** Clerk
- **State:** Redux Toolkit
- **Forms/validation:** React Hook Form, Formik, Zod, Yup
- **Realtime:** Socket.IO client
- **Other:** Axios, face-api (client-side face capture), jsPDF / html2canvas (document export), Pino (logging)

## Project Structure

```
app/          Next.js App Router pages (route groups: (auth), (public), jobseeker/*)
components/   Reusable UI components, grouped by feature/domain
constants/    Project-wide constants and API endpoint definitions
data/         Static/mock data used for previews and fallbacks
hooks/        Custom React hooks
lib/          Utility libraries (env access, API clients, auth helpers)
redux/        Redux store, slices, and hooks
services/     API service layer (one file per backend domain)
types/        Shared TypeScript types
public/       Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the [backend API](https://github.com/salwaaliakbar/careerTrust-backend)
- A Clerk application (publishable + secret key)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and fill in real values:
   ```bash
   cp .env.example .env.local
   ```
   Required variables:
   | Variable | Purpose |
   |---|---|
   | `NEXT_PUBLIC_BACKEND_API_URL` | Base URL of the Node backend (no trailing slash) |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
   | `CLERK_SECRET_KEY` | Clerk secret key (server-side) |
   | `BACKEND_API_KEY` | Shared key sent to backend-only endpoints, if applicable |
   | `AI_SERVICE_BASE_URL` | Only needed if calling the AI service directly from a Next.js API route |
   | `NODE_ENV`, `LOG_LEVEL` | Runtime/logging config |

3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build   # production build
npm run start   # run a production build
npm run lint    # lint the codebase
```

## Related Repositories

- **Backend API** — https://github.com/salwaaliakbar/careerTrust-backend
- **AI Services** — https://github.com/salwaaliakbar/careerTrust-AIServices

## Deployment

Deployed on [Vercel](https://vercel.com). Production environment variables are configured in the Vercel dashboard, mirroring `.env.example` above.

## License

Private/internal project for CareerTrust.
