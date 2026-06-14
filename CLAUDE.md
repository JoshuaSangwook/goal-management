# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:seed      # Seed database with initial data (uses tsx prisma/seed.ts)

# Prisma (after schema changes)
npx prisma generate  # Generate Prisma client (runs automatically on install)
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open Prisma Studio for database inspection
```

## Architecture Overview

This is a **Next.js 16 App Router** application with **Prisma + PostgreSQL** for data persistence and **NextAuth.js v5** for authentication. The app is deployed on Vercel with Supabase as the database provider.

### Core Data Models

The system is built around these key concepts:

1. **Goal Areas (GoalArea)**: Four domains - INTELLECTUAL, SPIRITUAL, PHYSICAL, SOCIAL
2. **Goal Items**: Individual goals within each area (e.g., "아침 큐티", "코어 운동") with period-based targets (DAILY, WEEKLY, MONTHLY, YEARLY)
3. **Check Records**: Daily check-ins tracking completion of each goal item
4. **Personal Targets**: User-specific monthly target adjustments
5. **Mission/Vision/CoreValues**: Static inspirational content

### Authentication & Authorization

- **NextAuth.js v5** with JWT strategy and Credentials provider
- User roles: `ADMIN` or `USER` (enum stored in database)
- **Admin protection**: Uses `AdminGuard` component for client-side checks, middleware for auth page redirects
- **IMPORTANT**: API routes using `bcryptjs` must have `export const runtime = 'nodejs'` (Edge Runtime incompatible)

### Database Connection

- **Supabase PostgreSQL** with connection pooling
- `DATABASE_URL` must use pooler format: `postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- Prisma client singleton pattern in `lib/prisma.ts`

### Key API Patterns

1. **Protected routes**: Use `auth()` from `@/auth` to get session
2. **Admin-only routes**: Check `session.user.role === 'ADMIN'`
3. **Public routes**: `/api/public/*` for unauthenticated data (mission, vision, core values)

### Performance Considerations

- **Progress API** (`/api/progress`): Fetches entire year's check records at once, processes in-memory to avoid N+1 queries
- **GoalCheckList**: Uses `useEffect` NOT `useMemo` for data fetching (common mistake)

### Color Coding by Goal Area

- **INTELLECTUAL (지적)**: Blue (`from-blue-500/10`)
- **SPIRITUAL (영적)**: Purple (`from-purple-500/10`)
- **PHYSICAL (신체)**: Emerald/Green (`from-emerald-500/10`)
- **SOCIAL (사회)**: Amber/Orange (`from-amber-500/10`)

### Supabase-Specific Notes

When modifying Prisma schema:
1. Enums must be created as PostgreSQL enum types first
2. Run `supabase-fix-enums.sql` or manually create enums before pushing schema
3. Use `supabase-seed.sql` to populate initial data

### Type Definitions

Custom NextAuth types are defined in `types/next-auth.d.ts`:
- Extends `Session.user` with `id`, `role`, `email`
- Extends `JWT` with same fields for token encoding

### UI Components

- Built with **shadcn/ui** (Radix UI primitives + Tailwind)
- Icons from **lucide-react**
- Charts from **recharts**
- All UI components in `components/ui/`

### Environment Variables Required

```
DATABASE_URL=postgresql://...  # Supabase connection string with pooler
NEXTAUTH_SECRET=...            # Generate with openssl rand -base64 32
NEXTAUTH_URL=https://...       # Production URL (localhost:3000 for dev)
```
