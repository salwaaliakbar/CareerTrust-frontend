# Deploying to Vercel

1. Import the repo into Vercel (framework preset: Next.js — auto-detected).
2. Project Settings → Environment Variables → add everything listed in `.env.example`:
   - `NEXT_PUBLIC_BACKEND_API_URL` → your Render Node-backend origin, no path suffix (e.g. `https://your-api.onrender.com`). This is the only backend URL var — the `/api` root and the Socket.IO URL are both derived from it in code (`lib/env.ts`). Do not set `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_SOCKET_URL`; they no longer exist.
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` → swap the `pk_test_`/`sk_test_` dev keys for live keys from the Clerk dashboard.
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` → required for the company-logo upload route (`app/api/upload/cloudinary/route.ts`) to work at all.
3. These are all read server-side or inlined at build time — a missing `NEXT_PUBLIC_*` var will now throw a clear build/runtime error (see `lib/env.ts`) instead of silently pointing at `localhost:4000`, so a misconfigured env shows up immediately rather than as a mystery bug in prod.
4. Deploy. No `vercel.json` is needed for a standard Next.js app unless you later add custom redirects/headers beyond what's in `next.config.ts`.
