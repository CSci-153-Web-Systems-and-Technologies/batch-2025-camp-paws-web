# Batch 2025 — CAMP-PAWS Web

> Campus Animal Monitoring Platform - Pets and Welfare System. A comprehensive web application for reporting, reviewing, and managing stray animal sightings on campus. Built for community volunteers and administrators to streamline animal welfare workflows.

**Version:** v1.1.0

## Live demo

[camp-paws.vercel.app](https://batch-2025-camp-paws-web.vercel.app/)

## Tech stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS** for styling with custom theme system
- **Supabase** (PostgreSQL) for database, authentication, and storage
- **react-leaflet** + Leaflet for interactive maps
- **lucide-react** for icons
- **Recharts** for data visualization (optional)
- Deployed on **Vercel**

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
  - `(dashboard)/` — Dashboard area with admin and user routes
    - `(admin)/` — Admin-only pages (map, records, verify)
    - `(user)/` — User pages (dashboard, report submission)
  - `(auth)/` — Authentication pages (login, signup)
  - `api/` — Backend API route handlers
- `src/components/` — Shared React UI components
  - `ui/` — Base components (Button, Modal, Table, Input, Card, etc.)
- `src/lib/` — Utilities and core functionality
  - `supabase/` — Supabase client configurations (client, server, middleware)
  - `middleware/` — CSRF protection, rate limiting, logging
  - `transformers/` — Data transformation utilities
- `src/hooks/` — Custom React hooks (useAuth, useToast, useSessionTimeout, etc.)
- `src/contexts/` — React contexts (ThemeContext)
- `src/styles/` — Theme configuration and global styles
- `src/types/` — TypeScript type definitions
- `docs/` — Database schema, API documentation, and migration guides
  - `new/` — Current database documentation
  - `old/` — Legacy documentation

Key files to explore:
- `src/app/(dashboard)/(user)/user-dashboard/page.tsx` — Enhanced user dashboard
- `src/app/(dashboard)/(user)/user-dashboard/components/ViewReportModal.tsx` — Report details modal
- `src/app/(dashboard)/components/Sidebar.tsx` — Navigation with profile modal
- `src/lib/supabase/server.ts` — Cookie-backed server Supabase client
- `docs/new/DATABASE_SCHEMA.md` — Comprehensive database schema documentation

## Features

### User Dashboard (v1.1.0)
- **Enhanced stats visualization** — Color-coded stat cards showing Total, Pending, Verified, and Rejected reports with icons
- **Comprehensive report details modal** — View all report information including interactive Leaflet map with location markers
- **Profile management** — User profile modal with account overview (member since, report statistics, account status)
- **Dual notes system** — Separate physical assessment notes and location description notes
- **Real-time user data** — Displays actual user information from Supabase auth and users table

### Report Submission
- Multi-step form for stray animal sighting reports
- Photo upload with preview
- Animal characteristics (species, color pattern, body condition)
- Health observations and behavior notes
- Location details with interactive map
- Separate fields for physical and location notes

### Admin Features
- Admin dashboard with map and records views
- Report verification workflow
- User action management (verify, warn, suspend)
- Campus-wide animal sighting map with clustering
- Comprehensive records management system

### Technical Features
- Server-side rendering (SSR) with Next.js App Router
- Row-Level Security (RLS) with Supabase
- Type-safe database operations with TypeScript
- Responsive design with mobile-first approach
- Cookie-based authentication with session management
- Interactive maps with react-leaflet

## Database & security notes

- The project uses Supabase (PostgreSQL) with Row-Level Security (RLS)
- RLS policies ensure users can only access their own reports and admins have elevated permissions
- Authentication is handled via Supabase Auth with cookie-based sessions
- Server-side operations use the cookie-backed Supabase client for secure data access
- Service role keys are never exposed to the client and only used in trusted server contexts

**Database Schema (v1.1.0):**
- `stray_animal_reports` — Main reports table with comprehensive animal and location data
  - Added `physical_additional_notes` field for separate physical assessment notes
- `users` — User profiles and metadata
- `animal_groups` — Animal grouping system
- `reports_to_groups` — Many-to-many relationship table

For detailed schema documentation, see [`docs/new/DATABASE_SCHEMA.md`](docs/new/DATABASE_SCHEMA.md)

## Contributing

If you'd like to contribute:

1. Fork the repo, create a branch for your change
2. Run and test locally
3. Open a pull request with a clear description of what you changed

Please avoid committing secrets (service role keys, DB passwords). Use `.env.local` which is ignored by git.

## Troubleshooting

### Common Issues

**RLS Policy Errors:**
- Ensure the request is authenticated server-side
- Verify RLS policies are correctly applied in Supabase
- Check that user roles are properly set in the users table

**Map Not Rendering:**
- Leaflet requires client-side rendering; ensure components use `'use client'` directive
- Check that Leaflet CSS is loaded in layout
- Verify marker icons are loaded from CDN

**Build/Type Errors:**
- Run `npm run lint` to check for linting issues
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npx tsc --noEmit`

**Environment Variables:**
- Verify `.env.local` has correct Supabase credentials
- After updating env vars in Vercel, trigger a new deployment
- Never commit `.env.local` or expose service role keys

For more troubleshooting guides, see the `docs/` directory.

---

## Changelog

### v1.1.0 (February 2026)
- ✨ Enhanced user dashboard with visual stats cards and icons
- ✨ Comprehensive report details modal with interactive Leaflet map
- ✨ User profile modal with account overview and statistics
- ✨ Separate physical assessment and location notes fields
- 🗄️ Database schema update: added `physical_additional_notes` column
- 🔧 Fixed CSS variable references for proper theme rendering
- 🔧 SSR-safe Leaflet implementation with dynamic imports
- 📚 Updated database schema documentation

### v1.0.0 (Initial Release)
- 🎉 Initial public release
- Core report submission and management features
- Admin dashboard with map and records views
- Authentication and user management
- RLS policies and security implementation

---

## Planned / Coming soon

We plan to add the following features in upcoming iterations:

- **Theme System** — Fully functional light/dark mode toggle (separate branch in progress)
- **Analytics Dashboard** — Richer charts and metrics for admin and user dashboards (usage trends, reports over time, heatmaps)
- **Enhanced Grouping** — Advanced group management UX with batch operations, merge/split capabilities
- **Notifications** — Email and in-app notifications for report status updates
- **Export Features** — CSV/PDF export for reports and analytics
