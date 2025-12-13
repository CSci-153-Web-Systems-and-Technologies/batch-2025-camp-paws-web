# Batch 2025 — Paws Web

> A web application for reporting, reviewing, and grouping stray animal reports. Built as part of the Batch 2025 web systems project — intended for campus/community volunteers and admins to record sightings, organize reports into groups, and manage administrative workflows.

## Live demo

camp-paws.vercel.app

## Tech stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS for styling
- Supabase (Postgres) for database, authentication and storage
- Recharts for charts (optional parts of the UI)
- React-Leaflet (used in admin map components)
- Vercel

## Quickstart — run locally

1. Clone the repository

```bash
git clone https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-camp-paws-web.git
cd batch-2025-camp-paws-web
```

2. Install dependencies

```bash
npm install
```

3. Environment variables

Create a `.env.local` file in the project root and add the following (replace values with your Supabase project values):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # only required for certain scripts / server-only tasks; do NOT expose in browser
```

Notes:
- The app uses a cookie-backed Supabase server client for server-side requests. For local dev you need a Supabase project and the anon/public keys.
- Avoid using the service role key in client-side code or bundling it into builds — it should only be used in trusted server contexts.

4. Start dev server

```bash
npm run dev
```

The app runs on http://localhost:3000 by default.

## Build & deployment

Build for production:

```bash
npm run build
npm run start
```

Deployment recommendation:
- Deploy on Vercel (zero-config for Next.js). Connect your GitHub repository and set the environment variables in the Vercel project settings (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and any server-only keys).

## Project structure (high level)

- `src/app/` — Next.js App Router pages and route handlers
  - `(dashboard)/` — the dashboard area, including admin and user subroutes
  - `api/` — backend route handlers (e.g., `api/groups/route.ts`)
- `src/components/` — shared React UI components (cards, buttons, modals, table, etc.)
- `src/lib/` — utilities, supabase clients, and transformers (e.g., `transformers/records.ts`)
- `src/styles/` — theme and global styles
- `src/hooks/` — custom React hooks (e.g., `useAuth`, `useToast`)
- `src/context/` — React contexts (theme, auth, etc.)
- `docs/` — SQL migrations, RLS policy notes, architecture docs and troubleshooting guides

Files/dirs worth checking first:
- `src/app/api/groups/route.ts` — group creation endpoint logic
- `src/lib/supabase/server.ts` — cookie-backed server Supabase client
- `src/lib/transformers/records.ts` — normalizers used by the admin records UI

## Features

- Report submission frontend for sightings (user flows)
- Admin dashboard with map and records views (admin-only workflows)
- Admin actions (verify, warn, suspend) — server-side endpoints wired to UI
- Theming and a small component library (Buttons, Modals, Table, Inputs, etc.)

## Database & security notes

- The project uses Supabase (Postgres) with Row-Level Security (RLS). To allow admin-only writes without exposing a service role key, define RLS policies that permit inserts/updates/deletes for authenticated admin users and server-side code that sets `created_by = auth.uid()`.

- Please request the author for the documentation

## Contributing

If you'd like to contribute:

1. Fork the repo, create a branch for your change
2. Run and test locally
3. Open a pull request with a clear description of what you changed

Please avoid committing secrets (service role keys, DB passwords). Use `.env.local` which is ignored by git.

## Troubleshooting

- If you see RLS-related errors when creating groups or inserting rows, ensure the request is authenticated server-side and that the required RLS policies have been applied.
- If you run into linting warnings, run `npm run lint` locally and follow the reported suggestions.

---

If you'd like, I can also:
- add a `CONTRIBUTING.md` with a dev workflow,
- scaffold a lightweight "ComingSoon" component and reuse it across dashboard pages,
- scaffold chart components and wire real data for the dashboard

## Planned / Coming soon

We plan to add the following features in upcoming iterations:

- Analytics — richer charts and metrics for admin and user dashboards (usage trends, reports over time, heatmaps, etc.)
- Animal groupings — group management UX and batch grouping features for stray animal reports (group editing, merge/split, and group-level attributes)
